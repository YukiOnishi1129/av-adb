"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import type { SearchItem } from "@/lib/search";

export function SearchBox() {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [searchIndex, setSearchIndex] = useState<SearchItem[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // 検索結果は導出状態として計算
  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    const terms = q.split(/\s+/).filter((t) => t.length > 0);

    return searchIndex
      .filter((item) => {
        const searchableText = [item.t, ...item.ac, ...item.g, item.mk]
          .join(" ")
          .toLowerCase();

        return terms.every((term) => searchableText.includes(term));
      })
      .slice(0, 5);
  }, [query, searchIndex]);

  // isOpenは導出状態として計算
  const isOpen = isFocused && query.trim() !== "" && results.length > 0;

  // 検索インデックスを読み込み
  useEffect(() => {
    fetch("/data/search-index.json")
      .then((res) => res.json())
      .then((data) => setSearchIndex(data))
      .catch(() => {});
  }, []);

  // クリック外で閉じる
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      setIsFocused(false);
      setQuery("");
    }
  };

  return (
    <div ref={containerRef} className="relative flex-1">
      <form onSubmit={handleSubmit}>
        <div className="relative flex items-center">
          <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="「女優名 ジャンル」で検索"
            className="h-9 w-full rounded-full bg-secondary pl-9 pr-4 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
          />
        </div>
      </form>

      {/* 検索結果ドロップダウン */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 rounded-md border border-border bg-background shadow-lg">
          <ul className="py-1">
            {results.map((item) => (
              <li key={item.id}>
                <Link
                  href={`/works/${item.id}`}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-secondary"
                  onClick={() => {
                    setIsFocused(false);
                    setQuery("");
                  }}
                >
                  <img
                    src={item.img}
                    alt=""
                    className="h-10 w-16 rounded object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{item.t}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {item.ac.length > 0 ? item.ac.join(", ") : item.mk}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          {query.trim() && (
            <div className="border-t border-border px-3 py-2">
              <button
                type="button"
                onClick={() => {
                  router.push(`/search?q=${encodeURIComponent(query)}`);
                  setIsFocused(false);
                  setQuery("");
                }}
                className="text-sm text-primary hover:underline"
              >
                「{query}」で全件検索 →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
