"use client";

import type { Work } from "@/lib/data-loader";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, ChevronRight, Star } from "lucide-react";
import { useRef } from "react";

interface HorizontalScrollSectionProps {
  title: string;
  subtitle?: string;
  href: string;
  works: Work[];
  showRankBadge?: boolean;
  rankBadgeColor?: "gold" | "purple" | "orange" | "emerald";
}

function formatPrice(price: number): string {
  return `¥${price.toLocaleString()}`;
}

function getTimeRemaining(endDate: string): string {
  const end = new Date(endDate);
  const now = new Date();
  const diff = end.getTime() - now.getTime();

  if (diff <= 0) return "終了";

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);

  if (days > 0) return `残り${days}日`;
  return `残り${hours}時間`;
}

function getRankBadgeStyles(rank: number, color: string) {
  // 1位〜3位は特別デザイン
  if (rank === 1) {
    return {
      bg: "bg-gradient-to-br from-yellow-400 via-yellow-500 to-amber-600",
      text: "text-amber-900",
      size: "h-10 w-10 text-lg",
      shadow: "shadow-lg shadow-yellow-500/50",
    };
  }
  if (rank === 2) {
    return {
      bg: "bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500",
      text: "text-gray-800",
      size: "h-9 w-9 text-base",
      shadow: "shadow-lg shadow-gray-400/50",
    };
  }
  if (rank === 3) {
    return {
      bg: "bg-gradient-to-br from-orange-400 via-orange-500 to-orange-700",
      text: "text-orange-900",
      size: "h-9 w-9 text-base",
      shadow: "shadow-lg shadow-orange-500/50",
    };
  }

  // 4位以降は色別
  const colorMap: Record<string, string> = {
    gold: "bg-amber-500",
    purple: "bg-primary",
    orange: "bg-orange-500",
    emerald: "bg-emerald-500",
  };

  return {
    bg: colorMap[color] || "bg-gray-500",
    text: "text-white",
    size: "h-7 w-7 text-sm",
    shadow: "",
  };
}

export function HorizontalScrollSection({
  title,
  subtitle,
  href,
  works,
  showRankBadge = false,
  rankBadgeColor = "gold",
}: HorizontalScrollSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (works.length === 0) return null;

  return (
    <section className="mb-4">
      {/* ヘッダー */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">{title}</h2>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
          )}
        </div>
        <Link
          href={href}
          className="flex items-center gap-1 text-sm text-primary transition-colors hover:text-primary/80"
        >
          もっと見る
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      {/* 横スクロールエリア */}
      <div
        ref={scrollRef}
        className="scrollbar-hide -mx-4 flex gap-4 overflow-x-auto px-4 pb-4 snap-x snap-mandatory overscroll-x-contain"
      >
        {works.map((work, index) => {
          const isOnSale = work.listPrice > 0 && work.price < work.listPrice;
          const rankStyles = showRankBadge
            ? getRankBadgeStyles(index + 1, rankBadgeColor)
            : null;

          return (
            <Link
              key={work.id}
              href={`/works/${work.id}`}
              className="flex-shrink-0 snap-start"
              style={{ width: index < 3 && showRankBadge ? "200px" : "180px" }}
            >
              <Card className="group h-full overflow-hidden transition-all duration-200 hover:shadow-lg hover:scale-[1.02] p-0">
                {/* サムネイル */}
                <div className="relative aspect-video overflow-hidden bg-muted">
                  <img
                    src={
                      work.thumbnailUrl ||
                      "https://placehold.co/600x314/f4f4f5/71717a?text=No+Image"
                    }
                    alt={work.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />

                  {/* ランキングバッジ */}
                  {showRankBadge && rankStyles && (
                    <div
                      className={`absolute -left-1 -top-1 z-10 flex items-center justify-center rounded-full font-bold ${rankStyles.bg} ${rankStyles.text} ${rankStyles.size} ${rankStyles.shadow}`}
                    >
                      {index + 1}
                    </div>
                  )}

                  {/* セールバッジ */}
                  {isOnSale && work.discountPercent > 0 && (
                    <Badge
                      variant="destructive"
                      className={`absolute ${showRankBadge ? "top-2 right-2" : "top-2 left-2"} text-xs font-bold`}
                    >
                      {work.discountPercent}%OFF
                    </Badge>
                  )}

                  {/* 時間バッジ */}
                  {work.duration > 0 && (
                    <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded bg-black/70 px-1.5 py-0.5 text-[10px] text-white">
                      <Clock className="h-3 w-3" />
                      {work.duration}分
                    </div>
                  )}
                </div>

                {/* 情報エリア */}
                <div className="p-2.5">
                  {/* 女優名 */}
                  {work.actresses.length > 0 && (
                    <div className="mb-1 flex flex-wrap gap-1">
                      <Badge variant="secondary" className="text-[9px] px-1.5 py-0">
                        {work.actresses[0]}
                      </Badge>
                      {work.actresses.length > 1 && (
                        <span className="text-[9px] text-muted-foreground">
                          +{work.actresses.length - 1}
                        </span>
                      )}
                    </div>
                  )}

                  {/* タイトル */}
                  <h3 className="mb-1 line-clamp-2 text-xs font-medium leading-tight text-foreground">
                    {work.title}
                  </h3>

                  {/* 価格エリア */}
                  <div className="flex items-baseline gap-1.5">
                    {isOnSale && (
                      <span className="text-[10px] text-muted-foreground line-through">
                        {formatPrice(work.listPrice)}
                      </span>
                    )}
                    <span
                      className={`text-sm font-bold ${isOnSale ? "text-red-500" : "text-foreground"}`}
                    >
                      {formatPrice(work.price)}
                    </span>
                  </div>

                  {/* セール残り時間 */}
                  {isOnSale && work.saleEndDate && (
                    <span className="text-[9px] font-medium text-orange-500">
                      {getTimeRemaining(work.saleEndDate)}
                    </span>
                  )}

                  {/* 評価 */}
                  {work.rating > 0 && (
                    <div className="mt-1 flex items-center gap-1">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => {
                          const filled = star <= Math.round(work.rating);
                          return (
                            <Star
                              key={star}
                              className={`h-3 w-3 ${filled ? "fill-yellow-500 text-yellow-500" : "fill-gray-300 text-gray-300"}`}
                            />
                          );
                        })}
                      </div>
                      <span className="text-[9px] font-bold text-orange-500">
                        {work.rating.toFixed(1)}
                      </span>
                      {work.reviewCount > 0 && (
                        <span className="text-[9px] text-muted-foreground">
                          ({work.reviewCount})
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            </Link>
          );
        })}

        {/* もっと見るカード */}
        <Link
          href={href}
          className="flex-shrink-0 snap-start"
          style={{ width: "120px" }}
        >
          <Card className="flex h-full items-center justify-center bg-secondary/50 transition-all duration-200 hover:bg-secondary hover:shadow-lg p-0">
            <div className="flex flex-col items-center gap-2 p-4 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <ChevronRight className="h-6 w-6 text-primary" />
              </div>
              <span className="text-xs font-medium text-muted-foreground">
                もっと見る
              </span>
            </div>
          </Card>
        </Link>
      </div>
    </section>
  );
}
