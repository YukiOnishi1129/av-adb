import type { Metadata } from "next";
import { ChevronRight, User } from "lucide-react";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { WorkCard } from "@/components/work-card";
import { ShowMoreGrid } from "@/components/show-more-grid";
import { getActresses, getWorksByActress } from "@/lib/data-loader";

interface Props {
  params: Promise<{ name: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { name: rawName } = await params;
  const name = decodeURIComponent(rawName);
  const works = await getWorksByActress(name);

  if (works.length === 0) {
    return {
      title: "出演者が見つかりません | AV-ADB",
    };
  }

  const title = `${name}のAV作品一覧 レビュー・感想（${works.length}作品） | AV-ADB`;
  const description = `${name}が出演するアダルトAV動画${works.length}作品のレビュー・感想を掲載。人気作品やセール情報もチェック！`;

  return {
    title,
    description,
    alternates: { canonical: `/actresses/${rawName}/` },
    openGraph: {
      title,
      description,
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export async function generateStaticParams() {
  const actresses = await getActresses();
  return actresses.map((a) => ({
    name: a.name,
  }));
}

export default async function ActressDetailPage({ params }: Props) {
  const { name: rawName } = await params;
  const name = decodeURIComponent(rawName);
  const works = await getWorksByActress(name);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-5xl px-4 py-6 pb-24 lg:pb-6">
        {/* パンくず */}
        <nav className="mb-4 flex items-center gap-1 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            トップ
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/actresses" className="hover:text-foreground">
            出演者
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">{name}</span>
        </nav>

        {/* ヘッダー */}
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-muted">
            <User className="h-10 w-10 text-muted-foreground/50" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{name}</h1>
            <p className="text-sm text-muted-foreground">{works.length}作品</p>
          </div>
        </div>

        {/* 作品一覧 */}
        {works.length > 0 ? (
          <ShowMoreGrid columns={3}>
            {works.map((work) => (
              <WorkCard key={work.id} work={work} />
            ))}
          </ShowMoreGrid>
        ) : (
          <p className="text-muted-foreground">
            この出演者の作品はまだ登録されていません。
          </p>
        )}
      </main>

      <Footer />
    </div>
  );
}
