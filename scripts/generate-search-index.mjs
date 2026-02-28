/**
 * 検索インデックスJSON生成スクリプト
 * ビルド前に実行して public/data/search-index.json を生成する
 *
 * R2のParquetファイルからデータを取得
 */

import { writeFileSync, mkdirSync, readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { readParquet } from "parquet-wasm";
import { tableFromIPC } from "apache-arrow";

// .env.local を手動で読み込む
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, "../.env.local");
if (existsSync(envPath)) {
  const envContent = readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const [key, ...valueParts] = trimmed.split("=");
      const value = valueParts.join("=").replace(/^["']|["']$/g, "");
      if (key && value && !process.env[key]) {
        process.env[key] = value;
      }
    }
  }
}

// R2の公開ドメイン（環境変数から取得、必須）
const R2_PUBLIC_DOMAIN = process.env.R2_PUBLIC_DOMAIN || "";
if (!R2_PUBLIC_DOMAIN) {
  console.error("ERROR: R2_PUBLIC_DOMAIN environment variable is required");
  process.exit(1);
}

const OUTPUT_PATH = join(__dirname, "../public/data/search-index.json");

/**
 * ParquetファイルをR2からダウンロードしてパースする
 */
async function fetchParquet(filename) {
  const url = `${R2_PUBLIC_DOMAIN}/parquet/${filename}`;
  console.log(`Fetching: ${url}`);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }

  const buffer = await response.arrayBuffer();

  // parquet-wasmでParquetを読み込み、IPC形式に変換
  const wasmTable = readParquet(new Uint8Array(buffer));
  const ipcBuffer = wasmTable.intoIPCStream();

  // apache-arrowでIPCを読み込み
  const arrowTable = tableFromIPC(ipcBuffer);

  const rows = [];

  for (let i = 0; i < arrowTable.numRows; i++) {
    const row = {};
    for (const field of arrowTable.schema.fields) {
      const column = arrowTable.getChild(field.name);
      if (column) {
        let value = column.get(i);
        if (typeof value === "bigint") {
          value = Number(value);
        }
        if (
          typeof value === "string" &&
          (value.startsWith("[") || value.startsWith("{"))
        ) {
          try {
            value = JSON.parse(value);
          } catch {
            // パース失敗時はそのまま
          }
        }
        row[field.name] = value;
      }
    }
    rows.push(row);
  }

  return rows;
}

/**
 * AvWork → SearchItem 変換
 */
function convertToSearchItem(work) {
  const price = work.sale_price || work.price || 0;
  const listPrice = work.price || 0;

  // 割引率
  let discountRate = work.discount_rate || null;
  if (!discountRate && listPrice > 0 && price < listPrice) {
    discountRate = Math.round(((listPrice - price) / listPrice) * 100);
  }

  // actress_namesをパース（配列かJSON文字列）
  let actresses = [];
  if (work.actress_names) {
    if (Array.isArray(work.actress_names)) {
      actresses = work.actress_names;
    }
  }

  // genresをパース
  let genres = [];
  if (work.genres) {
    if (Array.isArray(work.genres)) {
      genres = work.genres;
    }
  }

  // セール中かどうか
  const isOnSale = discountRate !== null && discountRate > 0;

  // 女優数（単体/共演判定用）
  const actressCount = work.actress_count || actresses.length || 1;

  return {
    id: work.fanza_product_id,
    t: work.title, // タイトル
    ac: actresses, // 女優リスト
    g: genres, // ジャンルリスト
    mk: work.maker_name || "", // メーカー名
    p: price, // 現在価格
    lp: listPrice, // 定価
    dr: discountRate, // 割引率
    img: work.thumbnail_url || "", // サムネイルURL
    rt: work.rating || null, // 評価
    rc: work.review_count || null, // レビュー件数
    rel: work.release_date || "", // 配信日
    dur: work.duration_minutes || null, // 再生時間
    rk: work.ranking_position || null, // ランキング順位
    sale: isOnSale, // セール中
    acnt: actressCount, // 女優数
  };
}

async function main() {
  console.log("=== AV-ADB: Generating Search Index ===");

  let works = [];
  try {
    // 作品データを取得
    works = await fetchParquet("works.parquet");
    console.log(`Found ${works.length} works`);
  } catch (error) {
    console.warn(`⚠ Failed to fetch parquet: ${error.message}`);
    console.log("Creating empty search index...");
  }

  // 検索インデックスに変換
  const searchIndex = works.map(convertToSearchItem);

  // ディレクトリ作成
  mkdirSync(dirname(OUTPUT_PATH), { recursive: true });

  // JSON出力
  writeFileSync(OUTPUT_PATH, JSON.stringify(searchIndex), "utf-8");

  console.log(`✓ Generated ${searchIndex.length} items → ${OUTPUT_PATH}`);
}

main().catch(console.error);
