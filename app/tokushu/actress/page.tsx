import { User, Trophy } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Badge } from "@/components/ui/badge";
import { getActressFeatures } from "@/lib/data-loader";

export const metadata = {
  title: "人気女優AV特集一覧 | AV-ADB",
  description:
    "FANZAランキング上位の人気女優のAV作品を厳選して特集。迷ったらここから選べば間違いなし。",
};

export default async function ActressFeatureListPage() {
  const features = await getActressFeatures();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-5xl px-4 py-6 pb-24 lg:pb-6">
        {/* ヘッダーセクション */}
        <div className="mb-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-pink-500/10">
              <Trophy className="h-6 w-6 text-pink-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">人気女優AV特集一覧</h1>
              <p className="text-sm text-muted-foreground">
                {features.length}名の人気女優を特集
              </p>
            </div>
          </div>

          {/* 説明ボックス */}
          <div className="rounded-lg bg-gradient-to-r from-pink-500/10 to-purple-500/10 p-4">
            <p className="text-sm text-muted-foreground">
              FANZAランキング上位の人気女優のAV作品を厳選。
              各女優の代表作やおすすめ作品をAIが分析してピックアップしています。
              迷ったらここから選べば間違いなし。
            </p>
          </div>
        </div>

        {/* 女優特集グリッド */}
        {features.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Link
                key={feature.id}
                href={`/tokushu/actress/${encodeURIComponent(feature.name)}`}
                className="group block overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-pink-500/50"
              >
                {/* サムネイル */}
                <div className="relative aspect-video bg-muted">
                  {feature.representativeThumbnailUrl ? (
                    <Image
                      src={feature.representativeThumbnailUrl}
                      alt={feature.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <User className="h-12 w-12 text-muted-foreground/30" />
                    </div>
                  )}
                  {/* ランキングバッジ */}
                  {feature.fanzaRanking && (
                    <div className="absolute left-2 top-2">
                      <Badge
                        variant="default"
                        className="bg-pink-500 text-white"
                      >
                        #{feature.fanzaRanking}
                      </Badge>
                    </div>
                  )}
                  {/* セール中バッジ */}
                  {feature.saleCount > 0 && (
                    <div className="absolute right-2 top-2">
                      <Badge variant="destructive">
                        {feature.saleCount}作品セール中
                      </Badge>
                    </div>
                  )}
                </div>

                {/* 情報 */}
                <div className="p-3">
                  <h2 className="mb-1 font-bold group-hover:text-pink-500">
                    {feature.name}
                  </h2>
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <span>全{feature.totalWorkCount}作品</span>
                    <span>単独{feature.soloWorkCount}作品</span>
                    {feature.avgRating && (
                      <span>平均★{feature.avgRating.toFixed(1)}</span>
                    )}
                  </div>
                  {feature.headline && (
                    <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
                      {feature.headline}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-border bg-card p-8 text-center">
            <User className="mx-auto mb-4 h-12 w-12 text-muted-foreground/30" />
            <p className="text-muted-foreground">
              女優特集データがまだありません。
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
