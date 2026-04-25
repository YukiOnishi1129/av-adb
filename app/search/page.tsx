import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { SearchContent } from "@/components/search-content";
import {
  getLatestSaleFeature,
  getLatestDailyRecommendation,
  getWorkByNumericId,
} from "@/lib/data-loader";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "AV動画検索 - 女優・ジャンル・価格で絞り込み | AV-ADB",
  description: "FANZAアダルトAV動画をキーワード・女優・ジャンル・価格・評価で絞り込み検索。中出し・痴女・巨乳・人妻など人気ジャンル別、セール中・お買い得作品も検索可能。レビュー・感想・抜きどころも掲載。",
  alternates: { canonical: "/search/" },
};

export default async function SearchPage() {
  const [saleFeature, dailyRecommendation] = await Promise.all([
    getLatestSaleFeature(),
    getLatestDailyRecommendation(),
  ]);

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
        <SearchContent
          saleFeature={saleFeature}
          saleThumbnailUrl={saleThumbnailUrl}
          dailyRecommendation={dailyRecommendation}
        />
      </main>

      <Footer />
    </div>
  );
}
