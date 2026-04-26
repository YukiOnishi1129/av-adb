import Link from "next/link";
import { getActresses, getGenres } from "@/lib/data-loader";

// 人気女優・人気ジャンルをビルド時に取得して全ページのフッターから内部リンクを張る
// 目的: 全ページからクロール経路を作り、SEO的にサイト全体のリンクジュースを循環させる
async function getPopularData() {
  const [actresses, genres] = await Promise.all([getActresses(), getGenres()]);
  // 出演本数上位の女優、作品数上位のジャンル
  const popularActresses = actresses.slice(0, 8);
  const popularGenres = genres.slice(0, 12);
  return { popularActresses, popularGenres };
}

export async function Footer() {
  const { popularActresses, popularGenres } = await getPopularData();

  return (
    <footer className="mt-16 border-t border-border bg-secondary py-8 pb-20 lg:pb-8">
      <div className="mx-auto max-w-5xl px-4 text-sm text-foreground/60">
        {/* 人気ジャンル・人気女優の内部リンク群（SEO: 全ページからクロール経路を確保） */}
        <div className="mb-8 grid gap-6 md:grid-cols-2">
          {popularGenres.length > 0 && (
            <div>
              <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-foreground/80">
                人気のジャンル
              </h2>
              <div className="flex flex-wrap gap-2">
                {popularGenres.map((genre) => (
                  <Link
                    key={genre.name}
                    href={`/genres/${encodeURIComponent(genre.name)}`}
                    className="rounded-md bg-background px-2 py-1 text-xs hover:text-foreground hover:bg-primary/10"
                  >
                    #{genre.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {popularActresses.length > 0 && (
            <div>
              <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-foreground/80">
                人気の女優
              </h2>
              <div className="flex flex-wrap gap-2">
                {popularActresses.map((actress) => (
                  <Link
                    key={actress.name}
                    href={`/actresses/${encodeURIComponent(actress.name)}`}
                    className="rounded-md bg-background px-2 py-1 text-xs hover:text-foreground hover:bg-primary/10"
                  >
                    {actress.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-border pt-6 text-center">
          <p className="mb-2">AV-ADB - AV動画データベース</p>
          <div className="mb-4 flex flex-wrap justify-center gap-4">
            <Link href="/" className="hover:text-foreground">
              トップ
            </Link>
            <Link href="/ranking" className="hover:text-foreground">
              ランキング
            </Link>
            <Link href="/sale" className="hover:text-foreground">
              セール
            </Link>
            <Link href="/actresses" className="hover:text-foreground">
              女優一覧
            </Link>
            <Link href="/genres" className="hover:text-foreground">
              ジャンル一覧
            </Link>
            <Link href="/tokushu" className="hover:text-foreground">
              特集
            </Link>
            <Link href="/search" className="hover:text-foreground">
              検索
            </Link>
            <Link href="/privacy" className="hover:text-foreground">
              プライバシーポリシー
            </Link>
          </div>
          {/* 姉妹サイト */}
          <div className="mb-4">
            <p className="mb-2 text-xs text-foreground/40">姉妹サイト</p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="https://vr-adb.com" className="hover:text-foreground" target="_blank" rel="noopener noreferrer">
                VR-ADB（アダルトVR）
              </a>
            </div>
          </div>
          {/* FANZA API クレジット表記 */}
          <p className="mt-4 text-xs text-foreground/40">
            Powered by{" "}
            <a
              href="https://affiliate.dmm.com/api/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground/60"
            >
              FANZA Webサービス
            </a>
          </p>
          <p className="mt-2 text-xs text-foreground/40">
            &copy; {new Date().getFullYear()} AV-ADB. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
