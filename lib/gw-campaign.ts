import type { Work } from "./data-loader";

// FANZA動画 GOLDEN WEEK 50%OFFキャンペーン
// 詳細: https://video.dmm.co.jp/feature/half/
// 対象作品の判別: タイトルに「【50%OFFキャンペーン第○弾】」の表記がついた作品

const GW_CAMPAIGN_LANDING_URL = "https://video.dmm.co.jp/feature/half/";
const FANZA_AFFILIATE_ID = "monodata-994";

// キャンペーン全体の終了日（最終弾の終了 = 第11弾 2026/05/15 09:59）
const CAMPAIGN_END = new Date("2026-05-15T09:59:00+09:00");

// キャンペーン全体が現時点で有効か
export function isGwCampaignActive(now: Date = new Date()): boolean {
  return now.getTime() <= CAMPAIGN_END.getTime();
}

// タイトルに「【50%OFFキャンペーン第○弾】」が含まれるか判定
const GW_TITLE_PATTERN = /【50%OFFキャンペーン第\d+弾】/;

export function isGwCampaignWork(work: Work): boolean {
  if (!isGwCampaignActive()) return false;
  if (!work.title) return false;
  return GW_TITLE_PATTERN.test(work.title);
}

// アフィリエイトリダイレクト経由のキャンペーン特集ページURL
// ch=toolbar&ch_id=link は DMM公式ツールバーの正規フォーマット
export function getGwCampaignAffiliateUrl(): string {
  return `https://al.fanza.co.jp/?lurl=${encodeURIComponent(GW_CAMPAIGN_LANDING_URL)}&af_id=${FANZA_AFFILIATE_ID}&ch=toolbar&ch_id=link`;
}
