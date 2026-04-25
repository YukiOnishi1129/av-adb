import { Clock } from "lucide-react";
import Link from "next/link";
import type { Work } from "@/lib/data-loader";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getFanzaInitialDiscount } from "@/lib/fanza-promo";
import { isGwCampaignWork } from "@/lib/gw-campaign";

export function WorkCard({ work }: { work: Work }) {
  const isOnSale = work.listPrice > 0 && work.price < work.listPrice;
  const isCouponEligible = getFanzaInitialDiscount(work) !== null;
  const isGwTarget = isGwCampaignWork(work);

  return (
    <Link href={`/works/${work.id}`}>
      <Card className="group overflow-hidden p-0 transition-all hover:border-primary/50">
        {/* サムネイル */}
        <div className="relative aspect-video overflow-hidden bg-muted">
          <img
            src={work.thumbnailUrl}
            alt={`${work.title}${work.actresses && work.actresses.length > 0 ? ` - ${work.actresses.slice(0, 2).join("・")}` : ""}${work.genres && work.genres.length > 0 ? `（${work.genres.slice(0, 3).join("・")}）` : ""}のAV動画`}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
          {isOnSale && work.discountPercent > 0 && (
            <Badge
              variant="destructive"
              className="absolute left-2 top-2 rounded-md"
            >
              {work.discountPercent}%OFF
            </Badge>
          )}
          {/* GWキャンペーン対象バッジ */}
          {isGwTarget && (
            <span className="absolute right-2 top-2 inline-flex items-center gap-0.5 rounded-md bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 px-1.5 py-0.5 text-[10px] font-bold text-white shadow-md">
              🎉 GW半額
            </span>
          )}
          {work.duration > 0 && (
            <Badge
              variant="secondary"
              className="absolute bottom-2 right-2 rounded-md bg-black/70 text-white"
            >
              {work.duration}分
            </Badge>
          )}
        </div>

        {/* 情報 */}
        <CardContent className="p-3">
          <h3 className="line-clamp-2 text-sm font-medium leading-tight">
            {work.title}
          </h3>

          {work.actresses.length > 0 && (
            <p className="mt-1 text-xs text-muted-foreground">
              {work.actresses.join(", ")}
            </p>
          )}

          <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
            {work.rating > 0 && (
              <div className="flex items-center gap-1">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const filled = star <= Math.round(work.rating);
                    return (
                      <svg key={star} className="h-3 w-3" viewBox="0 0 20 20" aria-hidden="true">
                        <path
                          d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                          fill={filled ? "#f59e0b" : "#374151"}
                          stroke="#ea580c"
                          strokeWidth="0.5"
                        />
                      </svg>
                    );
                  })}
                </div>
                <span>{work.rating.toFixed(2)} ({work.reviewCount || 0})</span>
              </div>
            )}
            {work.duration > 0 && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {work.duration}分
              </span>
            )}
          </div>

          <div className="mt-2 flex items-center justify-between">
            {work.genres.length > 0 && (
              <div className="flex items-center gap-1">
                {work.genres.slice(0, 2).map((genre) => (
                  <Badge key={genre} variant="secondary" className="text-xs">
                    {genre}
                  </Badge>
                ))}
              </div>
            )}
            <div className="text-right">
              {isOnSale ? (
                <div>
                  <div className="flex items-center justify-end gap-1">
                    <span className="text-xs text-muted-foreground line-through">
                      ¥{work.listPrice.toLocaleString()}
                    </span>
                    <span className="rounded bg-red-600 px-1 py-0.5 text-xs font-bold text-white">
                      {work.discountPercent}%OFF
                    </span>
                  </div>
                  <span className="font-bold text-red-500">
                    ¥{work.price.toLocaleString()}〜
                  </span>
                  {work.campaignEndDate && (
                    <p className="text-xs text-muted-foreground">
                      {work.campaignEndDate}
                    </p>
                  )}
                </div>
              ) : work.price > 0 ? (
                <span className="font-bold">
                  ¥{work.price.toLocaleString()}〜
                </span>
              ) : null}
            </div>
          </div>

          {/* FANZA初回購入クーポン対象表示 */}
          {isCouponEligible && (
            <p className="mt-1.5 text-[10px] font-medium text-pink-500">
              💡 FANZA初回なら -500円OFF対象
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
