import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { WorkCard } from "@/components/work-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FanzaLink } from "@/components/fanza-link";
import {
  getLatestSaleFeature,
  getWorkByNumericId,
  getWorksByNumericIds,
  getFeatureRecommendations,
  getActressFeatures,
  type Work,
} from "@/lib/data-loader";
import {
  Flame,
  Clock,
  Star,
  Zap,
  ChevronRight,
  Sparkles,
  Heart,
  User,
  ExternalLink,
} from "lucide-react";

export const dynamic = "force-static";

export async function generateMetadata(): Promise<Metadata> {
  const saleFeature = await getLatestSaleFeature();

  const title = "今日のセール特集 | AV-ADB";
  const description = saleFeature?.mainHeadline
    ? `${saleFeature.mainHeadline} - セール中のおすすめAV作品を厳選。迷ったらここから選べばハズレなし。`
    : "セール中のおすすめAV作品を厳選。迷ったらここから選べばハズレなし。";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

function formatPrice(price: number): string {
  return `¥${price.toLocaleString()}`;
}

function getTimeRemaining(endDate: string | null): string | null {
  if (!endDate) return null;
  const end = new Date(endDate);
  const now = new Date();
  const diff = end.getTime() - now.getTime();
  if (diff <= 0) return "終了間近";
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  if (days > 0) return `残り${days}日`;
  return `残り${hours}時間`;
}

function getCTAText(discountRate: number | null): string {
  if (!discountRate) return "詳細を見る";
  if (discountRate >= 50) return `半額以下で手に入れる`;
  return `${discountRate}%OFFで手に入れる`;
}

// メインフォーカスカード
function MainFocusCard({
  work,
  headline,
}: {
  work: Work;
  headline: string;
}) {
  const isOnSale = work.listPrice > 0 && work.price < work.listPrice;
  const timeRemaining = getTimeRemaining(work.saleEndDate);

  return (
    <Card className="overflow-hidden border-2 border-red-500/50 bg-gradient-to-b from-red-500/5 to-transparent">
      <div className="p-4 sm:p-6">
        {/* ヘッドライン */}
        <div className="mb-4 flex items-center gap-2">
          <Flame className="h-6 w-6 text-red-500" />
          <h2 className="text-lg sm:text-xl font-bold text-red-500">
            {headline}
          </h2>
        </div>

        {/* 大きいサムネイル */}
        <Link href={`/works/${work.id}`}>
          <div className="relative aspect-video overflow-hidden rounded-lg bg-muted mb-4">
            <img
              src={work.thumbnailUrl || "https://placehold.co/800x450/f4f4f5/71717a?text=No+Image"}
              alt={work.title}
              className="h-full w-full object-cover transition-transform hover:scale-105"
            />
            {isOnSale && work.discountPercent > 0 && (
              <Badge
                variant="destructive"
                className="absolute top-3 left-3 text-lg px-4 py-1.5"
              >
                {work.discountPercent}%OFF
              </Badge>
            )}
            <div className="absolute bottom-3 right-3 flex gap-2">
              <Badge variant="secondary" className="bg-black/70 text-white">
                {work.duration > 0 ? `${work.duration}分` : ""}
              </Badge>
              {work.duration > 0 && (
                <Badge variant="secondary" className="bg-black/70 text-white">
                  <Clock className="h-3 w-3 mr-1" />
                  {work.duration}分
                </Badge>
              )}
            </div>
          </div>
        </Link>

        {/* タイトル */}
        <Link href={`/works/${work.id}`}>
          <h3 className="text-lg sm:text-xl font-bold text-foreground hover:text-red-500 transition-colors mb-2">
            {work.title}
          </h3>
        </Link>

        {/* 女優名 */}
        {work.actresses.length > 0 && (
          <p className="text-sm text-muted-foreground mb-3">
            {work.actresses.join(", ")}
          </p>
        )}

        {/* 評価・価格・残り時間 */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          {work.rating > 0 && (
            <div className="flex items-center gap-1">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
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
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(work.listPrice)}
              </span>
            )}
            <span className="text-2xl font-bold text-red-500">
              {formatPrice(work.price)}
            </span>
          </div>

          {timeRemaining && (
            <div className="flex items-center gap-1 text-orange-500">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-medium">{timeRemaining}</span>
            </div>
          )}
        </div>

        {/* ここがヤバい */}
        {work.aiAppealPoints && (
          <div className="mb-4 p-4 bg-card rounded-lg border border-border">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-red-500" />
              <span className="text-sm font-bold text-red-500">ここがヤバい</span>
            </div>
            <p className="text-sm text-foreground leading-relaxed">
              {work.aiAppealPoints}
            </p>
          </div>
        )}

        {/* こんな人におすすめ */}
        {work.aiTargetAudience && (
          <div className="mb-4 p-4 bg-card rounded-lg border border-border">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="h-4 w-4 text-primary" />
              <span className="text-sm font-bold text-primary">こんな人におすすめ</span>
            </div>
            <p className="text-sm text-foreground leading-relaxed">
              {work.aiTargetAudience}
            </p>
          </div>
        )}

        {/* CTAボタン */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href={`/works/${work.id}`} className="flex-1">
            <Button className="w-full bg-red-500 hover:bg-red-600 text-white text-base font-bold py-6">
              {getCTAText(work.discountPercent)}
            </Button>
          </Link>
          {work.fanzaUrl && (
            <FanzaLink url={work.fanzaUrl} contentId={work.id} source="sale_tokushu" className="flex-1">
              <Button variant="outline" className="w-full py-6 whitespace-nowrap">
                サンプルを見る
                <ExternalLink className="h-4 w-4 ml-2 shrink-0" />
              </Button>
            </FanzaLink>
          )}
        </div>
      </div>
    </Card>
  );
}

// サブカード
function SubCard({ work }: { work: Work }) {
  const isOnSale = work.listPrice > 0 && work.price < work.listPrice;
  const timeRemaining = getTimeRemaining(work.saleEndDate);

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md border border-border">
      <div className="p-4">
        <Link href={`/works/${work.id}`}>
          <div className="relative aspect-video overflow-hidden rounded-lg bg-muted mb-3">
            <img
              src={work.thumbnailUrl || "https://placehold.co/400x225/f4f4f5/71717a?text=No"}
              alt={work.title}
              className="h-full w-full object-cover transition-transform hover:scale-105"
            />
            {isOnSale && work.discountPercent > 0 && (
              <Badge variant="destructive" className="absolute top-2 left-2 text-sm px-2 py-1">
                {work.discountPercent}%OFF
              </Badge>
            )}
            {work.duration > 0 && (
              <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/70 text-white px-2 py-1 rounded text-xs">
                <Clock className="h-3 w-3" />
                {work.duration}分
              </div>
            )}
          </div>

          <h4 className="text-base font-bold line-clamp-2 text-foreground hover:text-red-500 transition-colors mb-2">
            {work.title}
          </h4>
        </Link>

        {work.actresses.length > 0 && (
          <p className="text-xs text-muted-foreground mb-2">
            {work.actresses.join(", ")}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-2 mb-3">
          {work.rating > 0 && (
            <div className="flex items-center gap-1">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-3 w-3 ${
                      star <= Math.round(work.rating)
                        ? "fill-amber-400 text-amber-400"
                        : "fill-muted text-muted"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-amber-500">
                {work.rating.toFixed(1)}
              </span>
            </div>
          )}

          <div className="flex items-baseline gap-1">
            {isOnSale && (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(work.listPrice)}
              </span>
            )}
            <span className="text-lg font-bold text-red-500">
              {formatPrice(work.price)}
            </span>
          </div>

          {timeRemaining && (
            <span className="text-xs text-orange-500 font-medium">
              {timeRemaining}
            </span>
          )}
        </div>

        {work.aiAppealPoints && (
          <div className="mb-3 p-3 bg-card rounded-lg border border-border">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="h-3 w-3 text-red-500" />
              <span className="text-xs font-bold text-red-500">ここがヤバい</span>
            </div>
            <p className="text-xs text-foreground leading-relaxed line-clamp-2">
              {work.aiAppealPoints}
            </p>
          </div>
        )}

        <Link href={`/works/${work.id}`}>
          <Button size="sm" className="w-full bg-red-500 hover:bg-red-600 text-white text-xs font-bold">
            {getCTAText(work.discountPercent)}
          </Button>
        </Link>
      </div>
    </Card>
  );
}

// 横スクロールセクション
function HorizontalScrollSection({
  title,
  icon: Icon,
  works,
}: {
  title: string;
  icon: typeof Flame;
  works: Work[];
}) {
  if (works.length === 0) return null;

  return (
    <section className="mt-8">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="h-5 w-5 text-red-500" />
        <h2 className="text-lg font-bold text-foreground">{title}</h2>
      </div>
      <div className="overflow-x-auto pb-2 -mx-4 px-4">
        <div className="flex gap-3" style={{ width: "max-content" }}>
          {works.map((work) => (
            <div key={work.id} className="w-[200px] flex-shrink-0">
              <WorkCard work={work} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default async function SaleTokushuPage() {
  const feature = await getLatestSaleFeature();

  if (!feature) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mx-auto max-w-5xl px-4 py-8">
          <p className="text-muted-foreground">特集データがありません</p>
        </main>
        <Footer />
      </div>
    );
  }

  // 作品データを取得
  const mainWork = feature.mainWorkId
    ? await getWorkByNumericId(feature.mainWorkId)
    : null;
  const sub1Work = feature.sub1WorkId
    ? await getWorkByNumericId(feature.sub1WorkId)
    : null;
  const sub2Work = feature.sub2WorkId
    ? await getWorkByNumericId(feature.sub2WorkId)
    : null;

  // 横スクロール用作品を取得
  const [cheapestWorks, highDiscountWorks, highRatingWorks, featureRecommendations, actressFeatures] = await Promise.all([
    getWorksByNumericIds(feature.cheapestWorkIds),
    getWorksByNumericIds(feature.highDiscountWorkIds),
    getWorksByNumericIds(feature.highRatingWorkIds),
    getFeatureRecommendations(),
    getActressFeatures(),
  ]);

  return (
    <div className="min-h-screen bg-background pb-20 sm:pb-0">
      <Header />

      <main className="mx-auto max-w-3xl px-4 py-4">
        {/* パンくず */}
        <nav className="mb-4 flex items-center gap-1 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">トップ</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">今日のセール特集</span>
        </nav>

        {/* ページヘッダー */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-red-500" />
            <h1 className="text-lg font-bold text-foreground">今日のセール特集</h1>
          </div>
          <div className="text-xs text-muted-foreground">
            {feature.targetDate}更新
          </div>
        </div>

        {/* メインフォーカス */}
        {mainWork && (
          <MainFocusCard work={mainWork} headline={feature.mainHeadline} />
        )}

        {/* サブ作品 */}
        {(sub1Work || sub2Work) && (
          <div className="mt-8">
            <div className="flex items-center gap-2 mb-4">
              <Star className="h-5 w-5 text-red-500" />
              <h2 className="text-lg font-bold text-foreground">他のおすすめ作品</h2>
            </div>
            <div className="flex flex-col gap-6">
              {sub1Work && <SubCard work={sub1Work} />}
              {sub2Work && <SubCard work={sub2Work} />}
            </div>
          </div>
        )}

        {/* セール統計 */}
        <div className="mt-8 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-red-500" />
              <span className="font-bold text-foreground">
                {feature.totalSaleCount}作品がセール中
              </span>
            </div>
            <Link href="/sale">
              <Button variant="outline" size="sm">
                全部見る
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="mt-2 text-xs text-red-500 font-medium">
            最大{feature.maxDiscountRate}%OFF
          </div>
        </div>

        {/* 横スクロールセクション */}
        <HorizontalScrollSection
          title="最安値TOP"
          icon={Zap}
          works={cheapestWorks}
        />

        <HorizontalScrollSection
          title="高割引率（70%OFF以上）"
          icon={Flame}
          works={highDiscountWorks}
        />

        <HorizontalScrollSection
          title="高評価（4.5以上）"
          icon={Star}
          works={highRatingWorks}
        />

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

        {/* ジャンル特集 */}
        {featureRecommendations.length > 0 && (
          <section className="mt-8 space-y-3">
            <h3 className="text-sm font-bold text-muted-foreground flex items-center gap-2">
              <Heart className="h-4 w-4 text-blue-500" />
              ジャンル特集
            </h3>
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
      </main>

      <Footer />
    </div>
  );
}
