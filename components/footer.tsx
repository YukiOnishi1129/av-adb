import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-secondary py-8 pb-20 lg:pb-8">
      <div className="mx-auto max-w-5xl px-4 text-center text-sm text-foreground/60">
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
          <Link href="/search" className="hover:text-foreground">
            検索
          </Link>
          <Link href="/privacy" className="hover:text-foreground">
            プライバシーポリシー
          </Link>
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
    </footer>
  );
}
