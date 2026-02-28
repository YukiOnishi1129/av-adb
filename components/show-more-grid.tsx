"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const ITEMS_PER_PAGE = 30;

interface ShowMoreGridProps {
  children: React.ReactNode[];
  columns?: 2 | 3;
}

export function ShowMoreGrid({
  children,
  columns = 2,
}: ShowMoreGridProps) {
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const total = children.length;
  const hasMore = visibleCount < total;

  const gridClass =
    columns === 3
      ? "grid grid-cols-2 gap-3 sm:grid-cols-3"
      : "grid grid-cols-2 gap-3";

  return (
    <div>
      <div className={gridClass}>{children.slice(0, visibleCount)}</div>
      {hasMore && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => setVisibleCount((prev) => prev + ITEMS_PER_PAGE)}
            className="flex items-center gap-2 rounded-full bg-secondary px-6 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary/80"
          >
            <span>
              もっと見る（残り{total - visibleCount}件）
            </span>
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
