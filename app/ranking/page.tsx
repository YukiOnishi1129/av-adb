import { ChevronRight, Crown } from "lucide-react";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { WorkCard } from "@/components/work-card";
import { getWorks } from "@/lib/data-loader";

export default async function RankingPage() {
  const works = await getWorks();
  // 評価順にソート
  const rankedWorks = [...works].sort((a, b) => b.rating - a.rating);

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-yellow-500 text-white";
      case 2:
        return "bg-gray-400 text-white";
      case 3:
        return "bg-amber-600 text-white";
      default:
        return "bg-primary text-white";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-5xl px-4 py-6 pb-24 lg:pb-6">
        {/* パンくず */}
        <nav className="mb-4 flex items-center gap-1 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            トップ
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">ランキング</span>
        </nav>

        {/* ヘッダー */}
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500/20">
            <Crown className="h-6 w-6 text-yellow-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">人気ランキング</h1>
            <p className="text-sm text-muted-foreground">
              評価の高い作品をランキング形式で紹介
            </p>
          </div>
        </div>

        {/* ランキング一覧 */}
        {rankedWorks.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rankedWorks.map((work, index) => {
              const rank = index + 1;
              return (
                <div key={work.id} className="relative">
                  <div
                    className={`absolute -left-2 -top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${getRankStyle(rank)}`}
                  >
                    {rank}
                  </div>
                  <WorkCard work={work} />
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-muted-foreground">作品がありません。</p>
        )}
      </main>

      <Footer />
    </div>
  );
}
