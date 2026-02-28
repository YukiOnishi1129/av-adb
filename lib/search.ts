/**
 * AV-ADB 検索ロジック
 */

// 検索インデックスの型（軽量化のため短いキー名を使用）
export type SearchItem = {
  id: string;         // fanza_product_id
  t: string;          // タイトル
  ac: string[];       // 女優リスト
  g: string[];        // ジャンルリスト
  mk: string;         // メーカー名
  p: number;          // 現在価格
  lp: number;         // 定価
  dr: number | null;  // 割引率
  img: string;        // サムネイルURL
  rt: number | null;  // 評価
  rc: number | null;  // レビュー件数
  rel: string;        // 発売日
  dur: number | null; // 再生時間（分）
  rk: number | null;  // ランキング順位
  sale?: boolean;     // セール中
  acnt?: number;      // 女優数
};

export type SortType = "new" | "rank" | "rating" | "discount" | "price";
export type ActressCountFilter = "all" | "solo" | "multi";
export type PriceFilter = "all" | "500" | "1000" | "2000" | "3000";

// 検索実行（シンプルな部分一致検索）
export function searchItems(items: SearchItem[], query: string): SearchItem[] {
  if (!query.trim()) {
    return items;
  }

  const terms = query.toLowerCase().trim().split(/\s+/);

  return items.filter((item) => {
    const searchableText = [
      item.t,
      ...item.ac,
      ...item.g,
      item.mk,
    ]
      .join(" ")
      .toLowerCase();

    return terms.every((term) => searchableText.includes(term));
  });
}

// ソート
export function sortItems(items: SearchItem[], sortType: SortType): SearchItem[] {
  const sorted = [...items];

  switch (sortType) {
    case "new":
      return sorted.sort(
        (a, b) => new Date(b.rel).getTime() - new Date(a.rel).getTime()
      );
    case "rank":
      return sorted.sort((a, b) => {
        const rankA = a.rk ?? Infinity;
        const rankB = b.rk ?? Infinity;
        return rankA - rankB;
      });
    case "rating":
      return sorted.sort((a, b) => (b.rt ?? 0) - (a.rt ?? 0));
    case "discount":
      return sorted.sort((a, b) => (b.dr ?? 0) - (a.dr ?? 0));
    case "price":
      return sorted.sort((a, b) => a.p - b.p);
    default:
      return sorted;
  }
}

// フィルター
export function filterItems(
  items: SearchItem[],
  onSaleOnly: boolean,
  actressCount: ActressCountFilter,
  maxPrice: PriceFilter,
  selectedTags: string[]
): SearchItem[] {
  let filtered = items;

  // セール中のみ
  if (onSaleOnly) {
    filtered = filtered.filter((item) => item.sale === true || (item.dr !== null && item.dr > 0));
  }

  // 女優数フィルター（単体/共演）
  if (actressCount === "solo") {
    const soloFiltered = filtered.filter((item) => (item.acnt ?? item.ac.length) === 1);
    filtered = soloFiltered;
  } else if (actressCount === "multi") {
    filtered = filtered.filter((item) => (item.acnt ?? item.ac.length) >= 2);
  }

  // 価格フィルター
  if (maxPrice !== "all") {
    const limit = parseInt(maxPrice, 10);
    filtered = filtered.filter((item) => item.p <= limit);
  }

  // タグフィルター（マルチセレクト・AND条件）
  if (selectedTags.length > 0) {
    filtered = filtered.filter((item) =>
      selectedTags.every((tag) => item.g.includes(tag))
    );
  }

  return filtered;
}

// 人気タグを抽出（フィルター用）
export function extractPopularTags(items: SearchItem[], limit: number = 30): string[] {
  const tagCounts = new Map<string, number>();

  for (const item of items) {
    for (const genre of item.g) {
      tagCounts.set(genre, (tagCounts.get(genre) || 0) + 1);
    }
  }

  return Array.from(tagCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([tag]) => tag);
}
