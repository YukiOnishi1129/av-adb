import type { Metadata } from "next";
import { ChevronRight, User } from "lucide-react";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { WorkCard } from "@/components/work-card";
import { ShowMoreGrid } from "@/components/show-more-grid";
import { BreadcrumbJsonLd } from "@/components/json-ld";
import { getActresses, getWorksByActress } from "@/lib/data-loader";

interface Props {
  params: Promise<{ name: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { name: rawName } = await params;
  const name = decodeURIComponent(rawName);
  const works = await getWorksByActress(name);

  if (works.length === 0) {
    return {
      title: "出演者が見つかりません | AV-ADB",
    };
  }

  // 上位ジャンル（メタディスクリプションのキーワード密度向上用）
  const topGenres = Array.from(
    new Set(works.slice(0, 8).flatMap((w) => w.genres || []).filter(Boolean))
  ).slice(0, 5);
  const saleCount = works.filter((w) => w.listPrice > 0 && w.price < w.listPrice).length;
  const highRatedCount = works.filter((w) => w.rating >= 4.0).length;
  const avgRating = works.length > 0
    ? (works.reduce((s, w) => s + (w.rating || 0), 0) / works.length).toFixed(1)
    : null;

  const title = `${name}のAV作品おすすめ${works.length}選 レビュー・感想・セール情報`;
  const genreText = topGenres.length > 0 ? `主なジャンルは${topGenres.join("・")}。` : "";
  const ratingText = avgRating ? `平均評価★${avgRating}。` : "";
  const saleText = saleCount > 0 ? `セール中${saleCount}本。` : "";
  const highRatedText = highRatedCount > 0 ? `高評価作品${highRatedCount}本掲載。` : "";
  const description = `${name}出演のアダルトAV動画${works.length}作品をレビュー。${genreText}${ratingText}${saleText}${highRatedText}FANZAで人気の${name}作品の評価・あらすじ・抜きどころを毎日更新。`.slice(0, 160);

  return {
    title,
    description,
    alternates: { canonical: `/actresses/${rawName}/` },
    openGraph: {
      title,
      description,
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export async function generateStaticParams() {
  const actresses = await getActresses();
  return actresses.map((a) => ({
    name: a.name,
  }));
}

export default async function ActressDetailPage({ params }: Props) {
  const { name: rawName } = await params;
  const name = decodeURIComponent(rawName);
  const works = await getWorksByActress(name);

  // SEOリード文用の集計
  const topGenres = Array.from(
    new Set(works.slice(0, 8).flatMap((w) => w.genres || []).filter(Boolean))
  ).slice(0, 5);
  const saleCount = works.filter((w) => w.listPrice > 0 && w.price < w.listPrice).length;
  const highRatedCount = works.filter((w) => w.rating >= 4.0).length;
  const avgRating = works.length > 0
    ? (works.reduce((s, w) => s + (w.rating || 0), 0) / works.length).toFixed(1)
    : null;

  return (
    <div className="min-h-screen bg-background">
      <BreadcrumbJsonLd
        items={[
          { name: "トップ", url: "https://av-adb.com/" },
          { name: "出演者", url: "https://av-adb.com/actresses/" },
          { name, url: `https://av-adb.com/actresses/${rawName}/` },
        ]}
      />
      <Header />

      <main className="mx-auto max-w-5xl px-4 py-6 pb-24 lg:pb-6">
        {/* パンくず */}
        <nav className="mb-4 flex items-center gap-1 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            トップ
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/actresses" className="hover:text-foreground">
            出演者
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">{name}</span>
        </nav>

        {/* ヘッダー */}
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-muted">
            <User className="h-10 w-10 text-muted-foreground/50" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{name}のAV作品おすすめ{works.length}選</h1>
            <p className="text-sm text-muted-foreground">{works.length}作品 / レビュー・感想・セール情報</p>
          </div>
        </div>

        {/* SEOリード文 */}
        {works.length > 0 && (
          <section className="mb-6 rounded-lg border border-border bg-card p-4">
            <p className="text-sm leading-relaxed text-muted-foreground">
              <span className="text-foreground">{name}</span>が出演するアダルトAV動画
              <span className="font-semibold text-foreground">{works.length}作品</span>を厳選レビュー。
              {topGenres.length > 0 && (
                <>
                  主なジャンルは
                  <span className="text-foreground">{topGenres.join("・")}</span>
                  。
                </>
              )}
              {avgRating && (
                <>
                  平均評価
                  <span className="font-semibold text-foreground">★{avgRating}</span>
                  。
                </>
              )}
              {saleCount > 0 && (
                <>
                  現在
                  <span className="font-semibold text-foreground">{saleCount}本がセール中</span>
                  。
                </>
              )}
              {highRatedCount > 0 && (
                <>
                  評価4.0以上の高評価作品も
                  <span className="font-semibold text-foreground">{highRatedCount}本</span>
                  掲載中。
                </>
              )}
              FANZAで人気の{name}の出演作品の評価・あらすじ・抜きどころを毎日更新中。
            </p>
          </section>
        )}

        {/* 作品一覧 */}
        {works.length > 0 ? (
          <ShowMoreGrid columns={3}>
            {works.map((work) => (
              <WorkCard key={work.id} work={work} />
            ))}
          </ShowMoreGrid>
        ) : (
          <p className="text-muted-foreground">
            この出演者の作品はまだ登録されていません。
          </p>
        )}
      </main>

      <Footer />
    </div>
  );
}
