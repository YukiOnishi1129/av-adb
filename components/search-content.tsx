"use client";

import { useState } from "react";
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  Tag,
  X,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SearchResultCard } from "@/components/search-result-card";
import { FeaturedBanners } from "@/components/featured-banners";
import { useSearch } from "@/hooks/use-search";
import type { SortType, ActressCountFilter, PriceFilter } from "@/lib/search";
import type { SaleFeatureView, DailyRecommendationView } from "@/lib/data-loader";

interface SearchContentProps {
  saleFeature?: SaleFeatureView | null;
  saleThumbnailUrl?: string | null;
  dailyRecommendation?: DailyRecommendationView | null;
}

// ソートオプション
const SORT_OPTIONS: { value: SortType; label: string }[] = [
  { value: "new", label: "新着順" },
  { value: "rank", label: "ランキング順" },
  { value: "rating", label: "評価順" },
  { value: "discount", label: "割引率順" },
  { value: "price", label: "価格が安い順" },
];

// 価格フィルターオプション
const PRICE_OPTIONS: { value: PriceFilter; label: string }[] = [
  { value: "all", label: "すべて" },
  { value: "500", label: "500円以下" },
  { value: "1000", label: "1,000円以下" },
  { value: "2000", label: "2,000円以下" },
  { value: "3000", label: "3,000円以下" },
];

// 女優数フィルターオプション
const ACTRESS_COUNT_OPTIONS: { value: ActressCountFilter; label: string }[] = [
  { value: "all", label: "すべて" },
  { value: "solo", label: "単体作品" },
  { value: "multi", label: "共演作品" },
];

// モーダルコンポーネント
function Modal({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
      />
      <div className="relative z-50 w-full max-w-lg rounded-t-2xl bg-background p-6 shadow-xl sm:rounded-2xl sm:max-h-[80vh] max-h-[70vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-secondary"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="overflow-y-auto flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}

export function SearchContent({
  saleFeature,
  saleThumbnailUrl,
  dailyRecommendation,
}: SearchContentProps) {
  const {
    results,
    isLoading,
    query,
    setQuery,
    sortType,
    setSortType,
    onSaleOnly,
    setOnSaleOnly,
    actressCount,
    setActressCount,
    maxPrice,
    setMaxPrice,
    selectedTags,
    toggleTag,
    clearTags,
    popularTags,
    totalCount,
    resultCount,
  } = useSearch();

  const [sortModalOpen, setSortModalOpen] = useState(false);
  const [tagModalOpen, setTagModalOpen] = useState(false);
  const [filterModalOpen, setFilterModalOpen] = useState(false);

  // アクティブフィルター数
  const activeFilterCount =
    (onSaleOnly ? 1 : 0) +
    (actressCount !== "all" ? 1 : 0) +
    (maxPrice !== "all" ? 1 : 0) +
    selectedTags.length;

  return (
    <>
      {/* バナー */}
      <FeaturedBanners
        saleFeature={saleFeature}
        saleThumbnailUrl={saleThumbnailUrl}
        dailyRecommendation={dailyRecommendation}
      />

      {/* 検索フォーム */}
      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="女優名、ジャンル、タイトルで検索..."
          className="w-full rounded-full border border-border bg-secondary py-3 pl-12 pr-4 text-base outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* フィルターバー */}
      <div className="flex flex-wrap gap-2 mb-4">
        {/* 並び替えボタン */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSortModalOpen(true)}
          className="gap-1.5"
        >
          <ArrowUpDown className="h-4 w-4" />
          {SORT_OPTIONS.find((o) => o.value === sortType)?.label}
        </Button>

        {/* タグフィルターボタン */}
        <Button
          variant={selectedTags.length > 0 ? "default" : "outline"}
          size="sm"
          onClick={() => setTagModalOpen(true)}
          className="gap-1.5"
        >
          <Tag className="h-4 w-4" />
          タグ
          {selectedTags.length > 0 && (
            <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-xs">
              {selectedTags.length}
            </Badge>
          )}
        </Button>

        {/* フィルターボタン */}
        <Button
          variant={activeFilterCount > selectedTags.length ? "default" : "outline"}
          size="sm"
          onClick={() => setFilterModalOpen(true)}
          className="gap-1.5"
        >
          <SlidersHorizontal className="h-4 w-4" />
          フィルター
          {activeFilterCount > selectedTags.length && (
            <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-xs">
              {activeFilterCount - selectedTags.length}
            </Badge>
          )}
        </Button>

        {/* セール中トグル */}
        <Button
          variant={onSaleOnly ? "default" : "outline"}
          size="sm"
          onClick={() => setOnSaleOnly(!onSaleOnly)}
        >
          セール中
        </Button>
      </div>

      {/* 選択中のタグ表示 */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {selectedTags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
              onClick={() => toggleTag(tag)}
            >
              {tag}
              <X className="ml-1 h-3 w-3" />
            </Badge>
          ))}
          <button
            onClick={clearTags}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            すべてクリア
          </button>
        </div>
      )}

      {/* 検索結果ヘッダー */}
      <div className="mb-4 text-sm text-muted-foreground">
        {isLoading ? (
          "読み込み中..."
        ) : query ? (
          `「${query}」の検索結果: ${resultCount.toLocaleString()}件`
        ) : (
          `全${totalCount.toLocaleString()}件中 ${resultCount.toLocaleString()}件を表示`
        )}
      </div>

      {/* 検索結果 - 2カラム構成 */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : results.length === 0 ? (
        <div className="py-12 text-center">
          <Search className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <p className="mt-4 text-muted-foreground">
            条件に一致する作品が見つかりませんでした
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {results.map((item) => (
            <SearchResultCard key={item.id} item={item} />
          ))}
        </div>
      )}

      {/* 並び替えモーダル */}
      <Modal
        isOpen={sortModalOpen}
        onClose={() => setSortModalOpen(false)}
        title="並び替え"
      >
        <div className="space-y-1">
          {SORT_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                setSortType(option.value);
                setSortModalOpen(false);
              }}
              className={`flex w-full items-center justify-between rounded-lg px-4 py-3 text-left hover:bg-secondary ${
                sortType === option.value ? "bg-secondary" : ""
              }`}
            >
              <span>{option.label}</span>
              {sortType === option.value && (
                <Check className="h-5 w-5 text-primary" />
              )}
            </button>
          ))}
        </div>
      </Modal>

      {/* タグ選択モーダル */}
      <Modal
        isOpen={tagModalOpen}
        onClose={() => setTagModalOpen(false)}
        title="タグで絞り込み"
      >
        <div className="flex flex-wrap gap-2">
          {popularTags.map((tag) => (
            <Badge
              key={tag}
              variant={selectedTags.includes(tag) ? "default" : "outline"}
              className="cursor-pointer text-sm py-1.5 px-3"
              onClick={() => toggleTag(tag)}
            >
              {tag}
              {selectedTags.includes(tag) && (
                <Check className="ml-1 h-3 w-3" />
              )}
            </Badge>
          ))}
        </div>
        {selectedTags.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={clearTags}
              className="w-full"
            >
              選択をクリア
            </Button>
          </div>
        )}
      </Modal>

      {/* フィルターモーダル */}
      <Modal
        isOpen={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        title="フィルター"
      >
        <div className="space-y-6">
          {/* 価格フィルター */}
          <div>
            <h3 className="font-medium mb-3">価格</h3>
            <div className="flex flex-wrap gap-2">
              {PRICE_OPTIONS.map((option) => (
                <Badge
                  key={option.value}
                  variant={maxPrice === option.value ? "default" : "outline"}
                  className="cursor-pointer text-sm py-1.5 px-3"
                  onClick={() => setMaxPrice(option.value)}
                >
                  {option.label}
                </Badge>
              ))}
            </div>
          </div>

          {/* 女優数フィルター */}
          <div>
            <h3 className="font-medium mb-3">出演形態</h3>
            <div className="flex flex-wrap gap-2">
              {ACTRESS_COUNT_OPTIONS.map((option) => (
                <Badge
                  key={option.value}
                  variant={actressCount === option.value ? "default" : "outline"}
                  className="cursor-pointer text-sm py-1.5 px-3"
                  onClick={() => setActressCount(option.value)}
                >
                  {option.label}
                </Badge>
              ))}
            </div>
          </div>

          {/* セール中フィルター */}
          <div>
            <h3 className="font-medium mb-3">セール</h3>
            <Badge
              variant={onSaleOnly ? "default" : "outline"}
              className="cursor-pointer text-sm py-1.5 px-3"
              onClick={() => setOnSaleOnly(!onSaleOnly)}
            >
              セール中のみ表示
            </Badge>
          </div>
        </div>
      </Modal>
    </>
  );
}
