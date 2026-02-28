"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { ChevronRight, ChevronLeft, Heart, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { FeatureRecommendationView, ActressFeatureView } from "@/lib/data-loader";

// 統合された特集アイテムの型
export interface UnifiedFeatureItem {
  type: "genre" | "actress";
  name: string;
  slug: string;
  headline: string | null;
  thumbnailUrl: string | null;
  href: string;
  workCount: number;
}

// ジャンル特集を統合型に変換
export function featureToUnified(feature: FeatureRecommendationView): UnifiedFeatureItem {
  return {
    type: "genre",
    name: feature.name,
    slug: feature.slug,
    headline: feature.headline,
    thumbnailUrl: feature.thumbnailUrl,
    href: `/tokushu/${feature.slug}`,
    workCount: feature.workCount,
  };
}

// 女優特集を統合型に変換
export function actressFeatureToUnified(feature: ActressFeatureView): UnifiedFeatureItem {
  return {
    type: "actress",
    name: feature.name,
    slug: feature.slug,
    headline: feature.headline,
    thumbnailUrl: feature.representativeThumbnailUrl,
    href: `/tokushu/actress/${encodeURIComponent(feature.name)}`,
    workCount: feature.totalWorkCount,
  };
}

// 2つの配列を交互に混ぜる
export function interleaveFeatures(
  genres: FeatureRecommendationView[],
  actresses: ActressFeatureView[]
): UnifiedFeatureItem[] {
  const result: UnifiedFeatureItem[] = [];
  const maxLen = Math.max(genres.length, actresses.length);

  for (let i = 0; i < maxLen; i++) {
    if (i < genres.length) {
      result.push(featureToUnified(genres[i]));
    }
    if (i < actresses.length) {
      result.push(actressFeatureToUnified(actresses[i]));
    }
  }

  return result;
}

interface FeatureCarouselProps {
  features: FeatureRecommendationView[];
  actressFeatures?: ActressFeatureView[];
  autoPlay?: boolean;
  interval?: number;
}

interface UnifiedCarouselProps {
  items: UnifiedFeatureItem[];
  autoPlay?: boolean;
  interval?: number;
}

// 統合カルーセルアイテムのレンダリング
function UnifiedCarouselItem({ item }: { item: UnifiedFeatureItem }) {
  const isActress = item.type === "actress";
  const borderColor = isActress ? "border-pink-500/30 hover:border-pink-500/50" : "border-blue-500/30 hover:border-blue-500/50";
  const iconColor = isActress ? "text-pink-400" : "text-blue-400";
  const bgColor = isActress ? "bg-pink-500/20" : "bg-blue-500/20";
  const textColor = isActress ? "text-pink-500" : "text-blue-500";
  const Icon = isActress ? User : Heart;
  const label = isActress ? `${item.name}特集` : `${item.name}特集`;
  const defaultHeadline = isActress ? `${item.name}のおすすめAV` : `${item.name}作品を厳選`;

  return (
    <Link href={item.href}>
      <Card className={`overflow-hidden border ${borderColor} transition-all h-full p-0 gap-0 bg-transparent`}>
        {/* スマホ: 画像大きめ + オーバーレイテキスト */}
        <div className="relative md:hidden">
          {item.thumbnailUrl ? (
            <div className="relative aspect-3/2 overflow-hidden">
              <img
                src={item.thumbnailUrl}
                alt=""
                className="w-full h-full object-cover"
              />
              {/* 上下グラデーション */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent" />
              {/* 特集ラベル */}
              <div className={`absolute top-2 left-2 px-2.5 py-1 rounded-md text-sm font-bold text-white ${isActress ? "bg-pink-500" : "bg-blue-500"}`} style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.5)" }}>
                {isActress ? "👩 女優特集" : "💙 性癖特集"}
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Icon className={`h-5 w-5 ${iconColor}`} style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.8))" }} />
                  <span className="text-base font-bold text-white" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.9)" }}>{label}</span>
                </div>
                <p className="text-sm font-bold text-white/90 line-clamp-2" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.9)" }}>
                  {item.headline || defaultHeadline}
                </p>
              </div>
            </div>
          ) : (
            <div className="p-3 flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full ${bgColor} shrink-0`}>
                <Icon className={`h-5 w-5 ${textColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <span className={`text-xs font-bold ${textColor}`}>{label}</span>
              </div>
            </div>
          )}
        </div>

        {/* PC: 他のバナーと同じ高さの横並びレイアウト */}
        <div className="hidden md:flex items-center gap-4 p-4 h-full">
          {item.thumbnailUrl ? (
            <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden">
              <img
                src={item.thumbnailUrl}
                alt=""
                className="w-full h-full object-cover"
              />
              <div className={`absolute inset-0 bg-gradient-to-r ${isActress ? "from-pink-500/20" : "from-blue-500/20"} to-transparent`} />
            </div>
          ) : (
            <div className={`flex h-14 w-14 items-center justify-center rounded-full ${bgColor} shrink-0`}>
              <Icon className={`h-6 w-6 ${textColor}`} />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Icon className={`h-4 w-4 ${textColor}`} />
              <span className={`text-sm font-bold ${textColor}`}>{label}</span>
              <span className={`px-2 py-0.5 rounded text-xs font-bold text-white ${isActress ? "bg-pink-500" : "bg-blue-500"}`}>
                {isActress ? "👩 女優" : "💙 性癖"}
              </span>
            </div>
            <p className="text-xs font-bold text-muted-foreground line-clamp-1">
              {item.headline || defaultHeadline}
            </p>
          </div>
          <ChevronRight className={`h-5 w-5 ${textColor} shrink-0`} />
        </div>
      </Card>
    </Link>
  );
}

// PC用: 5カラム表示で1つずつスライドするカルーセル（統合版）
function UnifiedGridCarouselItem({ item }: { item: UnifiedFeatureItem }) {
  const isActress = item.type === "actress";
  const borderColor = isActress ? "border-pink-500/30 hover:border-pink-500/50" : "border-blue-500/30 hover:border-blue-500/50";
  const iconColor = isActress ? "text-pink-400" : "text-blue-400";
  const bgColor = isActress ? "bg-pink-500/10" : "bg-blue-500/10";
  const textColor = isActress ? "text-pink-500" : "text-blue-500";
  const Icon = isActress ? User : Heart;

  return (
    <Link href={item.href}>
      <Card className={`overflow-hidden border ${borderColor} transition-all group p-0 gap-0 bg-transparent`}>
        <div className="relative aspect-3/2 overflow-hidden">
          {item.thumbnailUrl ? (
            <img
              src={item.thumbnailUrl}
              alt=""
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
          ) : (
            <div className={`w-full h-full ${bgColor} flex items-center justify-center`}>
              <Icon className={`h-8 w-8 ${textColor}`} />
            </div>
          )}
          {/* 上下グラデーション */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent" />
          {/* 特集ラベル */}
          <div className={`absolute top-2 left-2 px-2 py-1 rounded-md text-xs font-bold text-white ${isActress ? "bg-pink-500" : "bg-blue-500"}`} style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.5)" }}>
            {isActress ? "👩 女優特集" : "💙 性癖特集"}
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-2">
            <div className="flex items-center gap-1 mb-0.5">
              <Icon className={`h-3 w-3 ${iconColor}`} style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.8))" }} />
              <span className="text-xs font-bold text-white truncate" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.9)" }}>{item.name}</span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}

// 統合版グリッドカルーセル（PC用）
export function UnifiedFeatureGridCarousel({
  items,
  autoPlay = true,
  interval = 4000,
}: UnifiedCarouselProps) {
  const visibleCount = 5;
  const cardWidthPercent = 100 / visibleCount;

  const extendedItems = items.length > visibleCount
    ? [
        ...items.slice(-visibleCount),
        ...items,
        ...items.slice(0, visibleCount),
      ]
    : items;

  const initialIndex = items.length > visibleCount ? visibleCount : 0;
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goToNext = useCallback(() => {
    if (isTransitioning || items.length <= visibleCount) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  }, [isTransitioning, items.length]);

  const goToPrev = useCallback(() => {
    if (isTransitioning || items.length <= visibleCount) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
  }, [isTransitioning, items.length]);

  useEffect(() => {
    if (!isTransitioning) return;

    const timer = setTimeout(() => {
      setIsTransitioning(false);

      if (currentIndex >= items.length + visibleCount) {
        setCurrentIndex(visibleCount);
      } else if (currentIndex < visibleCount) {
        setCurrentIndex(items.length + visibleCount - 1);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [isTransitioning, currentIndex, items.length]);

  useEffect(() => {
    if (!autoPlay || items.length <= visibleCount) return;

    const timer = setInterval(() => {
      goToNext();
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval, items.length, goToNext]);

  if (items.length === 0) return null;

  const showNavigation = items.length > visibleCount;
  const translateX = currentIndex * cardWidthPercent;

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <div
          className={`flex gap-3 ${isTransitioning ? "transition-transform duration-300 ease-out" : ""}`}
          style={{
            transform: `translateX(calc(-${translateX}% - ${currentIndex * 12 / visibleCount}px))`,
          }}
        >
          {extendedItems.map((item, index) => (
            <div
              key={`${item.slug}-${index}`}
              className="shrink-0"
              style={{ width: `calc((100% - 48px) / 5)` }}
            >
              <UnifiedGridCarouselItem item={item} />
            </div>
          ))}
        </div>
      </div>

      {showNavigation && (
        <>
          <button
            type="button"
            onClick={goToPrev}
            className="absolute -left-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors z-10"
            aria-label="前へ"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={goToNext}
            className="absolute -right-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors z-10"
            aria-label="次へ"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </>
      )}
    </div>
  );
}

// 統合版モバイルカルーセル（5秒間隔）
export function UnifiedFeatureCarousel({
  items,
  autoPlay = true,
  interval = 5000,
}: UnifiedCarouselProps) {
  const extendedItems = items.length > 1
    ? [items[items.length - 1], ...items, items[0]]
    : items;

  const [slideIndex, setSlideIndex] = useState(items.length > 1 ? 1 : 0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const displayIndex = items.length > 1
    ? (slideIndex - 1 + items.length) % items.length
    : 0;

  const goToNext = useCallback(() => {
    if (isTransitioning || items.length <= 1) return;
    setIsTransitioning(true);
    setSlideIndex((prev) => prev + 1);
  }, [isTransitioning, items.length]);

  const goToPrev = useCallback(() => {
    if (isTransitioning || items.length <= 1) return;
    setIsTransitioning(true);
    setSlideIndex((prev) => prev - 1);
  }, [isTransitioning, items.length]);

  const goToIndex = useCallback((targetDisplayIndex: number) => {
    if (isTransitioning || items.length <= 1) return;
    if (targetDisplayIndex === displayIndex) return;

    setIsTransitioning(true);
    const diff = targetDisplayIndex - displayIndex;
    if (diff > 0) {
      setSlideIndex((prev) => prev + diff);
    } else {
      setSlideIndex(targetDisplayIndex + 1);
    }
  }, [isTransitioning, items.length, displayIndex]);

  useEffect(() => {
    if (!isTransitioning) return;

    const timer = setTimeout(() => {
      setIsTransitioning(false);

      if (slideIndex >= extendedItems.length - 1) {
        setSlideIndex(1);
      } else if (slideIndex <= 0) {
        setSlideIndex(items.length);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [isTransitioning, slideIndex, extendedItems.length, items.length]);

  useEffect(() => {
    if (!autoPlay || items.length <= 1) return;

    const timer = setInterval(() => {
      goToNext();
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval, items.length, goToNext]);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrev();
    }
  };

  if (items.length === 0) return null;

  return (
    <div className="relative h-full">
      <div
        className="overflow-hidden h-full"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div
          ref={trackRef}
          className={`flex ${isTransitioning ? "transition-transform duration-300 ease-out" : ""}`}
          style={{ transform: `translateX(-${slideIndex * 100}%)` }}
        >
          {extendedItems.map((item, index) => (
            <div key={`${item.slug}-${index}`} className="w-full shrink-0 h-full">
              <UnifiedCarouselItem item={item} />
            </div>
          ))}
        </div>
      </div>

      {items.length > 1 && (
        <>
          <button
            type="button"
            onClick={goToPrev}
            className="absolute left-1 md:left-2 top-1/2 -translate-y-1/2 flex h-7 w-7 md:h-8 md:w-8 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors z-10"
            aria-label="前へ"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={goToNext}
            className="absolute right-1 md:right-2 top-1/2 -translate-y-1/2 flex h-7 w-7 md:h-8 md:w-8 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors z-10"
            aria-label="次へ"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          <div className="flex justify-center gap-1.5 mt-2">
            {items.map((item, index) => (
              <button
                type="button"
                key={index}
                onClick={() => goToIndex(index)}
                className={`h-1.5 rounded-full transition-all ${
                  index === displayIndex
                    ? `${item.type === "actress" ? "bg-pink-500" : "bg-blue-500"} w-4`
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50 w-1.5"
                }`}
                aria-label={`${index + 1}番目へ`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// 後方互換性のための既存エクスポート
export function FeatureGridCarousel({
  features,
  actressFeatures = [],
  autoPlay = true,
  interval = 4000,
}: FeatureCarouselProps) {
  const items = interleaveFeatures(features, actressFeatures);
  return <UnifiedFeatureGridCarousel items={items} autoPlay={autoPlay} interval={interval} />;
}

export function FeatureCarousel({
  features,
  actressFeatures = [],
  autoPlay = true,
  interval = 5000,
}: FeatureCarouselProps) {
  const items = interleaveFeatures(features, actressFeatures);
  return <UnifiedFeatureCarousel items={items} autoPlay={autoPlay} interval={interval} />;
}
