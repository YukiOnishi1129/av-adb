/**
 * sitemap.xml 生成スクリプト
 * prebuildで取得したデータからsitemap.xmlを生成
 */

import { writeFileSync, readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CACHE_DIR = join(__dirname, "../.cache/data");
const PUBLIC_DIR = join(__dirname, "../public");
const BASE_URL = "https://av-adb.com";

function loadJson(filename) {
  const path = join(CACHE_DIR, filename);
  if (!existsSync(path)) {
    console.warn(`Warning: ${filename} not found, using empty array`);
    return [];
  }
  return JSON.parse(readFileSync(path, "utf-8"));
}

function formatDate(dateStr) {
  if (!dateStr) return new Date().toISOString().split("T")[0];
  try {
    return new Date(dateStr).toISOString().split("T")[0];
  } catch {
    return new Date().toISOString().split("T")[0];
  }
}

function escapeXml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function generateSitemap() {
  console.log("=== AV-ADB: Generating sitemap.xml ===");

  const today = new Date().toISOString().split("T")[0];

  // 静的ページ
  const staticPages = [
    { url: "/", priority: "1.0", changefreq: "daily" },
    { url: "/ranking/", priority: "0.9", changefreq: "daily" },
    { url: "/sale/", priority: "0.9", changefreq: "daily" },
    { url: "/sale/tokushu/", priority: "0.8", changefreq: "daily" },
    { url: "/actresses/", priority: "0.8", changefreq: "weekly" },
    { url: "/genres/", priority: "0.7", changefreq: "weekly" },
    { url: "/tokushu/", priority: "0.8", changefreq: "daily" },
    { url: "/tokushu/actress/", priority: "0.7", changefreq: "weekly" },
    { url: "/recommendations/", priority: "0.8", changefreq: "daily" },
    { url: "/search/", priority: "0.5", changefreq: "monthly" },
    { url: "/privacy/", priority: "0.3", changefreq: "yearly" },
  ];

  // 作品データ
  const works = loadJson("works.json");
  // 女優特集データ
  const actressFeatures = loadJson("actress_features.json");
  // 特集データ
  const featureRecommendations = loadJson("feature_recommendations.json");

  // 女優一覧（女優マスタから取得）
  const allActressesData = loadJson("actresses.json");
  const allActresses = allActressesData.map(a => a.name).filter(Boolean);

  // ジャンル一覧（作品から抽出）
  const genreSet = new Set();
  for (const work of works) {
    const genres = work.genres || [];
    for (const genre of genres) {
      if (genre) genreSet.add(genre);
    }
  }
  const genres = Array.from(genreSet);

  // XML生成
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

  // 静的ページ
  for (const page of staticPages) {
    xml += `  <url>
    <loc>${BASE_URL}${page.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
  }

  // 作品ページ
  for (const work of works) {
    const lastmod = formatDate(work.release_date || work.updated_at);
    xml += `  <url>
    <loc>${BASE_URL}/works/${work.id}/</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
`;
  }

  // 女優特集ページ
  for (const actress of actressFeatures) {
    const encodedName = encodeURIComponent(actress.name);
    xml += `  <url>
    <loc>${BASE_URL}/tokushu/actress/${encodedName}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>
`;
  }

  // 女優一覧ページ（worksから抽出した全女優）
  for (const actressName of allActresses) {
    const encodedName = encodeURIComponent(actressName);
    xml += `  <url>
    <loc>${BASE_URL}/actresses/${encodedName}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>
`;
  }

  // ジャンルページ
  for (const genre of genres) {
    const encodedGenre = encodeURIComponent(genre);
    xml += `  <url>
    <loc>${BASE_URL}/genres/${encodedGenre}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>
`;
  }

  // 特集ページ
  for (const feature of featureRecommendations) {
    const slug = escapeXml(feature.slug);
    xml += `  <url>
    <loc>${BASE_URL}/tokushu/${slug}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>
`;
  }

  xml += `</urlset>
`;

  // 出力
  const outputPath = join(PUBLIC_DIR, "sitemap.xml");
  writeFileSync(outputPath, xml, "utf-8");

  const totalUrls =
    staticPages.length +
    works.length +
    actressFeatures.length +
    allActresses.length +
    genres.length +
    featureRecommendations.length;

  console.log(`✓ Generated sitemap.xml with ${totalUrls} URLs`);
}

generateSitemap();
