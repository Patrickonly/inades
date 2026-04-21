import { Readable } from "node:stream";

let serverEntryPromise;

function toWebRequest(req) {
  const protocolHeader = req.headers["x-forwarded-proto"];
  const hostHeader = req.headers["x-forwarded-host"] ?? req.headers.host;

  const protocol = (Array.isArray(protocolHeader) ? protocolHeader[0] : protocolHeader) || "https";
  const host = (Array.isArray(hostHeader) ? hostHeader[0] : hostHeader) || "localhost";

  const headers = new Headers();

  for (const [key, value] of Object.entries(req.headers)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        if (item != null) headers.append(key, item);
      }
      continue;
    }

    if (value != null) headers.set(key, String(value));
  }

  const method = req.method || "GET";
  const url = `${protocol}://${host}${req.url || "/"}`;

  if (method === "GET" || method === "HEAD") {
    return new Request(url, { method, headers });
  }

  return new Request(url, {
    method,
    headers,
    body: Readable.toWeb(req),
    duplex: "half",
  });
}

async function sendWebResponse(res, response) {
  res.statusCode = response.status;

  const setCookieValues = [];

  response.headers.forEach((value, key) => {
    if (key.toLowerCase() === "set-cookie") {
      setCookieValues.push(value);
      return;
    }

    res.setHeader(key, value);
  });

  if (setCookieValues.length > 0) {
    res.setHeader("set-cookie", setCookieValues);
  }

  if (!response.body) {
    res.end();
    return;
  }

  await new Promise((resolve, reject) => {
    const stream = Readable.fromWeb(response.body);
    stream.on("error", reject);
    res.on("finish", resolve);
    stream.pipe(res);
  });
}

async function getServerEntry() {
  if (!serverEntryPromise) {
    serverEntryPromise = import("../dist/server/server.js").then((mod) => mod.default);
  }

  return serverEntryPromise;
}

export default async function handler(req, res) {
  try {
    const serverEntry = await getServerEntry();
    const request = toWebRequest(req);
    const response = await serverEntry.fetch(request);

    await sendWebResponse(res, response);
  } catch (error) {
    console.error("SSR function error:", error);
    res.statusCode = 500;
    res.setHeader("content-type", "text/plain; charset=utf-8");
    res.end("Internal Server Error");
  }
}
