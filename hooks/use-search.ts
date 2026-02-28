"use client";

import { useState, useEffect, useMemo } from "react";
import {
  type SearchItem,
  type SortType,
  type ActressCountFilter,
  type PriceFilter,
  searchItems,
  sortItems,
  filterItems,
  extractPopularTags,
} from "@/lib/search";

export function useSearch() {
  const [index, setIndex] = useState<SearchItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [sortType, setSortType] = useState<SortType>("new");
  const [onSaleOnly, setOnSaleOnly] = useState(false);
  const [actressCount, setActressCount] = useState<ActressCountFilter>("all");
  const [maxPrice, setMaxPrice] = useState<PriceFilter>("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // 検索インデックスを読み込み
  useEffect(() => {
    fetch("/data/search-index.json")
      .then((res) => res.json())
      .then((data: SearchItem[]) => {
        setIndex(data);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, []);

  // 人気タグを抽出
  const popularTags = useMemo(() => {
    return extractPopularTags(index, 30);
  }, [index]);

  // 検索・フィルター・ソート適用
  const results = useMemo(() => {
    let items = index;

    // 検索
    items = searchItems(items, query);

    // フィルター
    items = filterItems(items, onSaleOnly, actressCount, maxPrice, selectedTags);

    // ソート
    items = sortItems(items, sortType);

    return items;
  }, [index, query, onSaleOnly, actressCount, maxPrice, selectedTags, sortType]);

  // タグのトグル
  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // タグをクリア
  const clearTags = () => {
    setSelectedTags([]);
  };

  return {
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
    totalCount: index.length,
    resultCount: results.length,
  };
}
