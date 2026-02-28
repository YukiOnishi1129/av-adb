/**
 * AV-ADB データローダー
 *
 * prebuild-data.mjsで生成されたJSONキャッシュからデータを読み込む。
 * ビルド時に一度だけ読み込んでメモリにキャッシュする。
 */

import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

// キャッシュディレクトリのパス
const CACHE_DIR = join(process.cwd(), ".cache/data");

// キャッシュ用
let worksCache: AvWork[] | null = null;
let actressFeaturesCache: ActressFeature[] | null = null;
let saleFeaturesCache: SaleFeature[] | null = null;
let dailyRecommendationsCache: DailyRecommendation[] | null = null;
let featureRecommendationsCache: FeatureRecommendation[] | null = null;

// AV作品の型定義（R2 Parquetから取得した生データ）
export interface AvWork {
  id: number;
  maker_id: number | null;
  title: string;
  fanza_product_id: string;
  fanza_url: string;
  thumbnail_url: string;
  sample_images: string[] | null;
  sample_movie_url: string | null;
  description: string | null;
  release_date: string | null;
  duration_minutes: number | null;
  price: number | null;
  sale_price: number | null;
  discount_rate: number | null;
  coupon_amount: number | null;
  sale_end_date: string | null;
  is_on_sale: number;
  ranking_position: number | null;
  rating: number | null;
  review_count: number | null;
  review_comment_count: number | null;
  user_reviews: unknown[] | null;
  // AI生成コンテンツ
  ai_review: string | null;
  ai_summary: string | null;
  ai_recommend_reason: string | null;
  ai_appeal_points: string | null;
  ai_target_audience: string | null;
  ai_warnings: string | null;
  ai_tags: string[] | null;
  // タグ・属性
  actress_names: string[] | null;
  genres: string[] | null;
  is_summarized: number;
  is_available: number;
  created_at: string;
  updated_at: string;
}

// フロント用の型（2d-adb互換）
export interface Work {
  id: string;
  title: string;
  thumbnailUrl: string;
  sampleImages: string[];
  description: string | null;
  actresses: string[];
  maker: string;
  releaseDate: string;
  duration: number;
  rating: number;
  reviewCount: number;
  price: number;
  listPrice: number;
  discountPercent: number;
  campaignTitle: string | null;
  campaignEndDate: string | null;
  saleEndDate: string | null;
  genres: string[];
  // AI生成コンテンツ
  aiReview: string | null;
  aiSummary: string | null;
  aiRecommendReason: string | null;
  aiAppealPoints: string | null;
  aiTargetAudience: string | null;
  aiWarnings: string | null;
  aiTags: string[];
  fanzaUrl: string;
  rankingPosition: number | null;
}

/**
 * JSONキャッシュファイルを読み込む
 */
function loadJson<T>(filename: string): T[] {
  const filePath = join(CACHE_DIR, filename);
  if (!existsSync(filePath)) {
    console.warn(`Cache file not found: ${filePath}`);
    return [];
  }
  const content = readFileSync(filePath, "utf-8");
  return JSON.parse(content) as T[];
}

/**
 * JSON配列をパースするヘルパー関数
 */
function parseJsonArray(data: unknown): string[] {
  if (!data) return [];
  if (typeof data === "string") {
    try {
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return Array.isArray(data) ? data : [];
}

/**
 * AvWorkをWork型に変換
 */
function convertToWork(vr: AvWork): Work {
  // 価格
  const price = vr.sale_price || vr.price || 0;
  const listPrice = vr.price || 0;

  // 割引率
  let discountPercent = vr.discount_rate || 0;
  if (!discountPercent && listPrice > 0 && price < listPrice) {
    discountPercent = Math.round(((listPrice - price) / listPrice) * 100);
  }

  // セール終了日をフォーマット
  let campaignEndDate: string | null = null;
  if (vr.sale_end_date) {
    const endDate = new Date(vr.sale_end_date);
    if (!Number.isNaN(endDate.getTime())) {
      const month = endDate.getMonth() + 1;
      const day = endDate.getDate();
      const hour = endDate.getHours();
      campaignEndDate = `${month}/${day} ${hour}時まで`;
    }
  }

  // 日付をフォーマット
  let releaseDate = "";
  if (vr.release_date) {
    const date = new Date(vr.release_date);
    releaseDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  }

  // 配列フィールドをパース
  const sampleImages = parseJsonArray(vr.sample_images);
  const actresses = parseJsonArray(vr.actress_names);
  const genres = parseJsonArray(vr.genres);
  const aiTags = parseJsonArray(vr.ai_tags);

  return {
    id: vr.fanza_product_id,
    title: vr.title,
    thumbnailUrl: vr.thumbnail_url || "",
    sampleImages,
    description: vr.description,
    actresses,
    maker: "", // TODO: makers.jsonからmaker_idで取得
    releaseDate,
    duration: vr.duration_minutes || 0,
    rating: vr.rating || 0,
    reviewCount: vr.review_count || 0,
    price,
    listPrice,
    discountPercent,
    campaignTitle: vr.is_on_sale ? "セール中" : null,
    campaignEndDate,
    saleEndDate: vr.sale_end_date,
    genres,
    // AI生成コンテンツ
    aiReview: vr.ai_review,
    aiSummary: vr.ai_summary,
    aiRecommendReason: vr.ai_recommend_reason,
    aiAppealPoints: vr.ai_appeal_points,
    aiTargetAudience: vr.ai_target_audience,
    aiWarnings: vr.ai_warnings,
    aiTags,
    fanzaUrl: vr.fanza_url || "",
    rankingPosition: vr.ranking_position,
  };
}

/**
 * 生データを取得（キャッシュ付き）
 */
async function getRawWorks(): Promise<AvWork[]> {
  if (worksCache === null) {
    worksCache = loadJson<AvWork>("works.json");
    console.log(`Loaded ${worksCache.length} AV works from cache`);
  }
  return worksCache;
}

/**
 * 作品データを取得（Work型）
 */
export async function getWorks(): Promise<Work[]> {
  const rawWorks = await getRawWorks();
  return rawWorks.map(convertToWork);
}

/**
 * 作品IDで取得
 */
export async function getWorkById(contentId: string): Promise<Work | undefined> {
  const rawWorks = await getRawWorks();
  const vr = rawWorks.find((w) => w.fanza_product_id === contentId);
  return vr ? convertToWork(vr) : undefined;
}

/**
 * キャッシュをクリアする（テスト用）
 */
export function clearCache(): void {
  worksCache = null;
}

// 女優/ジャンル情報の型
export interface ActressInfo {
  name: string;
  workCount: number;
  thumbnailUrl: string; // 代表作品のサムネイル
}

export interface GenreInfo {
  name: string;
  workCount: number;
  thumbnailUrl: string;
}

/**
 * 女優一覧を取得（作品数降順）
 */
export async function getActresses(): Promise<ActressInfo[]> {
  const works = await getWorks();
  const actressMap = new Map<string, { count: number; thumbnailUrl: string }>();

  for (const work of works) {
    for (const actress of work.actresses) {
      if (!actress) continue;
      const existing = actressMap.get(actress);
      if (existing) {
        existing.count++;
      } else {
        actressMap.set(actress, { count: 1, thumbnailUrl: work.thumbnailUrl });
      }
    }
  }

  return Array.from(actressMap.entries())
    .map(([name, data]) => ({
      name,
      workCount: data.count,
      thumbnailUrl: data.thumbnailUrl,
    }))
    .sort((a, b) => b.workCount - a.workCount);
}

/**
 * 特定の女優の作品を取得
 */
export async function getWorksByActress(actressName: string): Promise<Work[]> {
  const works = await getWorks();
  return works.filter((work) => work.actresses.includes(actressName));
}

/**
 * ジャンル一覧を取得（作品数降順）
 */
export async function getGenres(): Promise<GenreInfo[]> {
  const works = await getWorks();
  const genreMap = new Map<string, { count: number; thumbnailUrl: string }>();

  for (const work of works) {
    for (const genre of work.genres) {
      if (!genre) continue;
      const existing = genreMap.get(genre);
      if (existing) {
        existing.count++;
      } else {
        genreMap.set(genre, { count: 1, thumbnailUrl: work.thumbnailUrl });
      }
    }
  }

  return Array.from(genreMap.entries())
    .map(([name, data]) => ({
      name,
      workCount: data.count,
      thumbnailUrl: data.thumbnailUrl,
    }))
    .sort((a, b) => b.workCount - a.workCount);
}

/**
 * 特定のジャンルの作品を取得
 */
export async function getWorksByGenre(genreName: string): Promise<Work[]> {
  const works = await getWorks();
  return works.filter((work) => work.genres.includes(genreName));
}

/**
 * ランキング順で作品を取得
 */
export async function getWorksByRanking(): Promise<Work[]> {
  const works = await getWorks();
  return works
    .filter((work) => work.rankingPosition !== null)
    .sort((a, b) => (a.rankingPosition || 999) - (b.rankingPosition || 999));
}

/**
 * セール中の作品を取得
 */
export async function getSaleWorks(): Promise<Work[]> {
  const works = await getWorks();
  return works.filter((work) => work.discountPercent > 0);
}

/**
 * 同じ女優の作品を取得（自分自身を除く）
 */
export async function getWorksByActressExcluding(
  actressName: string,
  excludeId: string,
  limit = 4
): Promise<Work[]> {
  const works = await getWorks();
  return works
    .filter((work) => work.id !== excludeId && work.actresses.includes(actressName))
    .slice(0, limit);
}

/**
 * タグベースで似た作品を取得
 */
export async function getSimilarWorks(
  currentWork: Work,
  limit = 4
): Promise<Work[]> {
  const works = await getWorks();
  const currentTags = [...currentWork.aiTags, ...currentWork.genres];

  // スコア計算：共通タグの数
  const scored = works
    .filter((work) => work.id !== currentWork.id)
    .map((work) => {
      const workTags = [...work.aiTags, ...work.genres];
      const commonTags = currentTags.filter((tag) => workTags.includes(tag));
      return { work, score: commonTags.length };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((item) => item.work);
}

/**
 * 人気作品を取得（ランキング上位 or 評価順）
 */
export async function getPopularWorks(
  excludeId: string,
  limit = 4
): Promise<Work[]> {
  const works = await getWorks();
  return works
    .filter((work) => work.id !== excludeId)
    .sort((a, b) => {
      // ランキングがあればそれを優先
      if (a.rankingPosition && b.rankingPosition) {
        return a.rankingPosition - b.rankingPosition;
      }
      if (a.rankingPosition) return -1;
      if (b.rankingPosition) return 1;
      // なければ評価順
      return b.rating - a.rating;
    })
    .slice(0, limit);
}

/**
 * 高評価作品を取得（指定評価以上）
 */
export async function getHighRatedWorks(
  minRating = 4.5,
  limit = 12
): Promise<Work[]> {
  const works = await getWorks();
  return works
    .filter((work) => work.rating >= minRating)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
}

/**
 * バーゲン作品を取得（指定価格以下）
 */
export async function getBargainWorks(
  maxPrice = 500,
  limit = 12
): Promise<Work[]> {
  const works = await getWorks();
  return works
    .filter((work) => work.price > 0 && work.price <= maxPrice)
    .sort((a, b) => a.price - b.price)
    .slice(0, limit);
}

/**
 * 新着作品を取得（リリース日順）
 */
export async function getNewWorks(limit = 12): Promise<Work[]> {
  const works = await getWorks();
  return works
    .filter((work) => work.releaseDate)
    .sort((a, b) => b.releaseDate.localeCompare(a.releaseDate))
    .slice(0, limit);
}

/**
 * 特定ジャンルのランキング作品を取得
 */
export async function getGenreRankingWorks(
  genreName: string,
  limit = 12
): Promise<Work[]> {
  const works = await getWorks();
  return works
    .filter((work) => work.genres.includes(genreName))
    .sort((a, b) => {
      if (a.rankingPosition && b.rankingPosition) {
        return a.rankingPosition - b.rankingPosition;
      }
      if (a.rankingPosition) return -1;
      if (b.rankingPosition) return 1;
      return b.rating - a.rating;
    })
    .slice(0, limit);
}

// =====================================================
// 女優特集関連
// =====================================================

// 女優特集の型定義（DBテーブルと対応）
export interface ActressFeature {
  id: number;
  actress_id: number;
  name: string;
  slug: string;
  headline: string | null;
  description: string | null;
  representative_work_id: number | null;
  representative_thumbnail_url: string | null;
  recommended_works: RecommendedWork[] | string | null;
  solo_recommended_works: RecommendedWork[] | string | null;
  multi_recommended_works: RecommendedWork[] | string | null;
  sale_works: SaleWork[] | string | null;
  total_work_count: number;
  solo_work_count: number;
  avg_rating: number | null;
  sale_count: number;
  fanza_ranking: number | null;
  is_active: number;
  created_at: string;
  updated_at: string;
}

export interface RecommendedWork {
  work_id: number;
  title: string;
  reason: string;
  target_audience: string;
  thumbnail_url: string | null;
}

export interface SaleWork {
  work_id: number;
  title: string;
  discount_rate: number;
  thumbnail_url: string | null;
}

// フロント用の女優特集型
export interface ActressFeatureView {
  id: number;
  actressId: number;
  name: string;
  slug: string;
  headline: string;
  description: string;
  representativeThumbnailUrl: string | null;
  recommendedWorks: RecommendedWork[];
  soloRecommendedWorks: RecommendedWork[];
  multiRecommendedWorks: RecommendedWork[];
  saleWorks: SaleWork[];
  totalWorkCount: number;
  soloWorkCount: number;
  avgRating: number | null;
  saleCount: number;
  fanzaRanking: number | null;
  updatedAt: string;
}

/**
 * JSON配列フィールドをパースするヘルパー
 */
function parseRecommendedWorks(data: RecommendedWork[] | string | null): RecommendedWork[] {
  if (!data) return [];
  if (typeof data === "string") {
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  }
  return data;
}

function parseSaleWorks(data: SaleWork[] | string | null): SaleWork[] {
  if (!data) return [];
  if (typeof data === "string") {
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  }
  return data;
}

/**
 * ActressFeatureをフロント用に変換
 */
function convertToActressFeatureView(feature: ActressFeature): ActressFeatureView {
  // 各フィールドをパース
  const recommendedWorks = parseRecommendedWorks(feature.recommended_works);
  const soloRecommendedWorks = parseRecommendedWorks(feature.solo_recommended_works);
  const multiRecommendedWorks = parseRecommendedWorks(feature.multi_recommended_works);
  const saleWorks = parseSaleWorks(feature.sale_works);

  return {
    id: feature.id,
    actressId: feature.actress_id,
    name: feature.name,
    slug: feature.slug,
    headline: feature.headline || `${feature.name}の特集`,
    description: feature.description || `${feature.name}の作品を厳選してお届け。`,
    representativeThumbnailUrl: feature.representative_thumbnail_url,
    recommendedWorks,
    soloRecommendedWorks,
    multiRecommendedWorks,
    saleWorks,
    totalWorkCount: feature.total_work_count,
    soloWorkCount: feature.solo_work_count,
    avgRating: feature.avg_rating,
    saleCount: feature.sale_count,
    fanzaRanking: feature.fanza_ranking,
    updatedAt: feature.updated_at,
  };
}

/**
 * 女優特集データを取得（キャッシュ付き）
 */
async function getRawActressFeatures(): Promise<ActressFeature[]> {
  if (actressFeaturesCache === null) {
    actressFeaturesCache = loadJson<ActressFeature>("actress_features.json");
    console.log(`Loaded ${actressFeaturesCache.length} actress features from cache`);
  }
  return actressFeaturesCache;
}

/**
 * 女優特集一覧を取得（ランキング順）
 */
export async function getActressFeatures(): Promise<ActressFeatureView[]> {
  const rawFeatures = await getRawActressFeatures();
  return rawFeatures
    .filter((f) => f.is_active === 1)
    .sort((a, b) => (a.fanza_ranking || 999) - (b.fanza_ranking || 999))
    .map(convertToActressFeatureView);
}

/**
 * 女優特集を名前で取得
 */
export async function getActressFeatureByName(name: string): Promise<ActressFeatureView | undefined> {
  const rawFeatures = await getRawActressFeatures();
  const feature = rawFeatures.find((f) => f.name === name && f.is_active === 1);
  return feature ? convertToActressFeatureView(feature) : undefined;
}

/**
 * 女優特集をslugで取得
 */
export async function getActressFeatureBySlug(slug: string): Promise<ActressFeatureView | undefined> {
  const rawFeatures = await getRawActressFeatures();
  const feature = rawFeatures.find((f) => f.slug === slug && f.is_active === 1);
  return feature ? convertToActressFeatureView(feature) : undefined;
}

/**
 * 作品IDリストから作品を取得
 */
export async function getWorksByIds(ids: string[]): Promise<Work[]> {
  const works = await getWorks();
  const idSet = new Set(ids);
  return works.filter((work) => idSet.has(work.id));
}

// =====================================================
// セール特集関連
// =====================================================

// セール特集の型定義（DBテーブルと対応）
export interface SaleFeature {
  id: number;
  target_date: string;
  // メイン作品
  main_work_id: number | null;
  main_headline: string | null;
  main_reason: string | null;
  // サブ作品1
  sub1_work_id: number | null;
  sub1_one_liner: string | null;
  // サブ作品2
  sub2_work_id: number | null;
  sub2_one_liner: string | null;
  // リスト
  cheapest_work_ids: number[] | string | null;
  high_discount_work_ids: number[] | string | null;
  high_rating_work_ids: number[] | string | null;
  // 統計
  total_sale_count: number;
  max_discount_rate: number;
  ogp_image_url: string | null;
  created_at: string;
  updated_at: string;
}

// フロント用のセール特集型
export interface SaleFeatureView {
  id: number;
  targetDate: string;
  // メイン作品
  mainWorkId: number | null;
  mainHeadline: string;
  mainReason: string;
  // サブ作品1
  sub1WorkId: number | null;
  sub1OneLiner: string | null;
  // サブ作品2
  sub2WorkId: number | null;
  sub2OneLiner: string | null;
  // リスト
  cheapestWorkIds: number[];
  highDiscountWorkIds: number[];
  highRatingWorkIds: number[];
  // 統計
  totalSaleCount: number;
  maxDiscountRate: number;
  updatedAt: string;
  // 後方互換（バナー用）
  featuredWorkId: number | null;
  featuredThumbnailUrl: string | null;
}

/**
 * SaleFeatureをフロント用に変換
 */
function convertToSaleFeatureView(feature: SaleFeature): SaleFeatureView {
  const parseIds = (value: number[] | string | null): number[] => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  return {
    id: feature.id,
    targetDate: feature.target_date,
    // メイン作品
    mainWorkId: feature.main_work_id,
    mainHeadline: feature.main_headline || "本日のセール特集",
    mainReason: feature.main_reason || "お得な作品をお見逃しなく！",
    // サブ作品
    sub1WorkId: feature.sub1_work_id,
    sub1OneLiner: feature.sub1_one_liner,
    sub2WorkId: feature.sub2_work_id,
    sub2OneLiner: feature.sub2_one_liner,
    // リスト
    cheapestWorkIds: parseIds(feature.cheapest_work_ids),
    highDiscountWorkIds: parseIds(feature.high_discount_work_ids),
    highRatingWorkIds: parseIds(feature.high_rating_work_ids),
    // 統計
    totalSaleCount: feature.total_sale_count,
    maxDiscountRate: feature.max_discount_rate,
    updatedAt: feature.updated_at,
    // 後方互換（バナー用）
    featuredWorkId: feature.main_work_id,
    featuredThumbnailUrl: null,
  };
}

/**
 * セール特集データを取得（キャッシュ付き）
 */
async function getRawSaleFeatures(): Promise<SaleFeature[]> {
  if (saleFeaturesCache === null) {
    saleFeaturesCache = loadJson<SaleFeature>("sale_features.json");
    console.log(`Loaded ${saleFeaturesCache.length} sale features from cache`);
  }
  return saleFeaturesCache;
}

/**
 * 最新のセール特集を取得
 */
export async function getLatestSaleFeature(): Promise<SaleFeatureView | null> {
  const rawFeatures = await getRawSaleFeatures();
  if (rawFeatures.length === 0) return null;

  // 日付降順でソートして最新を取得
  const sorted = [...rawFeatures].sort(
    (a, b) => b.target_date.localeCompare(a.target_date)
  );
  return convertToSaleFeatureView(sorted[0]);
}

/**
 * セール特集一覧を取得
 */
export async function getSaleFeatures(): Promise<SaleFeatureView[]> {
  const rawFeatures = await getRawSaleFeatures();
  return rawFeatures
    .sort((a, b) => b.target_date.localeCompare(a.target_date))
    .map(convertToSaleFeatureView);
}

// =====================================================
// 日次おすすめ関連
// =====================================================

// 日次おすすめの型定義（DBテーブルと対応）
export interface DailyRecommendation {
  id: number;
  target_date: string;
  headline: string | null;
  description: string | null;
  recommended_works: DailyRecommendedWork[] | string | null;
  total_works_count: number;
  created_at: string;
  updated_at: string;
}

export interface DailyRecommendedWork {
  work_id: number;
  reason: string;
  target_audience: string;
  thumbnail_url?: string;
}

// フロント用の日次おすすめ型
export interface DailyRecommendationView {
  id: number;
  targetDate: string;
  headline: string;
  description: string;
  recommendedWorks: DailyRecommendedWork[];
  totalWorksCount: number;
  updatedAt: string;
}

/**
 * DailyRecommendationをフロント用に変換
 */
function convertToDailyRecommendationView(rec: DailyRecommendation): DailyRecommendationView {
  let recommendedWorks: DailyRecommendedWork[] = [];
  if (rec.recommended_works) {
    if (typeof rec.recommended_works === "string") {
      try {
        recommendedWorks = JSON.parse(rec.recommended_works);
      } catch {
        recommendedWorks = [];
      }
    } else if (Array.isArray(rec.recommended_works)) {
      recommendedWorks = rec.recommended_works;
    }
  }

  return {
    id: rec.id,
    targetDate: rec.target_date,
    headline: rec.headline || "今日のおすすめ",
    description: rec.description || "本日のおすすめ作品をお届け！",
    recommendedWorks,
    totalWorksCount: rec.total_works_count,
    updatedAt: rec.updated_at,
  };
}

/**
 * 日次おすすめデータを取得（キャッシュ付き）
 */
async function getRawDailyRecommendations(): Promise<DailyRecommendation[]> {
  if (dailyRecommendationsCache === null) {
    dailyRecommendationsCache = loadJson<DailyRecommendation>("daily_recommendations.json");
    console.log(`Loaded ${dailyRecommendationsCache.length} daily recommendations from cache`);
  }
  return dailyRecommendationsCache;
}

/**
 * 最新の日次おすすめを取得
 */
export async function getLatestDailyRecommendation(): Promise<DailyRecommendationView | null> {
  const rawRecs = await getRawDailyRecommendations();
  if (rawRecs.length === 0) return null;

  // 日付降順でソートして最新を取得
  const sorted = [...rawRecs].sort(
    (a, b) => b.target_date.localeCompare(a.target_date)
  );
  return convertToDailyRecommendationView(sorted[0]);
}

/**
 * 日次おすすめ一覧を取得
 */
export async function getDailyRecommendations(): Promise<DailyRecommendationView[]> {
  const rawRecs = await getRawDailyRecommendations();
  return rawRecs
    .sort((a, b) => b.target_date.localeCompare(a.target_date))
    .map(convertToDailyRecommendationView);
}

// =====================================================
// ジャンル特集関連
// =====================================================

// ジャンル特集の型定義（DBテーブルと対応）
export interface FeatureRecommendation {
  id: number;
  slug: string;
  name: string;
  headline: string | null;
  description: string | null;
  recommended_works: FeatureRecommendedWork[] | string | null;
  solo_recommended_works: FeatureRecommendedWork[] | string | null;
  multi_recommended_works: FeatureRecommendedWork[] | string | null;
  thumbnail_url: string | null;
  work_count: number;
  created_at: string;
  updated_at: string;
}

export interface FeatureRecommendedWork {
  work_id: number;
  reason: string;
  target_audience: string;
  thumbnail_url?: string;
}

// フロント用のジャンル特集型
export interface FeatureRecommendationView {
  id: number;
  slug: string;
  name: string;
  headline: string;
  description: string;
  recommendedWorks: FeatureRecommendedWork[];
  soloRecommendedWorks: FeatureRecommendedWork[];
  multiRecommendedWorks: FeatureRecommendedWork[];
  thumbnailUrl: string | null;
  workCount: number;
  updatedAt: string;
}

/**
 * JSONフィールドをパースするヘルパー
 */
function parseFeatureRecommendedWorks(field: FeatureRecommendedWork[] | string | null): FeatureRecommendedWork[] {
  if (!field) return [];
  if (typeof field === "string") {
    try {
      return JSON.parse(field);
    } catch {
      return [];
    }
  }
  if (Array.isArray(field)) {
    return field;
  }
  return [];
}

/**
 * FeatureRecommendationをフロント用に変換
 */
function convertToFeatureRecommendationView(feature: FeatureRecommendation): FeatureRecommendationView {
  const recommendedWorks = parseFeatureRecommendedWorks(feature.recommended_works);
  const soloRecommendedWorks = parseFeatureRecommendedWorks(feature.solo_recommended_works);
  const multiRecommendedWorks = parseFeatureRecommendedWorks(feature.multi_recommended_works);

  return {
    id: feature.id,
    slug: feature.slug,
    name: feature.name,
    headline: feature.headline || `${feature.name}の特集`,
    description: feature.description || `${feature.name}好きに贈る作品特集`,
    recommendedWorks,
    soloRecommendedWorks,
    multiRecommendedWorks,
    thumbnailUrl: feature.thumbnail_url,
    workCount: feature.work_count,
    updatedAt: feature.updated_at,
  };
}

/**
 * ジャンル特集データを取得（キャッシュ付き）
 */
async function getRawFeatureRecommendations(): Promise<FeatureRecommendation[]> {
  if (featureRecommendationsCache === null) {
    featureRecommendationsCache = loadJson<FeatureRecommendation>("feature_recommendations.json");
    console.log(`Loaded ${featureRecommendationsCache.length} feature recommendations from cache`);
  }
  return featureRecommendationsCache;
}

/**
 * ジャンル特集一覧を取得
 */
export async function getFeatureRecommendations(): Promise<FeatureRecommendationView[]> {
  const rawFeatures = await getRawFeatureRecommendations();
  return rawFeatures.map(convertToFeatureRecommendationView);
}

/**
 * ジャンル特集をslugで取得
 */
export async function getFeatureRecommendationBySlug(slug: string): Promise<FeatureRecommendationView | null> {
  const rawFeatures = await getRawFeatureRecommendations();
  const feature = rawFeatures.find((f) => f.slug === slug);
  return feature ? convertToFeatureRecommendationView(feature) : null;
}

/**
 * 全てのジャンル特集slugを取得（静的生成用）
 */
export async function getAllFeatureSlugs(): Promise<string[]> {
  const rawFeatures = await getRawFeatureRecommendations();
  return rawFeatures.map((f) => f.slug);
}

/**
 * 数値のwork_idからfanza_product_idを引いて作品を取得
 */
export async function getWorkByNumericId(numericId: number): Promise<Work | undefined> {
  const rawWorks = await getRawWorks();
  const vr = rawWorks.find((w) => w.id === numericId);
  return vr ? convertToWork(vr) : undefined;
}

/**
 * 数値IDリストから作品を取得
 */
export async function getWorksByNumericIds(numericIds: number[]): Promise<Work[]> {
  const rawWorks = await getRawWorks();
  const idSet = new Set(numericIds);
  return rawWorks
    .filter((w) => idSet.has(w.id))
    .map(convertToWork);
}
