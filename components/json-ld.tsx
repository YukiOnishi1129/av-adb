import { Work } from "@/lib/data-loader";

interface WebsiteJsonLdProps {
  url: string;
  name: string;
  description: string;
}

export function WebsiteJsonLd({ url, name, description }: WebsiteJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name,
    description,
    url,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

interface ProductJsonLdProps {
  work: Work;
}

// ビルド時の日時を ISO 8601 形式で取得（schema.org の dateModified に使用）
// 価格・セール情報を毎日更新しているサイトであることを Google に伝える
function getBuildDateIso(): string {
  return new Date().toISOString();
}

export function ProductJsonLd({ work }: ProductJsonLdProps) {
  const buildDate = getBuildDateIso();
  const isOnSale = work.listPrice > 0 && work.price < work.listPrice;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: work.title,
    description: work.aiSummary || work.description || work.title,
    image: work.thumbnailUrl,
    url: `https://av-adb.com/works/${work.id}/`,
    brand: {
      "@type": "Brand",
      name: work.maker,
    },
    // 最終更新日（ビルド毎に自動更新）。「アクティブに更新中のサイト」と Google に伝える
    dateModified: buildDate,
    ...(work.price && {
      offers: {
        "@type": "Offer",
        price: work.price,
        priceCurrency: "JPY",
        availability: "https://schema.org/InStock",
        url: work.fanzaUrl,
        // セール終了日が設定されていれば priceValidUntil として伝える
        ...(isOnSale && work.saleEndDate && { priceValidUntil: work.saleEndDate }),
      },
    }),
    ...(work.rating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: work.rating,
        reviewCount: work.reviewCount || 1,
        bestRating: 5,
        worstRating: 1,
      },
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function ReviewJsonLd({ work }: ProductJsonLdProps) {
  const reviewBody = work.aiReview || work.aiAppealPoints || work.aiSummary;
  if (!reviewBody) return null;

  const buildDate = getBuildDateIso();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Review",
    itemReviewed: {
      "@type": "Product",
      name: work.title,
      image: work.thumbnailUrl,
      url: `https://av-adb.com/works/${work.id}/`,
    },
    author: {
      "@type": "Organization",
      name: "AV-ADB編集部",
    },
    reviewBody,
    // レビューの公開日 / 最終更新日（毎日のビルドで更新される）
    datePublished: buildDate,
    dateModified: buildDate,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

interface BreadcrumbJsonLdProps {
  items: { name: string; url: string }[];
}

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

interface ArticleJsonLdProps {
  title: string;
  description: string;
  url: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
}

export function ArticleJsonLd({
  title,
  description,
  url,
  image,
  datePublished,
  dateModified,
}: ArticleJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url,
    ...(image && { image }),
    ...(datePublished && { datePublished }),
    ...(dateModified && { dateModified }),
    publisher: {
      "@type": "Organization",
      name: "AV-ADB",
      url: "https://av-adb.com",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
