import { User, ChevronRight, Star, ExternalLink, Trophy, ThumbsUp, Users, Sparkles, TrendingUp, Play, Clock, Tag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WorkCard } from "@/components/work-card";
import {
  getActressFeatures,
  getActressFeatureByName,
  getWorksByActress,
  getWorksByNumericIds,
  type Work,
} from "@/lib/data-loader";

export const dynamic = "force-static";
export const dynamicParams = false;

interface Props {
  params: Promise<{ name: string }>;
}

export async function generateStaticParams() {
  const features = await getActressFeatures();
  if (features.length === 0) {
    // output: "export"では空配列だとビルドエラーになるため、ダミーを返す
    return [{ name: "_placeholder" }];
  }
  return features.map((f) => ({
    name: f.name,
  }));
}

export async function generateMetadata({ params }: Props) {
  const { name: rawName } = await params;
  const name = decodeURIComponent(rawName);
  const feature = await getActressFeatureByName(name);

  if (!feature) {
    return { title: "女優特集 | AV-ADB" };
  }

  return {
    title: `${feature.name}のAV特集 | AV-ADB`,
    description: feature.description,
  };
}

function formatPrice(price: number): string {
  return `¥${price.toLocaleString()}`;
}

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
  return (
    <Card className="overflow-hidden border border-border hover:border-pink-500/50 transition-all">
      <div className="p-4">
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
          {work.discountPercent > 0 && (
            <Badge variant="destructive" className="text-xs">
              {work.discountPercent}%OFF
            </Badge>
          )}
        </div>

        <Link href={`/works/${work.id}`}>
          <div className="relative aspect-video overflow-hidden rounded-lg bg-muted mb-3">
            <Image
              src={work.thumbnailUrl}
              alt={work.title}
              fill
              className="object-cover transition-transform hover:scale-105"
              sizes="(max-width: 768px) 100vw, 600px"
            />
            {work.duration > 0 && (
              <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/70 text-white px-2 py-1 rounded text-xs">
                <Clock className="h-3 w-3" />
                {work.duration}分
              </div>
            )}
          </div>

          <h3 className="text-base font-bold line-clamp-2 text-foreground hover:text-pink-500 transition-colors mb-2">
            {work.title}
          </h3>
        </Link>

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
              <span className="text-sm font-bold text-amber-500">{work.rating.toFixed(1)}</span>
              {work.reviewCount > 0 && (
                <span className="text-xs text-muted-foreground">({work.reviewCount}件)</span>
              )}
            </div>
          )}
          <div className="flex items-baseline gap-2">
            {work.discountPercent > 0 && (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(work.listPrice)}
              </span>
            )}
            <span className={`text-lg font-bold ${work.discountPercent > 0 ? "text-red-500" : "text-foreground"}`}>
              {formatPrice(work.price)}
            </span>
          </div>
        </div>

        <div className="mb-3 p-3 bg-pink-500/10 rounded-lg border border-pink-500/20">
          <div className="flex items-center gap-2 mb-1">
            <ThumbsUp className="h-3.5 w-3.5 text-pink-500" />
            <span className="text-xs font-bold text-pink-500">おすすめポイント</span>
          </div>
          <p className="text-sm text-foreground leading-relaxed">{reason}</p>
        </div>

        <div className="mb-3 p-3 bg-card rounded-lg border border-border">
          <div className="flex items-center gap-2 mb-1">
            <Users className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs font-bold text-muted-foreground">こんな人におすすめ</span>
          </div>
          <p className="text-sm text-foreground leading-relaxed">{targetAudience}</p>
        </div>

        <div className="flex gap-2">
          {work.fanzaUrl && (
            <a
              href={work.fanzaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-1 rounded border border-border px-3 py-2 text-xs font-bold hover:bg-muted whitespace-nowrap"
            >
              <Play className="h-3 w-3" />
              試聴してみる
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
          <Link href={`/works/${work.id}`} className="flex-1">
            <Button size="sm" className="w-full bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold">
              詳細を見る
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}

function SaleWorkCard({ work }: { work: Work }) {
  return (
    <Link href={`/works/${work.id}`} className="block">
      <Card className="overflow-hidden border border-border hover:border-red-500/50 transition-all">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <Image
            src={work.thumbnailUrl}
            alt={work.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, 200px"
          />
          {work.discountPercent > 0 && (
            <div className="absolute top-2 right-2">
              <Badge variant="destructive" className="text-xs font-bold">
                {work.discountPercent}%OFF
              </Badge>
            </div>
          )}
        </div>
        <div className="p-3">
          <h4 className="text-sm font-bold line-clamp-2 text-foreground mb-2">{work.title}</h4>
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold text-red-500">
              {formatPrice(work.price)}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}

function SimpleWorkCard({ work }: { work: Work }) {
  return (
    <Link href={`/works/${work.id}`} className="block">
      <Card className="overflow-hidden border border-border hover:border-pink-500/50 transition-all">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <Image
            src={work.thumbnailUrl}
            alt={work.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, 200px"
          />
          {work.discountPercent > 0 && (
            <div className="absolute top-2 right-2">
              <Badge variant="destructive" className="text-xs font-bold">
                {work.discountPercent}%OFF
              </Badge>
            </div>
          )}
        </div>
        <div className="p-3">
          <h4 className="text-sm font-bold line-clamp-2 text-foreground mb-2">{work.title}</h4>
          <div className="flex items-baseline gap-2">
            <span className={`text-base font-bold ${work.discountPercent > 0 ? "text-red-500" : "text-foreground"}`}>
              {formatPrice(work.price)}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}

export default async function ActressFeatureDetailPage({ params }: Props) {
  const { name: rawName } = await params;
  const name = decodeURIComponent(rawName);

  const feature = await getActressFeatureByName(name);
  if (!feature) {
    notFound();
  }

  // おすすめ作品のwork_id（数値ID）を取得
  const soloRecommendedWorkIds = (feature.soloRecommendedWorks || []).map(w => w.work_id);
  const saleWorkIds = (feature.saleWorks || []).map(w => w.work_id);

  // 数値IDで作品を取得（単体作品のみ）
  const [soloRecommendedDbWorks, saleDbWorks, allWorks] = await Promise.all([
    getWorksByNumericIds(soloRecommendedWorkIds),
    getWorksByNumericIds(saleWorkIds),
    getWorksByActress(name),
  ]);

  // reason/target_audienceのマッピング
  const soloRecMap = new Map(
    (feature.soloRecommendedWorks || []).map(r => [r.work_id, r])
  );

  // 単体おすすめ作品（詳細付き）- 実際に単体作品のみをフィルタ
  const soloRecommendedWorksWithDetails = soloRecommendedDbWorks
    .filter((work) => work.actresses.length === 1)  // 単体作品のみ
    .map((work, index) => {
      const workId = soloRecommendedWorkIds[index];
      const rec = soloRecMap.get(workId);
      return {
        work,
        reason: rec?.reason || work.aiRecommendReason || "人気の作品です",
        targetAudience: rec?.target_audience || work.aiTargetAudience || "この作品に興味がある人",
      };
    });

  // 単体作品のみを対象とする
  const soloWorks = allWorks.filter((w) => w.actresses.length === 1);

  // セール中作品
  const saleWorks = saleDbWorks.length > 0
    ? saleDbWorks
    : soloWorks.filter((w) => w.discountPercent > 0).slice(0, 6);

  // 単体作品の新着（おすすめ・セール以外）
  const newSoloWorks = soloWorks
    .filter((w) => !soloRecommendedWorksWithDetails.some(r => r.work.id === w.id) && !saleWorks.some(s => s.id === w.id))
    .sort((a, b) => b.releaseDate.localeCompare(a.releaseDate))
    .slice(0, 6);

  // 他の女優特集
  const allFeatures = await getActressFeatures();
  const otherFeatures = allFeatures
    .filter((f) => f.name !== name)
    .slice(0, 6);

  // 更新日時フォーマット
  const formatUpdatedAt = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-3xl px-4 py-4 pb-24 lg:pb-6">
        {/* パンくず */}
        <nav className="mb-4 flex items-center gap-1 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            トップ
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/tokushu/actress" className="hover:text-foreground">
            女優特集
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">{name}</span>
        </nav>

        {/* ヘッダー */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-pink-500 text-white">
              <User className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">{name}</h1>
              {feature.fanzaRanking && (
                <p className="text-sm text-muted-foreground">
                  FANZAランキング {feature.fanzaRanking}位
                </p>
              )}
            </div>
          </div>

          {/* 統計バッジ */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="secondary" className="text-xs">
              <Tag className="h-3 w-3 mr-1" />
              全{feature.totalWorkCount}作品
            </Badge>
            <Badge variant="secondary" className="text-xs">
              <User className="h-3 w-3 mr-1" />
              単独{feature.soloWorkCount}作品
            </Badge>
            {feature.avgRating && (
              <Badge variant="secondary" className="text-xs">
                <Star className="h-3 w-3 mr-1 fill-amber-400 text-amber-400" />
                平均★{feature.avgRating.toFixed(1)}
              </Badge>
            )}
            {feature.saleCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                <TrendingUp className="h-3 w-3 mr-1" />
                {feature.saleCount}作品セール中
              </Badge>
            )}
          </div>

          {/* ヘッドライン */}
          <div className="p-4 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-lg border border-pink-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-pink-500" />
              <span className="text-sm font-bold text-pink-600">今週のおすすめ</span>
            </div>
            <p className="text-base font-bold text-foreground">
              {feature.headline}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {feature.description}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              {formatUpdatedAt(feature.updatedAt)} 更新
            </p>
          </div>
        </div>

        {/* 単体作品おすすめ */}
        {soloRecommendedWorksWithDetails.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <ThumbsUp className="h-5 w-5 text-pink-500" />
              <h2 className="text-lg font-bold text-foreground">単体作品おすすめ</h2>
              <Badge variant="secondary" className="text-xs">
                {soloRecommendedWorksWithDetails.length}作品
              </Badge>
            </div>
            <div className="grid gap-4">
              {soloRecommendedWorksWithDetails.map(({ work, reason, targetAudience }, index) => (
                <RecommendationCard
                  key={work.id}
                  work={work}
                  reason={reason}
                  targetAudience={targetAudience}
                  rank={index + 1}
                />
              ))}
            </div>
          </section>
        )}

        {/* セール中作品 */}
        {saleWorks.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-red-500" />
              <h2 className="text-lg font-bold text-foreground">{name}のセール中作品</h2>
              <Badge variant="destructive" className="text-xs">
                {saleWorks.length}作品
              </Badge>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {saleWorks.map((work) => (
                <SaleWorkCard key={work.id} work={work} />
              ))}
            </div>
          </section>
        )}

        {/* 単体作品（その他） */}
        {newSoloWorks.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-pink-500" />
              <h2 className="text-lg font-bold text-foreground">{name}の単体作品</h2>
              <Badge variant="secondary" className="text-xs">
                {newSoloWorks.length}作品
              </Badge>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {newSoloWorks.map((work) => (
                <SimpleWorkCard key={work.id} work={work} />
              ))}
            </div>
          </section>
        )}

        {/* この女優の全作品を見る */}
        <div className="mt-8 mb-10">
          <Link href={`/actresses/${encodeURIComponent(name)}`}>
            <Card className="overflow-hidden border-2 border-pink-500 hover:border-pink-400 transition-all bg-gradient-to-r from-pink-500/10 to-purple-500/5">
              <div className="flex items-center justify-between p-5">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-pink-500 text-white">
                    <User className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-base font-bold text-foreground">
                      {name}の全{feature.totalWorkCount}作品を見る
                    </p>
                    <p className="text-sm text-muted-foreground">
                      出演作品を一覧表示
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-pink-500 font-bold">
                  <span className="text-sm hidden sm:inline">一覧</span>
                  <ChevronRight className="h-6 w-6" />
                </div>
              </div>
            </Card>
          </Link>
        </div>

        {/* 他の人気女優特集 */}
        {otherFeatures.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-lg font-bold text-foreground">他の人気女優特集</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {otherFeatures.map((f) => (
                <Link key={f.id} href={`/tokushu/actress/${encodeURIComponent(f.name)}`}>
                  <Card className="overflow-hidden border border-border hover:border-pink-500/50 transition-all">
                    <div className="relative aspect-video overflow-hidden bg-muted">
                      {f.representativeThumbnailUrl ? (
                        <Image
                          src={f.representativeThumbnailUrl}
                          alt={f.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 50vw, 200px"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <User className="h-8 w-8 text-muted-foreground/30" />
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-bold text-foreground truncate">{f.name}</p>
                      <p className="text-xs text-muted-foreground">{f.totalWorkCount}作品</p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Link href="/tokushu/actress">
                <Button variant="outline" size="sm">
                  全ての女優特集を見る
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
