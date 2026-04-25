import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Users } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { FeaturedBanners } from "@/components/featured-banners";
import { ActressListContent } from "@/components/actress-list-content";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  alternates: { canonical: "/actresses/" },
};
import {
  getActresses,
  getLatestSaleFeature,
  getLatestDailyRecommendation,
  getWorkByNumericId,
  getActressFeatures,
} from "@/lib/data-loader";

export const dynamic = "force-static";

export default async function ActressesPage() {
  const [actresses, saleFeature, dailyRecommendation, actressFeatures] =
    await Promise.all([
      getActresses(),
      getLatestSaleFeature(),
      getLatestDailyRecommendation(),
      getActressFeatures(),
    ]);

  // セール特集のメイン作品のサムネイルを取得
  let saleThumbnailUrl: string | null = saleFeature?.featuredThumbnailUrl || null;
  if (!saleThumbnailUrl && saleFeature?.mainWorkId) {
    const mainWork = await getWorkByNumericId(saleFeature.mainWorkId);
    saleThumbnailUrl = mainWork?.thumbnailUrl || null;
  }

  // 女優特集の代表サムネイルを取得
  const actressFeatureThumbnail = actressFeatures[0]?.representativeThumbnailUrl || null;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-3xl px-4 py-4">
        {/* バナー */}
        <FeaturedBanners
          saleFeature={saleFeature}
          saleThumbnailUrl={saleThumbnailUrl}
          dailyRecommendation={dailyRecommendation}
        />

        {/* 人気女優特集への導線 */}
        {actressFeatures.length > 0 && (
          <Link href="/tokushu/actress">
            <Card className="mb-6 overflow-hidden border border-pink-500/30 hover:border-pink-500/50 transition-all">
              {actressFeatureThumbnail ? (
                <div className="relative aspect-[21/9] overflow-hidden">
                  <img
                    src={actressFeatureThumbnail}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  {/* 上下グラデーション */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent" />
                  {/* ラベル */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-sm font-bold text-white bg-pink-500" style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.5)" }}>
                    💕 人気女優特集
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-base font-bold text-white mb-1" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.9)" }}>
                          人気女優のおすすめ作品を厳選紹介
                        </p>
                        <p className="text-sm text-white/80" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.9)" }}>
                          {actressFeatures.length}人の人気女優を特集中
                        </p>
                      </div>
                      <ChevronRight className="h-6 w-6 text-white shrink-0" style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.8))" }} />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4 p-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-pink-500/20 shrink-0">
                    <Users className="h-6 w-6 text-pink-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="h-4 w-4 text-pink-500" />
                      <span className="text-sm font-bold text-pink-500">人気女優特集</span>
                      <Badge variant="outline" className="text-xs">
                        {actressFeatures.length}人
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      人気女優のおすすめ作品を厳選紹介
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-pink-500 shrink-0" />
                </div>
              )}
            </Card>
          </Link>
        )}

        <ActressListContent
          actresses={actresses}
          rankedActresses={actressFeatures.map((f) => ({
            name: f.name,
            slug: f.slug,
            fanzaRanking: f.fanzaRanking ?? 999,
            totalWorkCount: f.totalWorkCount,
          }))}
        />
      </main>

      <Footer />
    </div>
  );
}
