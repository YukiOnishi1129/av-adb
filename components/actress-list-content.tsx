"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Crown, Trophy, Medal, User } from "lucide-react";

interface ActressInfo {
  name: string;
  workCount: number;
  thumbnailUrl: string;
}

interface RankedActress {
  name: string;
  slug: string;
  fanzaRanking: number;
  totalWorkCount: number;
}

interface ActressListContentProps {
  actresses: ActressInfo[];
  rankedActresses: RankedActress[];
}

export function ActressListContent({ actresses, rankedActresses }: ActressListContentProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // actressesから名前→サムネイルのマップを作成
  const actressThumbnailMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const a of actresses) {
      map.set(a.name, a.thumbnailUrl);
    }
    return map;
  }, [actresses]);

  // 人気女優TOP10（FANZAランキング順）+ actressesのサムネイルを使う
  const popularActresses = useMemo(() => {
    return [...rankedActresses]
      .filter((a) => a.fanzaRanking !== null)
      .sort((a, b) => a.fanzaRanking - b.fanzaRanking)
      .slice(0, 10)
      .map((a) => ({
        ...a,
        thumbnailUrl: actressThumbnailMap.get(a.name) || null,
      }));
  }, [rankedActresses, actressThumbnailMap]);

  // 人気女優の名前セット（重複除外用）
  const popularNames = useMemo(() => {
    return new Set(popularActresses.map((a) => a.name));
  }, [popularActresses]);

  // その他の女優（人気女優以外、作品数順）
  const otherActresses = useMemo(() => {
    return actresses
      .filter((a) => !popularNames.has(a.name))
      .sort((a, b) => b.workCount - a.workCount);
  }, [actresses, popularNames]);

  // 検索フィルタ
  const filteredPopular = useMemo(() => {
    if (!searchQuery) return popularActresses;
    return popularActresses.filter((actress) =>
      actress.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [popularActresses, searchQuery]);

  const filteredOther = useMemo(() => {
    if (!searchQuery) return otherActresses;
    return otherActresses.filter((actress) =>
      actress.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [otherActresses, searchQuery]);

  const totalFiltered = filteredPopular.length + filteredOther.length;

  // ランクアイコン
  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-4 w-4 text-amber-400" />;
    if (rank === 2) return <Trophy className="h-4 w-4 text-gray-400" />;
    if (rank === 3) return <Medal className="h-4 w-4 text-amber-600" />;
    return null;
  };

  return (
    <>
      {/* ヘッダー */}
      <div className="mb-4">
        <h1 className="text-xl font-bold text-foreground mb-1">女優一覧</h1>
        <p className="text-sm text-muted-foreground">
          {actresses.length}名の女優が登録されています
        </p>
      </div>

      {/* 検索ボックス */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="女優名で検索..."
            className="h-11 pl-10 text-base"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {searchQuery && (
          <p className="mt-2 text-sm text-muted-foreground">
            「{searchQuery}」で {totalFiltered}件ヒット
          </p>
        )}
      </div>

      {/* 人気女優セクション（FANZAランキング順） */}
      {filteredPopular.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Crown className="h-5 w-5 text-amber-400" />
            <h2 className="text-lg font-bold text-foreground">人気女優TOP10</h2>
          </div>
          <div className="grid gap-3">
            {filteredPopular.map((actress, index) => {
              const displayRank = index + 1;
              return (
                <Link
                  key={actress.name}
                  href={`/actresses/${encodeURIComponent(actress.name)}`}
                >
                  <Card className="group transition-all hover:border-primary/50 border-amber-500/20 bg-gradient-to-r from-amber-500/5 to-transparent">
                    <CardContent className="p-3 flex items-center gap-3">
                      {/* ランク */}
                      <div
                        className={`flex items-center justify-center w-9 h-9 rounded-full font-bold text-sm shrink-0 ${
                          displayRank === 1
                            ? "bg-amber-500 text-white"
                            : displayRank === 2
                              ? "bg-gray-400 text-white"
                              : displayRank === 3
                                ? "bg-amber-700 text-white"
                                : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {displayRank}
                      </div>
                      {/* サムネイル */}
                      {actress.thumbnailUrl && (
                        <div className="relative w-14 h-10 shrink-0 rounded overflow-hidden bg-muted">
                          <Image
                            src={actress.thumbnailUrl}
                            alt={actress.name}
                            fill
                            className="object-cover"
                            sizes="56px"
                          />
                        </div>
                      )}
                      {/* 名前 */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-foreground group-hover:text-primary transition-colors truncate">
                          {actress.name}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {actress.totalWorkCount}作品に出演
                        </p>
                      </div>
                      {/* バッジ */}
                      {displayRank <= 3 && (
                        <Badge
                          variant="secondary"
                          className={`shrink-0 ${
                            displayRank === 1
                              ? "bg-amber-500/20 text-amber-500"
                              : displayRank === 2
                                ? "bg-gray-400/20 text-gray-400"
                                : "bg-amber-700/20 text-amber-700"
                          }`}
                        >
                          {getRankIcon(displayRank)}
                          <span className="ml-1">
                            {displayRank === 1
                              ? "1st"
                              : displayRank === 2
                                ? "2nd"
                                : "3rd"}
                          </span>
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* その他の女優セクション */}
      {filteredOther.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <User className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-lg font-bold text-foreground">その他の女優</h2>
            <span className="text-sm text-muted-foreground">
              ({filteredOther.length}名)
            </span>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {filteredOther.map((actress) => (
              <Link
                key={actress.name}
                href={`/actresses/${encodeURIComponent(actress.name)}`}
              >
                <Card className="group transition-colors hover:border-primary/50">
                  <CardContent className="p-3 flex items-center justify-between">
                    <h3 className="font-medium text-foreground group-hover:text-primary transition-colors truncate">
                      {actress.name}
                    </h3>
                    <span className="text-xs text-muted-foreground shrink-0 ml-2">
                      {actress.workCount}作品
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 検索結果なし */}
      {totalFiltered === 0 && searchQuery && (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">
            「{searchQuery}」に一致する女優が見つかりませんでした
          </p>
        </div>
      )}
    </>
  );
}
