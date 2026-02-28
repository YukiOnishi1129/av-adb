import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  getFeatureRecommendations,
  getActressFeatures,
} from "@/lib/data-loader";
import {
  ChevronRight,
  Heart,
  User,
  Sparkles,
} from "lucide-react";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "特集一覧 | AV-ADB",
  description: "ジャンル別・女優別のAV作品特集一覧。巨乳、ハーレム、女子校生など人気ジャンルや、人気女優の作品を厳選してお届けします。",
  openGraph: {
    title: "特集一覧 | AV-ADB",
    description: "ジャンル別・女優別のAV作品特集一覧。人気ジャンルや人気女優の作品を厳選。",
    type: "website",
  },
};

export default async function TokushuPage() {
  const [featureRecommendations, actressFeatures] = await Promise.all([
    getFeatureRecommendations(),
    getActressFeatures(),
  ]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-3xl px-4 py-4">
        {/* パンくず */}
        <nav className="mb-4 flex items-center gap-1 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">トップ</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">特集一覧</span>
        </nav>

        {/* ページヘッダー */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-6 w-6 text-amber-500" />
            <h1 className="text-xl font-bold text-foreground">特集一覧</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            ジャンル別・女優別のAV作品を厳選してお届け。迷ったらここから選べばハズレなし。
          </p>
        </div>

        {/* ジャンル特集 */}
        {featureRecommendations.length > 0 && (
          <section className="mb-10">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2 mb-4">
              <Heart className="h-5 w-5 text-blue-500" />
              ジャンル特集
            </h2>
            <div className="grid gap-3">
              {featureRecommendations.map((fr) => (
                <Link key={fr.slug} href={`/tokushu/${fr.slug}`}>
                  <Card className="overflow-hidden border border-blue-500/30 hover:border-blue-500/50 transition-all">
                    <div className="flex items-center gap-4 p-4">
                      {fr.thumbnailUrl && (
                        <div className="relative w-24 h-24 shrink-0 rounded-lg overflow-hidden">
                          <img
                            src={fr.thumbnailUrl}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Heart className="h-3.5 w-3.5 text-blue-500" />
                          <span className="text-sm font-bold text-foreground">{fr.name}特集</span>
                          <Badge variant="secondary" className="text-xs">
                            {fr.workCount}作品
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {fr.headline}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {fr.description}
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-blue-500 shrink-0" />
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* 女優特集 */}
        {actressFeatures.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <User className="h-5 w-5 text-pink-500" />
                人気女優特集
              </h2>
              <Link href="/tokushu/actress" className="text-sm text-pink-500 hover:underline flex items-center gap-1">
                すべて見る
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-3">
              {actressFeatures.slice(0, 10).map((af) => (
                <Link key={af.name} href={`/tokushu/actress/${encodeURIComponent(af.name)}`}>
                  <Card className="overflow-hidden border border-pink-500/30 hover:border-pink-500/50 transition-all">
                    <div className="flex items-center gap-4 p-4">
                      {af.representativeThumbnailUrl && (
                        <div className="relative w-24 h-24 shrink-0 rounded-lg overflow-hidden">
                          <img
                            src={af.representativeThumbnailUrl}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <User className="h-3.5 w-3.5 text-pink-500" />
                          <span className="text-sm font-bold text-foreground">{af.name}</span>
                          {af.fanzaRanking && af.fanzaRanking <= 10 && (
                            <Badge variant="secondary" className="text-xs">
                              #{af.fanzaRanking}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {af.headline}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                          <span>{af.totalWorkCount}作品</span>
                          {af.avgRating && (
                            <>
                              <span>・</span>
                              <span>★{af.avgRating.toFixed(1)}</span>
                            </>
                          )}
                          {af.saleCount > 0 && (
                            <>
                              <span>・</span>
                              <span className="text-red-500">{af.saleCount}作品セール中</span>
                            </>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-pink-500 shrink-0" />
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
