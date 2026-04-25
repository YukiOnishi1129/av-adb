import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { HorizontalScrollSection } from "@/components/horizontal-scroll-section";
import { SaleBanner } from "@/components/sale-banner";
import { FeaturedBanners } from "@/components/featured-banners";
import { CampaignBanner } from "@/components/campaign-banner";
import { isGwCampaignActive, getGwCampaignAffiliateUrl, CAMPAIGN_END_ISO as GW_END } from "@/lib/gw-campaign";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};
import {
  getWorksByRanking,
  getSaleWorks,
  getHighRatedWorks,
  getBargainWorks,
  getNewWorks,
  getActresses,
  getGenres,
  getGenreRankingWorks,
  getLatestSaleFeature,
  getLatestDailyRecommendation,
  getFeatureRecommendations,
  getActressFeatures,
} from "@/lib/data-loader";

export default async function HomePage() {
  // データ取得
  const [
    rankingWorks,
    saleWorks,
    highRatedWorks,
    bargainWorks,
    newWorks,
    actresses,
    genres,
    saleFeature,
    dailyRecommendation,
    featureRecommendations,
    actressFeatures,
  ] = await Promise.all([
    getWorksByRanking(),
    getSaleWorks(),
    getHighRatedWorks(4.0, 12),
    getBargainWorks(1000, 12),
    getNewWorks(12),
    getActresses(),
    getGenres(),
    getLatestSaleFeature(),
    getLatestDailyRecommendation(),
    getFeatureRecommendations(),
    getActressFeatures(),
  ]);

  // 性癖系ジャンルのランキング（人気のある性癖を手動で指定）
  const fetishGenreNames = ["中出し", "痴女", "巨乳", "人妻", "女子校生"];
  const genreRankings = await Promise.all(
    fetishGenreNames.map(async (genreName) => ({
      genre: genreName,
      works: await getGenreRankingWorks(genreName, 12),
    }))
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-5xl px-4 py-6 pb-24 lg:pb-6">
        {/* GW 50%OFFキャンペーンバナー（〜2026/05/15まで） */}
        {isGwCampaignActive() && (
          <CampaignBanner
            href={getGwCampaignAffiliateUrl()}
            eventName="gw_campaign_banner_click"
            gradientClass="bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600"
            badge="🎉 期間限定 〜5/15"
            title="GOLDEN WEEK 50%OFF"
            description="対象作品が今だけ半額！"
            ctaLabel="特集を見る →"
            endDate={GW_END}
          />
        )}

        {/* セールバナー */}
        {saleWorks.length > 0 && <SaleBanner saleWorks={saleWorks} />}

        {/* 特集バナー: 今日のおすすめ/セール特集 + 性癖/女優特集カルーセル */}
        <FeaturedBanners
          saleFeature={saleFeature}
          saleThumbnailUrl={saleWorks[0]?.thumbnailUrl}
          dailyRecommendation={dailyRecommendation}
          features={featureRecommendations}
          actressFeatures={actressFeatures}
        />

        {/* ランキング（横スクロール＋金銀銅バッジ） */}
        {rankingWorks.length > 0 && (
          <HorizontalScrollSection
            title="迷ったらこれ！"
            subtitle="AV売上ランキング"
            href="/ranking"
            works={rankingWorks.slice(0, 12)}
            showRankBadge
            rankBadgeColor="gold"
          />
        )}

        {/* 高評価4.0以上（横スクロール） */}
        {highRatedWorks.length > 0 && (
          <HorizontalScrollSection
            title="ハズレなしの高評価"
            subtitle="評価4.0以上の厳選作品"
            href="/search?sort=rating"
            works={highRatedWorks}
          />
        )}

        {/* セール中（横スクロール） */}
        {saleWorks.length > 0 && (
          <HorizontalScrollSection
            title="今がチャンス"
            subtitle="セール中の作品"
            href="/sale"
            works={saleWorks.slice(0, 12)}
          />
        )}

        {/* 爆安コーナー（横スクロール） */}
        {bargainWorks.length > 0 && (
          <HorizontalScrollSection
            title="1000円以下で買える"
            subtitle="お買い得AV作品"
            href="/sale?max=1000"
            works={bargainWorks}
          />
        )}

        {/* 新着作品（横スクロール） */}
        {newWorks.length > 0 && (
          <HorizontalScrollSection
            title="新着作品"
            subtitle="最新リリース"
            href="/search?sort=new"
            works={newWorks}
          />
        )}

        {/* 性癖別ランキング（人気ジャンル） */}
        {genreRankings.map(
          ({ genre, works }) =>
            works.length > 0 && (
              <HorizontalScrollSection
                key={genre}
                title={`${genre}ランキング`}
                subtitle={`${genre}ジャンルの人気作品`}
                href={`/genres/${encodeURIComponent(genre)}`}
                works={works}
                showRankBadge
                rankBadgeColor="emerald"
              />
            )
        )}

        {/* 人気女優 */}
        {actresses.length > 0 && (
          <section className="mb-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">人気女優</h2>
              <Link
                href="/actresses"
                className="flex items-center gap-1 text-sm text-primary transition-colors hover:text-primary/80"
              >
                もっと見る
              </Link>
            </div>
            <div className="flex flex-wrap gap-2">
              {actresses.slice(0, 12).map((actress) => (
                <Link
                  key={actress.name}
                  href={`/actresses/${encodeURIComponent(actress.name)}`}
                >
                  <Badge
                    variant="secondary"
                    className="cursor-pointer hover:opacity-80 text-sm py-1.5 px-3"
                  >
                    {actress.name}
                    <span className="ml-1 opacity-70">({actress.workCount})</span>
                  </Badge>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* 人気ジャンル */}
        {genres.length > 0 && (
          <section className="mb-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">人気ジャンル</h2>
              <Link
                href="/genres"
                className="flex items-center gap-1 text-sm text-primary transition-colors hover:text-primary/80"
              >
                もっと見る
              </Link>
            </div>
            <div className="flex flex-wrap gap-2">
              {genres.slice(0, 20).map((genre) => (
                <Link
                  key={genre.name}
                  href={`/genres/${encodeURIComponent(genre.name)}`}
                >
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-secondary text-sm py-1.5 px-3"
                  >
                    {genre.name}
                    <span className="ml-1 opacity-70">({genre.workCount})</span>
                  </Badge>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* サイト説明 */}
        <section className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-lg font-bold">AV-ADBについて</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            AV-ADBは、FANZA
            FANZAで配信されているアダルトAV動画を専門に紹介するレビューサイトです。
            人気作品のランキング、セール情報、女優別・ジャンル別の作品まとめなど、
            AV動画選びに役立つ情報を毎日更新しています。
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            HD画質、4K画質、フルHD
            各種フォーマットに対応した作品を幅広くカバー。
            高画質作品から定番の人気作まで、あなたにぴったりの一本が見つかります。
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
