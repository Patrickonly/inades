import { Leaf } from "lucide-react";
import { cn } from "../lib/utils";

interface AppFooterProps {
  className?: string;
  compact?: boolean;
}

const APP_VERSION = "v1.0.0";

export default function AppFooter({ className, compact = false }: AppFooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer
      className={cn(
        "relative overflow-hidden border-t border-border/80 bg-[#FFFFFF] text-foreground shadow-[0_-8px_24px_rgba(15,23,42,0.08)] dark:bg-card",
        compact ? "px-4 py-2" : "px-4 py-3 lg:px-6",
        className,
      )}
    >
      <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[#8BE000]/60" />
      <div className="inades-page-enter mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-2 text-xs leading-relaxed">
        <p className="inline-flex items-center gap-1.5 font-medium text-foreground">
          <Leaf className="h-3.5 w-3.5" />
          INADES Connect • Responsible & transparent operations • {APP_VERSION}
        </p>
        <p className="text-muted-foreground">
          © {year} INADES-Formation Rwanda • Developed by{" "}
          <a
            href="https://www.futureinnovatech.rw"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[#F28C00] underline underline-offset-2 hover:text-[#CC7600]"
          >
            FUTURE INNOVATECH LTD
          </a>
        </p>
      </div>
    </footer>
  );
}