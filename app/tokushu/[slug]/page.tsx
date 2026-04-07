import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { FanzaLink } from "@/components/fanza-link";
import { SisterSiteBanner } from "@/components/sister-site-banner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  getFeatureRecommendationBySlug,
  getAllFeatureSlugs,
  getFeatureRecommendations,
  getWorkByNumericId,
  getActressFeatures,
  getLatestSaleFeature,
  type Work,
  type FeatureRecommendedWork,
} from "@/lib/data-loader";
import {
  Star,
  Clock,
  ThumbsUp,
  Users,
  Sparkles,
  ChevronRight,
  Heart,
  User,
  ExternalLink,
  Search,
} from "lucide-react";

export const dynamic = "force-static";

// 静的パラメータを生成
export async function generateStaticParams() {
  const slugs = await getAllFeatureSlugs();
  if (slugs.length === 0) {
    // output: "export" では空配列だとビルドエラーになるため、ダミーを返す
    // ページ側で notFound() が呼ばれるので実害なし
    return [{ slug: "_placeholder" }];
  }
  return slugs.map((slug) => ({ slug }));
}

// メタデータを動的生成
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const feature = await getFeatureRecommendationBySlug(slug);
  if (!feature) {
    return { title: "特集ページ | AV-ADB" };
  }

  const year = new Date().getFullYear();
  const title = `【${year}年】${feature.name}AVおすすめ${feature.workCount}選 レビュー・感想｜厳選AV作品 | AV-ADB`;
  const description = `${feature.name}好きにおすすめのAV作品を厳選${feature.workCount}作品レビュー。${
    feature.headline || `${feature.name}ジャンルで評価の高い作品`
  }をランキング形式で掲載。感想・セール情報も随時更新中。`;

  const ogImage = feature.thumbnailUrl || undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      ...(ogImage && { images: [{ url: ogImage }] }),
    },
  };
}

function formatPrice(price: number): string {
  return `¥${price.toLocaleString()}`;
}

// おすすめカード
function RecommendationCard({
  work,
  reason,
  targetAudience,
  rank,
}: {
  work: Work;
  reason: string;
  targetAudience: string;
  rank: number;
}) {
  const isOnSale = work.listPrice > 0 && work.price < work.listPrice;

  return (
    <Card className="overflow-hidden border border-border hover:border-primary/50 transition-all">
      <div className="p-4">
        {/* ランクバッジ */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
              rank === 1 ? "bg-amber-500 text-white" :
              rank === 2 ? "bg-gray-400 text-white" :
              rank === 3 ? "bg-amber-700 text-white" :
              "bg-muted text-muted-foreground"
            }`}>
              {rank}
            </div>
            <Badge variant="secondary" className="text-xs">
              {work.duration > 0 ? `${work.duration}分` : ""}
            </Badge>
          </div>
          {isOnSale && work.discountPercent > 0 && (
            <Badge variant="destructive" className="text-xs">
              {work.discountPercent}%OFF
            </Badge>
          )}
        </div>

        <Link href={`/works/${work.id}`}>
          {/* サムネイル */}
          <div className="relative aspect-video overflow-hidden rounded-lg bg-muted mb-3">
            <img
              src={work.thumbnailUrl || "https://placehold.co/400x225/f4f4f5/71717a?text=No"}
              alt={work.title}
              className="h-full w-full object-cover transition-transform hover:scale-105"
            />
            {work.duration > 0 && (
              <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/70 text-white px-2 py-1 rounded text-xs">
                <Clock className="h-3 w-3" />
                {work.duration}分
              </div>
            )}
          </div>

          {/* タイトル */}
          <h3 className="text-base font-bold line-clamp-2 text-foreground hover:text-primary transition-colors mb-2">
            {work.title}
          </h3>
        </Link>

        {/* 女優名 */}
        {work.actresses.length > 0 && (
          <p className="text-xs text-muted-foreground mb-2">
            {work.actresses.join(", ")}
          </p>
        )}

        {/* 評価・価格 */}
        <div className="flex flex-wrap items-center gap-3 mb-3">
          {work.rating > 0 && (
            <div className="flex items-center gap-1">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-3.5 w-3.5 ${
                      star <= Math.round(work.rating)
                        ? "fill-amber-400 text-amber-400"
                        : "fill-muted text-muted"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-bold text-amber-500">
                {work.rating.toFixed(1)}
              </span>
              {work.reviewCount > 0 && (
                <span className="text-xs text-muted-foreground">
                  ({work.reviewCount}件)
                </span>
              )}
            </div>
          )}
          <div className="flex items-baseline gap-2">
            {isOnSale && (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(work.listPrice)}
              </span>
            )}
            <span className={`text-lg font-bold ${isOnSale ? "text-red-500" : "text-foreground"}`}>
              {formatPrice(work.price)}
            </span>
          </div>
        </div>

        {/* おすすめ理由 */}
        <div className="mb-3 p-3 bg-primary/5 rounded-lg border border-primary/20">
          <div className="flex items-center gap-2 mb-1">
            <ThumbsUp className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-bold text-primary">おすすめポイント</span>
          </div>
          <p className="text-sm text-foreground leading-relaxed">
            {reason}
          </p>
        </div>

        {/* こんな人におすすめ */}
        <div className="mb-3 p-3 bg-card rounded-lg border border-border">
          <div className="flex items-center gap-2 mb-1">
            <Users className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs font-bold text-muted-foreground">こんな人におすすめ</span>
          </div>
          <p className="text-sm text-foreground leading-relaxed">
            {targetAudience}
          </p>
        </div>

        {/* ボタン */}
        <div className="flex gap-2">
          <Link href={`/works/${work.id}`} className="flex-1">
            <Button size="sm" className="w-full bg-primary hover:bg-primary/90 text-white text-xs font-bold">
              詳細を見る
            </Button>
          </Link>
          {work.fanzaUrl && (
            <FanzaLink url={work.fanzaUrl} contentId={work.id} source="tokushu" className="flex-1">
              <Button variant="outline" size="sm" className="w-full text-xs">
                FANZA
                <ExternalLink className="h-3 w-3 ml-1" />
              </Button>
            </FanzaLink>
          )}
        </div>
      </div>
    </Card>
  );
}

export default async function FeatureSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const feature = await getFeatureRecommendationBySlug(slug);

  if (!feature) {
    notFound();
  }

  // 単体作品データを取得
  const soloWorks: { work: Work; rec: FeatureRecommendedWork }[] = [];
  for (const rec of feature.soloRecommendedWorks) {
    const work = await getWorkByNumericId(rec.work_id);
    if (work) {
      soloWorks.push({ work, rec });
    }
  }

  // 共演作品データを取得
  const multiWorks: { work: Work; rec: FeatureRecommendedWork }[] = [];
  for (const rec of feature.multiRecommendedWorks) {
    const work = await getWorkByNumericId(rec.work_id);
    if (work) {
      multiWorks.push({ work, rec });
    }
  }

  // 他のデータを取得
  const [allFeatures, actressFeatures, saleFeature] = await Promise.all([
    getFeatureRecommendations(),
    getActressFeatures(),
    getLatestSaleFeature(),
  ]);

  // 他の特集（自分自身を除外）
  const otherFeatures = allFeatures.filter((f) => f.slug !== slug);

  // 更新日をフォーマット
  const formatUpdatedAt = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-3xl px-4 py-4">
        {/* パンくず */}
        <nav className="mb-4 flex items-center gap-1 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">トップ</Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/tokushu" className="hover:text-foreground">特集一覧</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">{feature.name}特集</span>
        </nav>

        {/* ページヘッダー */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="h-6 w-6 text-blue-500" />
            <h1 className="text-xl font-bold text-foreground">
              {feature.headline}
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            {feature.description}
          </p>
          <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
            <Badge variant="secondary">{feature.workCount}作品</Badge>
            <span>{formatUpdatedAt(feature.updatedAt)} 更新</span>
          </div>
        </div>

        {/* SEO用リード文セクション */}
        <section className="mb-8 p-4 bg-card rounded-lg border border-border">
          <h2 className="text-base font-bold text-foreground mb-3">
            {feature.name}とは？
          </h2>
          <div className="text-sm text-muted-foreground leading-relaxed space-y-2">
            <p>
              「{feature.name}」ジャンルのAV作品は、{feature.name}好きにはたまらない特別な体験を提供してくれます。
              本ページでは、FANZAで販売されている{feature.name}AV作品の中から、
              <strong className="text-foreground">レビュー評価が高く、購入者から特に好評</strong>な作品を厳選してご紹介しています。
            </p>
            <p>
              「ハズレを引きたくない」「どれを買えばいいか迷っている」という方は、
              まずは上位ランキングの作品から試してみてください。
              セール中の作品も随時更新しているので、お得に購入するチャンスもお見逃しなく。
            </p>
          </div>
        </section>

        {/* 単体作品おすすめ */}
        {soloWorks.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Star className="h-5 w-5 text-amber-500" />
              <h2 className="text-lg font-bold text-foreground">{feature.name}単体作品BEST</h2>
              <Badge variant="secondary" className="text-xs">
                TOP {soloWorks.length}
              </Badge>
            </div>
            <div className="grid gap-4">
              {soloWorks.map(({ work, rec }, index) => (
                <RecommendationCard
                  key={work.id}
                  work={work}
                  reason={rec.reason || work.aiRecommendReason || "人気のAV作品です"}
                  targetAudience={rec.target_audience || work.aiTargetAudience || "AV作品を楽しみたい方"}
                  rank={index + 1}
                />
              ))}
            </div>
          </section>
        )}

        {/* 共演作品おすすめ */}
        {multiWorks.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-5 w-5 text-purple-500" />
              <h2 className="text-lg font-bold text-foreground">{feature.name}共演作品BEST</h2>
              <Badge variant="secondary" className="text-xs">
                TOP {multiWorks.length}
              </Badge>
            </div>
            <div className="grid gap-4">
              {multiWorks.map(({ work, rec }, index) => (
                <RecommendationCard
                  key={work.id}
                  work={work}
                  reason={rec.reason || work.aiRecommendReason || "人気のAV作品です"}
                  targetAudience={rec.target_audience || work.aiTargetAudience || "AV作品を楽しみたい方"}
                  rank={index + 1}
                />
              ))}
            </div>
          </section>
        )}

        {/* このジャンルの作品をもっと見る */}
        <div className="mt-8 mb-10">
          <Link href={`/search?q=${encodeURIComponent(feature.name)}`}>
            <Card className="overflow-hidden border-2 border-primary hover:border-primary/80 transition-all bg-gradient-to-r from-primary/10 to-primary/5">
              <div className="flex items-center justify-between p-5">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground">
                    <Search className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-base font-bold text-foreground">
                      「{feature.name}」の作品をもっと見る
                    </p>
                    <p className="text-sm text-muted-foreground">
                      検索ページで絞り込み・並び替え
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-primary font-bold">
                  <span className="text-sm hidden sm:inline">検索</span>
                  <ChevronRight className="h-6 w-6" />
                </div>
              </div>
            </Card>
          </Link>
        </div>

        {/* 女優特集 */}
        {actressFeatures.length > 0 && (
          <section className="mt-10 space-y-3">
            <h3 className="text-sm font-bold text-muted-foreground flex items-center gap-2">
              <User className="h-4 w-4 text-pink-500" />
              人気女優特集
            </h3>
            <div className="grid gap-3">
              {actressFeatures.slice(0, 5).map((af) => (
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
                      </div>
                      <ChevronRight className="h-5 w-5 text-pink-500 shrink-0" />
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* 他のジャンル特集 */}
        {otherFeatures.length > 0 && (
          <section className="mt-8 space-y-3">
            <h3 className="text-sm font-bold text-muted-foreground flex items-center gap-2">
              <Heart className="h-4 w-4 text-blue-500" />
              他のジャンル特集
            </h3>
            <div className="grid gap-3">
              {otherFeatures.map((fr) => (
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
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {fr.headline}
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

        {/* セール特集への誘導 */}
        {saleFeature && (
          <section className="mt-8">
            <Link href="/sale/tokushu">
              <Card className="overflow-hidden border border-red-500/30 hover:border-red-500/50 transition-all">
                <div className="flex items-center gap-4 p-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500/20">
                    <Sparkles className="h-6 w-6 text-red-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-red-500">
                        今日のセール特集
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      最大{saleFeature.maxDiscountRate}%OFF！{saleFeature.totalSaleCount}作品がセール中
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-red-500 shrink-0" />
                </div>
              </Card>
            </Link>
          </section>
        )}

        {/* 姉妹サイトバナー */}
        <SisterSiteBanner />
      </main>

      <Footer />
    </div>
  );
}
