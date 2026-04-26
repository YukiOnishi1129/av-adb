import Link from "next/link";
import { Home, Search, TrendingUp, Sparkles, User, Tag } from "lucide-react";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "ページが見つかりません | AV-ADB",
  description: "お探しのページは削除されたか、URLが間違っている可能性があります。トップページや人気ランキング・女優一覧から作品を探してください。",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-5xl px-4 py-12">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-primary">404</h1>
          <p className="mt-4 text-xl font-bold text-foreground">
            ページが見つかりませんでした
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            お探しのページは削除されたか、URLが間違っている可能性があります。
          </p>

          <Link
            href="/"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Home className="h-4 w-4" />
            トップページへ戻る
          </Link>
        </div>

        {/* 行き先候補（離脱防止） */}
        <section className="mt-12">
          <h2 className="mb-4 text-lg font-bold text-foreground">こちらから探してみてください</h2>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Link href="/ranking">
              <Card className="hover:border-primary/50 transition-all">
                <CardContent className="flex items-center gap-3 p-4">
                  <TrendingUp className="h-6 w-6 text-primary shrink-0" />
                  <div>
                    <div className="text-sm font-bold text-foreground">AV動画ランキング</div>
                    <div className="text-xs text-muted-foreground">FANZA人気作品TOP</div>
                  </div>
                </CardContent>
              </Card>
            </Link>
            <Link href="/sale">
              <Card className="hover:border-orange-500/50 transition-all">
                <CardContent className="flex items-center gap-3 p-4">
                  <Sparkles className="h-6 w-6 text-orange-500 shrink-0" />
                  <div>
                    <div className="text-sm font-bold text-foreground">セール中の作品</div>
                    <div className="text-xs text-muted-foreground">最大80%OFFのお得な作品</div>
                  </div>
                </CardContent>
              </Card>
            </Link>
            <Link href="/actresses">
              <Card className="hover:border-pink-500/50 transition-all">
                <CardContent className="flex items-center gap-3 p-4">
                  <User className="h-6 w-6 text-pink-500 shrink-0" />
                  <div>
                    <div className="text-sm font-bold text-foreground">女優一覧</div>
                    <div className="text-xs text-muted-foreground">人気女優から探す</div>
                  </div>
                </CardContent>
              </Card>
            </Link>
            <Link href="/genres">
              <Card className="hover:border-blue-500/50 transition-all">
                <CardContent className="flex items-center gap-3 p-4">
                  <Tag className="h-6 w-6 text-blue-500 shrink-0" />
                  <div>
                    <div className="text-sm font-bold text-foreground">ジャンル一覧</div>
                    <div className="text-xs text-muted-foreground">ジャンル別に探す</div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </section>

        {/* 特集ページへの誘導 */}
        <section className="mt-8">
          <h2 className="mb-4 text-lg font-bold text-foreground">人気の特集</h2>
          <div className="grid gap-3 md:grid-cols-3">
            <Link href="/recommendations">
              <Card className="hover:border-primary/50 transition-all">
                <CardContent className="p-4">
                  <div className="text-sm font-bold text-foreground">📅 今日のおすすめ</div>
                  <div className="mt-1 text-xs text-muted-foreground">毎日更新の厳選作品</div>
                </CardContent>
              </Card>
            </Link>
            <Link href="/sale/tokushu">
              <Card className="hover:border-orange-500/50 transition-all">
                <CardContent className="p-4">
                  <div className="text-sm font-bold text-foreground">🔥 セール特集</div>
                  <div className="mt-1 text-xs text-muted-foreground">今がチャンスのお得な作品</div>
                </CardContent>
              </Card>
            </Link>
            <Link href="/tokushu">
              <Card className="hover:border-purple-500/50 transition-all">
                <CardContent className="p-4">
                  <div className="text-sm font-bold text-foreground">🎯 ジャンル・女優特集</div>
                  <div className="mt-1 text-xs text-muted-foreground">巨乳・人妻・痴女など</div>
                </CardContent>
              </Card>
            </Link>
          </div>

          <div className="mt-4 text-center">
            <Link
              href="/search"
              className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <Search className="h-4 w-4" />
              キーワードで検索する
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
