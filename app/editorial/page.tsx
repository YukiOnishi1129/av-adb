import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { LastUpdated } from "@/components/last-updated";

export const metadata: Metadata = {
  title: "編集方針・運営ポリシー | AV-ADB",
  description:
    "AV-ADB編集部の運営方針、レビュー基準、AI活用方針、責任の所在を明示します。読者の皆さまに安心して情報をご利用いただくための編集ポリシー。",
  alternates: { canonical: "/editorial/" },
};

export default function EditorialPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-3xl px-4 py-8">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <nav className="flex items-center gap-1 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">トップ</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">編集方針・運営ポリシー</span>
          </nav>
          <LastUpdated variant="card" />
        </div>

        <h1 className="mb-2 text-2xl font-bold text-foreground">
          編集方針・運営ポリシー
        </h1>
        <p className="mb-8 text-sm text-muted-foreground">AV-ADB 編集部</p>

        <div className="space-y-8 text-foreground">
          <section>
            <h2 className="mb-3 text-lg font-bold">1. サイトの目的</h2>
            <p className="text-muted-foreground">
              AV-ADB（読み: エーブイ・エーディービー）は、FANZAで配信されているアダルト動画作品を、独自の視点で整理・紹介する作品データベースサイトです。「迷ったらここから選べばハズレなし」を基本コンセプトに、ユーザーが膨大な作品の中から自分に合う1作品を見つけられるよう支援することを目的としています。
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold">2. 運営者</h2>
            <p className="text-muted-foreground">
              本サイトは「AV-ADB編集部」が運営する個人運営の作品レビュー・データベースサイトです。掲載するすべての記事の編集・公開判断はAV-ADB編集部が責任を持って行っています。
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold">3. 情報源・データソース</h2>
            <p className="mb-2 text-muted-foreground">
              当サイトに掲載する作品情報は、以下の一次情報を元にしています。
            </p>
            <ul className="list-inside list-disc space-y-1 text-muted-foreground">
              <li>FANZA Webサービス（公式API）</li>
              <li>FANZAで公開されている作品ページ</li>
              <li>FANZA上の公開レビュー</li>
            </ul>
            <p className="mt-2 text-muted-foreground">
              情報の鮮度を保つため、価格・セール・評価・新着情報は1日に複数回自動取得し、サイト全体を毎日更新しています。各ページの最終更新日はページ上部に明示しています。
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold">4. AIの活用方針</h2>
            <p className="mb-2 text-muted-foreground">
              AV-ADBでは、作品の魅力をわかりやすく伝えるために、AI（大規模言語モデル）を活用したコンテンツ生成を行っています。
            </p>
            <ul className="list-inside list-disc space-y-1 text-muted-foreground">
              <li>
                AIで生成するのは：作品の要約、おすすめポイント、ターゲット層、注意点、レビューの要約など
              </li>
              <li>
                AIで生成しないのは：作品の価格・評価・女優名・ジャンルなどの事実情報（これらはFANZAから直接取得します）
              </li>
              <li>
                AI生成コンテンツについても、最終的な公開判断と表現の責任はAV-ADB編集部が負います
              </li>
            </ul>
            <p className="mt-2 text-muted-foreground">
              AIによる要約は、あくまで作品を選ぶ際の参考情報です。実際の購入判断はFANZAの作品ページに掲載された公式情報・公式サンプル・ユーザーレビューを必ず併せてご確認ください。
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold">5. レビューと評価の方針</h2>
            <ul className="list-inside list-disc space-y-1 text-muted-foreground">
              <li>
                評価点（★）は、FANZAの実購入者によるレビュー平均点をそのまま掲載しています。当サイト編集部が独自に評価点を捏造することはありません
              </li>
              <li>
                おすすめ作品の選定基準は、評価点・販売実績・編集部の主観的な作品クオリティ判断・サイトコンセプトとの親和性などを総合的に考慮しています
              </li>
              <li>
                セール情報・割引率はFANZAから直接取得した数値で、編集部が手動で書き換えることはありません
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold">6. アフィリエイトについて</h2>
            <p className="text-muted-foreground">
              当サイトは、FANZAアフィリエイトプログラム（FANZA Webサービス）に参加しています。サイト内のリンクから商品が購入された場合、当サイトは紹介料を受け取ることがあります。ただし、アフィリエイト報酬の有無や金額が、作品の選定・評価・記述内容に影響することはありません。
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold">7. 訂正・お問い合わせ</h2>
            <p className="text-muted-foreground">
              掲載内容に明らかな誤りがあった場合、または、ご自身の出演作品について掲載を見直したい権利者の方は、サイト運営者までご連絡ください。事実関係を確認のうえ、適切に対応いたします。
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold">8. 対象年齢</h2>
            <p className="text-muted-foreground">
              当サイトは成人向けのアダルト動画作品を扱っているため、18歳未満の方の閲覧はお断りしています。
            </p>
          </section>
        </div>

        <p className="mt-12 text-sm text-muted-foreground">
          制定日: 2026年5月17日
        </p>
      </main>

      <Footer />
    </div>
  );
}
