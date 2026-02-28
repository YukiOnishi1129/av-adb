import Link from "next/link";
import { Sparkles, Trophy, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { FeatureCarousel, FeatureGridCarousel } from "@/components/feature-carousel";
import type { FeatureRecommendationView, ActressFeatureView, SaleFeatureView, DailyRecommendationView } from "@/lib/data-loader";

interface FeaturedBannersProps {
  saleFeature?: SaleFeatureView | null;
  saleThumbnailUrl?: string | null;  // セール特集のサムネイル（saleFeatureにない場合の補完用）
  dailyRecommendation?: DailyRecommendationView | null;
  features?: FeatureRecommendationView[];
  actressFeatures?: ActressFeatureView[];
}

// 日付を「1/15」形式にフォーマット
function formatShortDate(dateStr: string): string {
  const date = new Date(dateStr);
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

export function FeaturedBanners({
  saleFeature,
  saleThumbnailUrl,
  dailyRecommendation,
  features = [],
  actressFeatures = [],
}: FeaturedBannersProps) {
  // セール特集サムネイル（featuredThumbnailUrlがあればそれを、なければ補完用を使う）
  const effectiveSaleThumbnail = saleFeature?.featuredThumbnailUrl || saleThumbnailUrl;

  // セール特集タイトル
  const saleTitle = saleFeature?.targetDate
    ? `${formatShortDate(saleFeature.targetDate)}のセール特集`
    : "セール特集";

  // セール特集サブテキスト
  const saleSubtext = saleFeature
    ? `最大${saleFeature.maxDiscountRate}%OFF！`
    : "厳選おすすめ作品";

  // 今日のおすすめサブテキスト
  const recommendationSubtext = dailyRecommendation
    ? "迷ったらここから選べばハズレなし"
    : "迷ったらコレ見とけ";

  const hasFeatures = features.length > 0 || actressFeatures.length > 0;

  return (
    <div className="mb-6 space-y-3 md:space-y-4">
      {/* 上段: 今日のおすすめとセール特集（2カラム） */}
      <div className="grid grid-cols-2 gap-3 md:gap-4">
        {/* 今日のおすすめ（左） */}
        <Link href="/recommendations">
          <Card className="overflow-hidden border border-amber-500/30 hover:border-amber-500/50 transition-all h-full">
            {/* スマホ: 画像大きめ + オーバーレイテキスト */}
            <div className="relative md:hidden">
              {dailyRecommendation?.recommendedWorks[0]?.thumbnail_url ? (
                <div className="relative aspect-4/3 overflow-hidden">
                  <img
                    src={dailyRecommendation.recommendedWorks[0].thumbnail_url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  {/* 上下グラデーション */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent" />
                  {/* ラベル */}
                  <div className="absolute top-2 left-2 px-2.5 py-1 rounded-md text-sm font-bold text-white bg-amber-500" style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.5)" }}>
                    🏆 今日のおすすめ
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-2">
                    <div className="flex items-center gap-1 mb-0.5">
                      <Trophy className="h-3 w-3 shrink-0 text-amber-400" style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.8))" }} />
                      <span className="text-[10px] font-bold text-white whitespace-nowrap" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.9)" }}>今日の間違いないやつ</span>
                    </div>
                    <p className="text-[9px] font-bold text-white/80 line-clamp-1" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.9)" }}>
                      {recommendationSubtext}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/20 shrink-0">
                    <Trophy className="h-5 w-5 text-amber-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-bold text-amber-500">今日の間違いないやつ</span>
                  </div>
                </div>
              )}
            </div>

            {/* PC: 横並びレイアウト */}
            <div className="hidden md:flex items-center gap-4 p-4">
              {dailyRecommendation?.recommendedWorks[0]?.thumbnail_url ? (
                <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden">
                  <img
                    src={dailyRecommendation.recommendedWorks[0].thumbnail_url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-transparent" />
                </div>
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/20 shrink-0">
                  <Trophy className="h-6 w-6 text-amber-500" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Trophy className="h-5 w-5 text-amber-500" />
                  <span className="text-base font-bold text-amber-500">今日の間違いないやつ</span>
                </div>
                <p className="text-sm font-bold text-muted-foreground">
                  {recommendationSubtext}
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-amber-500 shrink-0" />
            </div>
          </Card>
        </Link>

        {/* セール特集（右） */}
        <Link href="/sale/tokushu">
          <Card className="overflow-hidden border border-red-500/30 hover:border-red-500/50 transition-all h-full">
            {/* スマホ: 画像大きめ + オーバーレイテキスト */}
            <div className="relative md:hidden">
              {effectiveSaleThumbnail ? (
                <div className="relative aspect-4/3 overflow-hidden">
                  <img
                    src={effectiveSaleThumbnail}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  {/* 上下グラデーション */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent" />
                  {/* ラベル */}
                  <div className="absolute top-2 left-2 px-2.5 py-1 rounded-md text-sm font-bold text-white bg-red-500" style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.5)" }}>
                    🔥 セール特集
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-2">
                    <div className="flex items-center gap-1 mb-0.5">
                      <Sparkles className="h-3 w-3 shrink-0 text-red-400" style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.8))" }} />
                      <span className="text-[10px] font-bold text-white whitespace-nowrap" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.9)" }}>{saleTitle}</span>
                    </div>
                    <p className="text-[9px] font-bold text-white/80 line-clamp-1" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.9)" }}>
                      {saleSubtext}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-2 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500/20 shrink-0">
                    <Sparkles className="h-4 w-4 text-red-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-red-500 whitespace-nowrap">{saleTitle}</span>
                  </div>
                </div>
              )}
            </div>

            {/* PC: 横並びレイアウト */}
            <div className="hidden md:flex items-center gap-4 p-4">
              {effectiveSaleThumbnail ? (
                <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden">
                  <img
                    src={effectiveSaleThumbnail}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-transparent" />
                </div>
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500/20 shrink-0">
                  <Sparkles className="h-6 w-6 text-red-500" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="h-5 w-5 text-red-500" />
                  <span className="text-base font-bold text-red-500">{saleTitle}</span>
                </div>
                <p className="text-sm font-bold text-muted-foreground">
                  {saleSubtext}
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-red-500 shrink-0" />
            </div>
          </Card>
        </Link>
      </div>

      {/* 下段: 性癖特集 + 女優特集（混合カルーセル） */}
      {hasFeatures && (
        <>
          {/* スマホ: カルーセル */}
          <div className="md:hidden">
            <FeatureCarousel features={features} actressFeatures={actressFeatures} />
          </div>
          {/* PC: 横スライドカルーセル（5カラム表示） */}
          <div className="hidden md:block">
            <FeatureGridCarousel features={features} actressFeatures={actressFeatures} />
          </div>
        </>
      )}
    </div>
  );
}
