import type { Metadata } from "next";
import { ChevronRight, Tag } from "lucide-react";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { WorkCard } from "@/components/work-card";
import { ShowMoreGrid } from "@/components/show-more-grid";
import { BreadcrumbJsonLd } from "@/components/json-ld";
import { getGenres, getWorksByGenre } from "@/lib/data-loader";

interface Props {
  params: Promise<{ name: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { name: rawName } = await params;
  const name = decodeURIComponent(rawName);
  const works = await getWorksByGenre(name);

  if (works.length === 0) {
    return {
      title: "ジャンルが見つかりません | AV-ADB",
    };
  }

  // 上位3作品の女優名を抽出（メタディスクリプションのキーワード密度向上用）
  const topActresses = Array.from(
    new Set(
      works
        .slice(0, 6)
        .flatMap((w) => w.actresses || [])
        .filter(Boolean)
    )
  ).slice(0, 5);
  const saleCount = works.filter((w) => w.listPrice > 0 && w.price < w.listPrice).length;
  const highRatedCount = works.filter((w) => w.rating >= 4.0).length;

  const title = `${name}のAV動画おすすめ${works.length}選 レビュー・感想・セール情報`;
  const actressText = topActresses.length > 0 ? `人気女優は${topActresses.join("・")}など。` : "";
  const saleText = saleCount > 0 ? `セール中${saleCount}本。` : "";
  const ratingText = highRatedCount > 0 ? `評価4.0以上の高評価作品${highRatedCount}本掲載。` : "";
  const description = `${name}ジャンルのアダルトAV動画${works.length}作品をレビュー。${actressText}${saleText}${ratingText}FANZAで人気の${name}作品の評価・あらすじ・抜きどころを毎日更新。`.slice(0, 160);

  return {
    title,
    description,
    alternates: { canonical: `/genres/${rawName}/` },
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
  const genres = await getGenres();
  return genres.map((g) => ({
    name: g.name,
  }));
}

export default async function GenreDetailPage({ params }: Props) {
  const { name: rawName } = await params;
  const name = decodeURIComponent(rawName);
  const works = await getWorksByGenre(name);

  // SEOリード文用の集計
  const topActresses = Array.from(
    new Set(
      works
        .slice(0, 8)
        .flatMap((w) => w.actresses || [])
        .filter(Boolean)
    )
  ).slice(0, 5);
  const saleCount = works.filter((w) => w.listPrice > 0 && w.price < w.listPrice).length;
  const highRatedCount = works.filter((w) => w.rating >= 4.0).length;

  return (
    <div className="min-h-screen bg-background">
      <BreadcrumbJsonLd
        items={[
          { name: "トップ", url: "https://av-adb.com/" },
          { name: "ジャンル", url: "https://av-adb.com/genres/" },
          { name, url: `https://av-adb.com/genres/${rawName}/` },
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
          <Link href="/genres" className="hover:text-foreground">
            ジャンル
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">{name}</span>
        </nav>

        {/* ヘッダー */}
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
            <Tag className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{name}のAV動画おすすめ{works.length}選</h1>
            <p className="text-sm text-muted-foreground">{works.length}作品 / レビュー・感想・セール情報</p>
          </div>
        </div>

        {/* SEOリード文 */}
        {works.length > 0 && (
          <section className="mb-6 rounded-lg border border-border bg-card p-4">
            <p className="text-sm leading-relaxed text-muted-foreground">
              <span className="text-foreground">{name}</span>ジャンルのアダルトAV動画
              <span className="font-semibold text-foreground">{works.length}作品</span>を厳選レビュー。
              {topActresses.length > 0 && (
                <>
                  人気女優は
                  <span className="text-foreground">{topActresses.join("・")}</span>
                  など。
                </>
              )}
              {saleCount > 0 && (
                <>
                  現在
                  <span className="font-semibold text-foreground">{saleCount}本がセール中</span>
                  でお得に視聴可能。
                </>
              )}
              {highRatedCount > 0 && (
                <>
                  評価4.0以上の高評価作品も
                  <span className="font-semibold text-foreground">{highRatedCount}本</span>
                  掲載。
                </>
              )}
              FANZAで人気の{name}作品の評価・あらすじ・抜きどころを毎日更新中。
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
            このジャンルの作品はまだ登録されていません。
          </p>
        )}
      </main>

      <Footer />
    </div>
  );
}
