"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

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
  // キャンペーン終了日時（ISO 8601）。hydration時に期限切れなら非表示にする
  endDate?: string;
}

export function GwCampaignBadge({
  href,
  workId,
  endDate,
}: GwCampaignBadgeProps) {
  // SSR/SSG 時は false（バッジ表示）、hydration 後にクライアントで期限判定
  const isExpired = useSyncExternalStore(
    subscribe,
    () => {
      if (!endDate) return false;
      const end = new Date(endDate).getTime();
      return Number.isFinite(end) && Date.now() > end;
    },
    () => false,
  );

  const handleClick = () => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "gw_campaign_badge_click", {
        work_id: workId,
        source: "work_detail",
        transport_type: "beacon",
      });
    }
  };

  if (isExpired) return null;

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
