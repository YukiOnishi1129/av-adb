import type { Work } from "./data-loader";

// FANZA動画 初回購入限定クーポン（無料会員登録のみで取得可能）
// 詳細: https://www.dmm.co.jp/digital/-/welcome-coupon/
const FANZA_VIDEO_COUPON_OFF = 500;
const FANZA_VIDEO_COUPON_LANDING_URL =
  "https://www.dmm.co.jp/digital/-/welcome-coupon/";
const MIN_PURCHASE_AMOUNT = 501;

const FANZA_AFFILIATE_ID = "monodata-994";

// キャンペーン終了日（YYYY-MM-DD JST）
// 公式に終了日の記載が無いため、暫定で四半期末の 2026-07-31 を設定
// 終了日が不明確な状態で延々と表示し続けないための安全装置
// 期限が分かったら更新、または期限なしの確証が取れたら null にする
const CAMPAIGN_END_DATE: string | null = "2026-07-31";

// キャンペーンが現時点で有効か判定（JST 23:59:59 まで有効）
function isCampaignActive(now: Date = new Date()): boolean {
  if (!CAMPAIGN_END_DATE) return true;
  const end = new Date(`${CAMPAIGN_END_DATE}T23:59:59+09:00`);
  return now.getTime() <= end.getTime();
}

// アフィリエイトリダイレクト経由のクーポン取得URLを生成
// ch=toolbar&ch_id=link は DMM公式ツールバーの正規フォーマット
function buildCouponAffiliateUrl(): string {
  return `https://al.fanza.co.jp/?lurl=${encodeURIComponent(FANZA_VIDEO_COUPON_LANDING_URL)}&af_id=${FANZA_AFFILIATE_ID}&ch=toolbar&ch_id=link`;
}

export interface FanzaInitialDiscount {
  couponOff: number;
  effectivePrice: number;
  couponLandingUrl: string;
}

export function getFanzaInitialDiscount(
  work: Work,
): FanzaInitialDiscount | null {
  if (!work.fanzaUrl || !work.price) return null;

  // セール後の実価格が501円以上か
  if (work.price < MIN_PURCHASE_AMOUNT) return null;

  // キャンペーン期間外なら表示しない
  if (!isCampaignActive()) return null;

  return {
    couponOff: FANZA_VIDEO_COUPON_OFF,
    effectivePrice: work.price - FANZA_VIDEO_COUPON_OFF,
    couponLandingUrl: buildCouponAffiliateUrl(),
  };
}
