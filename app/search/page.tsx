import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { SearchContent } from "@/components/search-content";
import {
  getLatestSaleFeature,
  getLatestDailyRecommendation,
  getWorkByNumericId,
} from "@/lib/data-loader";

export const dynamic = "force-static";

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
