import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { SearchItem } from "@/lib/search";

interface SearchResultCardProps {
  item: SearchItem;
}

export function SearchResultCard({ item }: SearchResultCardProps) {
  const hasRating = item.rt && item.rt > 0;
  const isOnSale = item.dr && item.dr > 0;

  // 再生時間表示
  const durationLabel = item.dur ? `${item.dur}分` : null;

  return (
    <Link href={`/works/${item.id}`}>
      <Card className="group h-full overflow-hidden transition-colors hover:border-primary">
        {/* サムネイル */}
        <div className="relative">
          <img
            src={item.img}
            alt={item.t}
            className="aspect-[4/3] w-full object-cover"
            loading="lazy"
          />
          {isOnSale && (
            <Badge className="absolute left-2 top-2 bg-red-500 text-white">
              {item.dr}%OFF
            </Badge>
          )}
          {durationLabel && (
            <Badge variant="secondary" className="absolute right-2 top-2 text-xs">
              {durationLabel}
            </Badge>
          )}
        </div>

        <CardContent className="p-3">
          {/* タイトル */}
          <h3 className="mb-1 line-clamp-2 text-sm font-medium text-foreground group-hover:text-primary">
            {item.t}
          </h3>

          {/* 女優 */}
          {item.ac.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-1">
              {item.ac.slice(0, 2).map((actress) => (
                <Badge key={actress} variant="outline" className="text-xs">
                  {actress}
                </Badge>
              ))}
              {item.ac.length > 2 && (
                <span className="text-xs text-muted-foreground">
                  +{item.ac.length - 2}
                </span>
              )}
            </div>
          )}

          {/* 価格 */}
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-bold text-foreground">
              ¥{item.p.toLocaleString()}
            </span>
            {isOnSale && (
              <span className="text-xs text-muted-foreground line-through">
                ¥{item.lp.toLocaleString()}
              </span>
            )}
          </div>

          {/* 評価 */}
          {hasRating && (
            <div className="mt-2 flex items-center gap-1">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => {
                  const filled = star <= Math.round(item.rt!);
                  return (
                    <svg key={star} className="h-3.5 w-3.5" viewBox="0 0 20 20">
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
              <span className="text-xs text-muted-foreground">
                {item.rt?.toFixed(2)} ({item.rc || 0})
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
