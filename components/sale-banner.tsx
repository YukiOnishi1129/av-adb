"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Clock, Flame } from "lucide-react";
import type { Work } from "@/lib/data-loader";

interface SaleBannerProps {
  saleWorks: Work[];
}

function getCountdown(endDateStr: string | null): string {
  if (!endDateStr) return "";

  const end = new Date(endDateStr);
  const now = new Date();
  const diff = end.getTime() - now.getTime();

  if (diff <= 0) return "終了";

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) {
    return `${days}日 ${hours}時間`;
  }
  return `${hours}時間 ${minutes}分`;
}

export function SaleBanner({ saleWorks }: SaleBannerProps) {
  const [countdown, setCountdown] = useState("");

  // セール終了日が一番近い作品を取得
  const nearestSaleWork = saleWorks
    .filter((w) => w.saleEndDate)
    .sort((a, b) => {
      const aDate = new Date(a.saleEndDate!);
      const bDate = new Date(b.saleEndDate!);
      return aDate.getTime() - bDate.getTime();
    })[0];

  // 最大割引率を計算
  const maxDiscount = Math.max(...saleWorks.map((w) => w.discountPercent));

  useEffect(() => {
    if (!nearestSaleWork?.saleEndDate) return;

    const updateCountdown = () => {
      setCountdown(getCountdown(nearestSaleWork.saleEndDate));
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000); // 1分ごと更新

    return () => clearInterval(interval);
  }, [nearestSaleWork?.saleEndDate]);

  if (saleWorks.length === 0) return null;

  return (
    <Link href="/sale">
      <div className="relative mb-6 overflow-hidden rounded-xl bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 p-3 text-white shadow-lg transition-transform hover:scale-[1.01]">
        {/* 背景装飾 */}
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
        <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-white/10" />

        <div className="relative flex items-center gap-3">
          {/* 左: アイコン + テキスト */}
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20">
              <Flame className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-base font-bold whitespace-nowrap">セール開催中</span>
                {maxDiscount > 0 && (
                  <span className="rounded bg-white/20 px-1.5 py-0.5 text-xs font-bold whitespace-nowrap">
                    最大{maxDiscount}%OFF
                  </span>
                )}
              </div>
              <p className="text-xs text-white/80 whitespace-nowrap">
                {saleWorks.length}件のAV作品がお得に
              </p>
            </div>
          </div>

          {/* 右: カウントダウン */}
          {countdown && (
            <div className="flex shrink-0 items-center gap-1.5 rounded-lg bg-black/20 px-2 py-1.5">
              <Clock className="h-3.5 w-3.5" />
              <div className="text-right">
                <div className="text-[10px] text-white/70 whitespace-nowrap">終了まで</div>
                <div className="text-sm font-bold whitespace-nowrap">{countdown}</div>
              </div>
            </div>
          )}
        </div>

        {/* サムネイルプレビュー */}
        <div className="mt-2 flex -space-x-2">
          {saleWorks.slice(0, 5).map((work) => (
            <div
              key={work.id}
              className="h-9 w-14 overflow-hidden rounded border-2 border-white/30 bg-black"
            >
              <img
                src={work.thumbnailUrl}
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
          ))}
          {saleWorks.length > 5 && (
            <div className="flex h-9 w-14 items-center justify-center rounded border-2 border-white/30 bg-black/50 text-xs font-bold">
              +{saleWorks.length - 5}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
