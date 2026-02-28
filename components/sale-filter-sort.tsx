"use client";

import { useState, useMemo } from "react";
import { SearchResultCard } from "@/components/search-result-card";
import { ChevronDown, Check, X, JapaneseYen } from "lucide-react";
import type { SearchItem } from "@/lib/search";

interface SaleFilterSortProps {
  items: SearchItem[];
}

type SortOption =
  | "discount"
  | "price_asc"
  | "new"
  | "rating"
  | "review_count";
type ActressCountFilter = "all" | "solo" | "multi";
type PriceFilter = "all" | "500" | "1000" | "2000" | "3000";

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "discount", label: "割引率順" },
  { value: "price_asc", label: "価格が安い順" },
  { value: "rating", label: "評価順" },
  { value: "review_count", label: "レビュー数順" },
  { value: "new", label: "新着順" },
];

const actressCountFilters: { value: ActressCountFilter; label: string }[] = [
  { value: "all", label: "すべて" },
  { value: "solo", label: "単体作品" },
  { value: "multi", label: "共演作品" },
];

const priceFilters: { value: PriceFilter; label: string }[] = [
  { value: "all", label: "指定なし" },
  { value: "500", label: "〜500円" },
  { value: "1000", label: "〜1,000円" },
  { value: "2000", label: "〜2,000円" },
  { value: "3000", label: "〜3,000円" },
];

export function SaleFilterSort({ items }: SaleFilterSortProps) {
  const [sort, setSort] = useState<SortOption>("discount");
  const [actressCount, setActressCount] = useState<ActressCountFilter>("all");
  const [maxPrice, setMaxPrice] = useState<PriceFilter>("all");
  const [isSortModalOpen, setIsSortModalOpen] = useState(false);
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);

  const currentSortLabel =
    sortOptions.find((opt) => opt.value === sort)?.label || "割引率順";
  const currentPriceLabel =
    priceFilters.find((opt) => opt.value === maxPrice)?.label || "指定なし";

  const filteredAndSortedItems = useMemo(() => {
    let result = items;

    // 女優数フィルター
    if (actressCount === "solo") {
      result = result.filter((item) => (item.acnt ?? item.ac.length) === 1);
    } else if (actressCount === "multi") {
      result = result.filter((item) => (item.acnt ?? item.ac.length) >= 2);
    }

    // 価格フィルター
    if (maxPrice !== "all") {
      const limit = parseInt(maxPrice, 10);
      result = result.filter((item) => item.p <= limit);
    }

    // ソート
    return [...result].sort((a, b) => {
      switch (sort) {
        case "discount":
          return (b.dr || 0) - (a.dr || 0);
        case "price_asc":
          return a.p - b.p;
        case "rating":
          return (b.rt || 0) - (a.rt || 0);
        case "review_count":
          return (b.rc || 0) - (a.rc || 0);
        case "new":
          return (
            new Date(b.rel || 0).getTime() -
            new Date(a.rel || 0).getTime()
          );
        default:
          return 0;
      }
    });
  }, [items, sort, actressCount, maxPrice]);

  return (
    <div>
      {/* フィルター・ソートバー */}
      <div className="mb-4 space-y-3">
        {/* 1段目: 出演形態 */}
        <div className="flex flex-wrap gap-2">
          {actressCountFilters.map((option) => (
            <button
              type="button"
              key={option.value}
              onClick={() => setActressCount(option.value)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                actressCount === option.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-foreground hover:bg-secondary/80"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* 2段目: 価格 + ソート */}
        <div className="flex items-center justify-between gap-2">
          {/* 価格フィルター（モーダルトリガー） */}
          <button
            type="button"
            onClick={() => setIsPriceModalOpen(true)}
            className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              maxPrice !== "all"
                ? "bg-emerald-600 text-white"
                : "bg-secondary text-foreground hover:bg-secondary/80"
            }`}
          >
            <JapaneseYen className="h-3 w-3" />
            <span>{maxPrice === "all" ? "価格" : currentPriceLabel}</span>
          </button>

          {/* ソート（モーダルトリガー） */}
          <button
            type="button"
            onClick={() => setIsSortModalOpen(true)}
            className="flex shrink-0 items-center gap-1 whitespace-nowrap rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground"
          >
            <span>{currentSortLabel}</span>
            <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* 件数表示 */}
      <p className="mb-3 text-xs text-muted-foreground">
        {filteredAndSortedItems.length}件
        {actressCount !== "all" && (
          <span className="ml-1">
            （{actressCountFilters.find((a) => a.value === actressCount)?.label}）
          </span>
        )}
        {maxPrice !== "all" && (
          <span className="ml-1">（{currentPriceLabel}）</span>
        )}
      </p>

      {/* 作品一覧 - 2カラム */}
      {filteredAndSortedItems.length > 0 ? (
        <div className="grid grid-cols-2 gap-3">
          {filteredAndSortedItems.map((item) => (
            <SearchResultCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <p className="py-8 text-center text-muted-foreground">
          該当する作品がありません
        </p>
      )}

      {/* ソートモーダル */}
      {isSortModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center"
          onClick={() => setIsSortModalOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-t-2xl bg-background p-6 sm:rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">並び替え</h2>
              <button
                type="button"
                onClick={() => setIsSortModalOpen(false)}
                className="rounded-full p-2 hover:bg-secondary"
              >
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>
            <div className="space-y-1">
              {sortOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    setSort(opt.value);
                    setIsSortModalOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-4 py-3 text-left transition-colors ${
                    sort === opt.value
                      ? "bg-red-500/10 text-red-500"
                      : "hover:bg-secondary"
                  }`}
                >
                  <span className="text-base">{opt.label}</span>
                  {sort === opt.value && (
                    <Check className="h-5 w-5 text-red-500" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 価格フィルターモーダル */}
      {isPriceModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center"
          onClick={() => setIsPriceModalOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-t-2xl bg-background p-6 sm:rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">
                価格で絞り込み
              </h2>
              <button
                type="button"
                onClick={() => setIsPriceModalOpen(false)}
                className="rounded-full p-2 hover:bg-secondary"
              >
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>
            <div className="space-y-1">
              {priceFilters.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    setMaxPrice(opt.value);
                    setIsPriceModalOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-4 py-3 text-left transition-colors ${
                    maxPrice === opt.value
                      ? "bg-emerald-500/10 text-emerald-600"
                      : "hover:bg-secondary"
                  }`}
                >
                  <span className="text-base">{opt.label}</span>
                  {maxPrice === opt.value && (
                    <Check className="h-5 w-5 text-emerald-600" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
