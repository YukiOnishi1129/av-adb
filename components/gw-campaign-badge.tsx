"use client";

declare global {
  interface Window {
    gtag?: (
      command: string,
      action: string,
      params?: Record<string, unknown>,
    ) => void;
  }
}

interface GwCampaignBadgeProps {
  href: string;
  workId?: string;
}

export function GwCampaignBadge({ href, workId }: GwCampaignBadgeProps) {
  const handleClick = () => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "gw_campaign_badge_click", {
        work_id: workId,
        source: "work_detail",
        transport_type: "beacon",
      });
    }
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="mb-3 flex items-center justify-center gap-2 rounded-md bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 px-3 py-2 text-sm font-bold text-white shadow-md transition-transform hover:scale-[1.02]"
    >
      <span>🎉</span>
      <span>GOLDEN WEEK 50%OFF キャンペーン対象</span>
      <span className="text-xs opacity-90">→ 特集を見る</span>
    </a>
  );
}
