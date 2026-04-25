import type { Metadata } from "next";
import { Flame } from "lucide-react";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { FeaturedBanners } from "@/components/featured-banners";
import { SaleFilterSort } from "@/components/sale-filter-sort";

export const metadata: Metadata = {
  title: "セール中のAV動画一覧 - 最大80%OFFのお得な作品 | AV-ADB",
  description: "FANZAでセール中のアダルトAV動画を厳選レビュー。割引率・価格順で並び替え可能。最大80%OFFの大型セール作品から、500円以下のお買い得作品までまとめてチェック。レビュー・感想・抜きどころも掲載。",
  alternates: { canonical: "/sale/" },
};
import {
  getWorks,
  getLatestSaleFeature,
  getLatestDailyRecommendation,
  getWorkByNumericId,
} from "@/lib/data-loader";
import type { SearchItem } from "@/lib/search";

export const dynamic = "force-static";

// Work → SearchItem 変換
function workToSearchItem(work: {
  id: string;
  title: string;
  thumbnailUrl: string;
  actresses: string[];
  genres: string[];
  maker: string;
  price: number;
  listPrice: number;
  discountPercent: number;
  rating: number;
  reviewCount: number;
  releaseDate: string;
  duration: number;
  rankingPosition: number | null;
}): SearchItem {
  const isOnSale = work.discountPercent > 0;
  const actressCount = work.actresses.length || 1;

  return {
    id: work.id,
    t: work.title,
    ac: work.actresses,
    g: work.genres,
    mk: work.maker,
    p: work.price,
    lp: work.listPrice,
    dr: work.discountPercent,
    img: work.thumbnailUrl,
    rt: work.rating,
    rc: work.reviewCount,
    rel: work.releaseDate,
    dur: work.duration,
    rk: work.rankingPosition,
    sale: isOnSale,
    acnt: actressCount,
  };
}

export default async function SalePage() {
  const [works, saleFeature, dailyRecommendation] = await Promise.all([
    getWorks(),
    getLatestSaleFeature(),
    getLatestDailyRecommendation(),
  ]);

  // セール中の作品をフィルタ（price < listPrice）
  const saleWorks = works.filter((w) => w.listPrice > 0 && w.price < w.listPrice);

  // SearchItem形式に変換
  const saleItems: SearchItem[] = saleWorks.map(workToSearchItem);

  // セール特集のメイン作品のサムネイルを取得
  let saleThumbnailUrl: string | null = saleFeature?.featuredThumbnailUrl || null;
  if (!saleThumbnailUrl && saleFeature?.featuredWorkId) {
    const mainWork = await getWorkByNumericId(saleFeature.featuredWorkId);
    saleThumbnailUrl = mainWork?.thumbnailUrl || null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-5xl px-4 py-4 pb-24 lg:pb-6">
        {/* コンパクトヘッダー */}
        <div className="mb-4 flex items-center gap-2">
          <Flame className="h-5 w-5 text-red-500" />
          <h1 className="text-xl font-bold text-foreground">セール中の作品</h1>
          <span className="text-sm text-muted-foreground">
            （{saleItems.length}件）
          </span>
        </div>

        {/* 今日のおすすめ & セール特集バナー */}
        <FeaturedBanners
          saleFeature={saleFeature}
          saleThumbnailUrl={saleThumbnailUrl}
          dailyRecommendation={dailyRecommendation}
        />

        {/* フィルター・ソート付き作品一覧 */}
        <SaleFilterSort items={saleItems} />
      </main>

      <Footer />
    </div>
  );
}
