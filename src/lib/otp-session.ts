export type OtpSessionFlow = "login" | "reset";

export type OtpSessionContext = {
  flow: OtpSessionFlow;
  userId?: string;
  email?: string;
  redirectPath?: string;
};

const OTP_SESSION_STORAGE_KEY = "inades.otp-session-context";
const POST_LOGIN_REDIRECT_STORAGE_KEY = "inades.post-login-redirect";

function getSessionStorage(): Storage | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.sessionStorage;
}

export function setOtpSessionContext(context: OtpSessionContext): void {
  const storage = getSessionStorage();
  if (!storage) {
    return;
  }

  storage.setItem(OTP_SESSION_STORAGE_KEY, JSON.stringify(context));
}

export function getOtpSessionContext(): OtpSessionContext | null {
  const storage = getSessionStorage();
  if (!storage) {
    return null;
  }

  const raw = storage.getItem(OTP_SESSION_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<OtpSessionContext>;
    if (parsed.flow !== "login" && parsed.flow !== "reset") {
      return null;
    }

    return {
      flow: parsed.flow,
      userId: typeof parsed.userId === "string" ? parsed.userId : undefined,
      email: typeof parsed.email === "string" ? parsed.email : undefined,
      redirectPath: typeof parsed.redirectPath === "string" ? parsed.redirectPath : undefined,
    };
  } catch {
    return null;
  }
}

export function clearOtpSessionContext(): void {
  const storage = getSessionStorage();
  if (!storage) {
    return;
  }

  storage.removeItem(OTP_SESSION_STORAGE_KEY);
}

export function setPostLoginRedirectPath(path: string): void {
  const storage = getSessionStorage();
  if (!storage) {
    return;
  }

  if (!path.startsWith("/")) {
    return;
  }

  storage.setItem(POST_LOGIN_REDIRECT_STORAGE_KEY, path);
}

export function getPostLoginRedirectPath(): string | null {
  const storage = getSessionStorage();
  if (!storage) {
    return null;
  }

  const path = storage.getItem(POST_LOGIN_REDIRECT_STORAGE_KEY);
  if (!path || !path.startsWith("/")) {
    return null;
  }

  return path;
}

export function clearPostLoginRedirectPath(): void {
  const storage = getSessionStorage();
  if (!storage) {
    return;
  }

  storage.removeItem(POST_LOGIN_REDIRECT_STORAGE_KEY);
}
