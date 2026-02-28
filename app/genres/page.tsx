import { ChevronRight, Tag, Sparkles } from "lucide-react";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { FeaturedBanners } from "@/components/featured-banners";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  getGenres,
  getLatestSaleFeature,
  getLatestDailyRecommendation,
  getWorkByNumericId,
  getFeatureRecommendations,
} from "@/lib/data-loader";

export const dynamic = "force-static";

export default async function GenresPage() {
  const [genres, saleFeature, dailyRecommendation, featureRecommendations] =
    await Promise.all([
      getGenres(),
      getLatestSaleFeature(),
      getLatestDailyRecommendation(),
      getFeatureRecommendations(),
    ]);

  // セール特集のメイン作品のサムネイルを取得
  let saleThumbnailUrl: string | null = saleFeature?.featuredThumbnailUrl || null;
  if (!saleThumbnailUrl && saleFeature?.mainWorkId) {
    const mainWork = await getWorkByNumericId(saleFeature.mainWorkId);
    saleThumbnailUrl = mainWork?.thumbnailUrl || null;
  }

  // 性癖特集の代表サムネイルを取得
  const featureThumbnail = featureRecommendations[0]?.thumbnailUrl || null;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-3xl px-4 py-4 pb-24 lg:pb-6">
        {/* バナー */}
        <FeaturedBanners
          saleFeature={saleFeature}
          saleThumbnailUrl={saleThumbnailUrl}
          dailyRecommendation={dailyRecommendation}
        />

        {/* 性癖特集への導線 */}
        {featureRecommendations.length > 0 && (
          <Link href="/tokushu">
            <Card className="mb-6 overflow-hidden border border-purple-500/30 hover:border-purple-500/50 transition-all">
              {featureThumbnail ? (
                <div className="relative aspect-21/9 overflow-hidden">
                  <img
                    src={featureThumbnail}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  {/* 上下グラデーション */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent" />
                  {/* ラベル */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-sm font-bold text-white bg-purple-500" style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.5)" }}>
                    ✨ 性癖特集
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-base font-bold text-white mb-1" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.9)" }}>
                          あなたの性癖にぴったりの作品を厳選
                        </p>
                        <p className="text-sm text-white/80" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.9)" }}>
                          {featureRecommendations.length}種類の性癖特集
                        </p>
                      </div>
                      <ChevronRight className="h-6 w-6 text-white shrink-0" style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.8))" }} />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4 p-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-purple-500/20 shrink-0">
                    <Sparkles className="h-6 w-6 text-purple-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Sparkles className="h-4 w-4 text-purple-500" />
                      <span className="text-sm font-bold text-purple-500">性癖特集</span>
                      <Badge variant="outline" className="text-xs">
                        {featureRecommendations.length}種類
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      あなたの性癖にぴったりの作品を厳選
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-purple-500 shrink-0" />
                </div>
              )}
            </Card>
          </Link>
        )}

        {/* ヘッダー */}
        <div className="mb-4">
          <h1 className="text-xl font-bold text-foreground mb-1">ジャンル一覧</h1>
          <p className="text-sm text-muted-foreground">
            {genres.length}種類のジャンルが登録されています
          </p>
        </div>

        {genres.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {genres.map((genre) => (
              <Link
                key={genre.name}
                href={`/genres/${genre.name}`}
                className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/50"
              >
                <Tag className="h-5 w-5 text-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="font-medium truncate block">{genre.name}</span>
                </div>
                <span className="text-sm text-muted-foreground shrink-0">
                  {genre.workCount}作品
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">ジャンルがありません。</p>
        )}
      </main>

      <Footer />
    </div>
  );
}
