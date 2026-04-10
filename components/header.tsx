import Link from "next/link";
import { SearchBox } from "./search-box";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center gap-4 px-4">
        <Link href="/" className="flex shrink-0 flex-col">
          <div className="flex items-center gap-0.5">
            <span className="text-lg font-bold text-primary md:text-xl">AV</span>
            <span className="text-lg font-bold text-foreground md:text-xl">-ADB</span>
            <span className="rounded bg-muted px-1 py-0.5 text-[10px] text-muted-foreground">PR</span>
          </div>
          <span className="text-[9px] text-muted-foreground md:text-[10px]">
            AV動画を探す検索ツール
          </span>
        </Link>

        {/* 検索ボックス */}
        <SearchBox />

        <nav className="hidden shrink-0 items-center gap-4 lg:flex">
          <Link
            href="/ranking"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ランキング
          </Link>
          <Link
            href="/sale"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            セール
          </Link>
          <Link
            href="/actresses"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            女優
          </Link>
          <Link
            href="/genres"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ジャンル
          </Link>
        </nav>
      </div>
    </header>
  );
}
