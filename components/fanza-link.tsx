"use client";

declare global {
  interface Window {
    gtag?: (
      command: string,
      action: string,
      params?: Record<string, unknown>
    ) => void;
  }
}

// URLからcontent_idを抽出
function extractContentId(url: string): string | undefined {
  // FANZA: /cid=abc12345/ のような形式
  const match = url.match(/cid=([^/&]+)/);
  return match ? match[1] : undefined;
}

interface FanzaLinkProps {
  url: string;
  contentId?: string;
  source?: string;
  children: React.ReactNode;
  className?: string;
}

export function FanzaLink({
  url,
  contentId,
  source = "unknown",
  children,
  className,
}: FanzaLinkProps) {
  const handleClick = () => {
    if (typeof window !== "undefined" && window.gtag) {
      const cid = contentId || extractContentId(url);
      window.gtag("event", "fanza_click", {
        content_id: cid,
        source,
      });
    }
  };

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={className}
    >
      {children}
    </a>
  );
}
