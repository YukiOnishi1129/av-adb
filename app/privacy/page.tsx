import type { Metadata } from "next";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

export const metadata: Metadata = {
  alternates: { canonical: "/privacy/" },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-3xl px-4 py-6 pb-24 lg:pb-6">
        {/* パンくず */}
        <nav className="mb-6 flex items-center gap-1 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            トップ
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">プライバシーポリシー</span>
        </nav>

        <h1 className="text-2xl font-bold">プライバシーポリシー</h1>

        <div className="mt-6 space-y-6 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="mb-2 text-lg font-semibold text-foreground">
              1. 個人情報の取り扱いについて
            </h2>
            <p>
              AV-ADB（以下「当サイト」）は、ユーザーの個人情報について、その重要性を認識し、適切に保護することを社会的責務と考え、個人情報に関する法律を遵守し、当サイトで取り扱う個人情報の取得、利用、管理を適正に行います。
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-foreground">
              2. 収集する情報
            </h2>
            <p>当サイトでは、以下の情報を収集する場合があります。</p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>
                アクセスログ（IPアドレス、ブラウザの種類、アクセス日時など）
              </li>
              <li>Cookie情報</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-foreground">
              3. 情報の利用目的
            </h2>
            <p>収集した情報は、以下の目的で利用します。</p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>サイトの運営・改善</li>
              <li>ユーザーサポート</li>
              <li>アクセス解析</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-foreground">
              4. Cookieについて
            </h2>
            <p>
              当サイトでは、ユーザーエクスペリエンスの向上やアクセス解析のためにCookieを使用しています。
              ブラウザの設定によりCookieを無効にすることも可能ですが、その場合、一部の機能が正常に動作しない場合があります。
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-foreground">
              5. アフィリエイトプログラムについて
            </h2>
            <p>
              当サイトは、FANZA（DMM）のアフィリエイトプログラムに参加しています。
              商品リンクをクリックして購入された場合、当サイトに報酬が支払われます。
              なお、アフィリエイトリンクのご利用により、お客様に追加の負担が発生することはありません。
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-foreground">
              6. 第三者への情報提供
            </h2>
            <p>
              当サイトは、法令に基づく場合を除き、ユーザーの同意なく個人情報を第三者に提供することはありません。
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-foreground">
              7. プライバシーポリシーの変更
            </h2>
            <p>
              本ポリシーは、法令の変更やサービス内容の変更に伴い、予告なく変更されることがあります。
              変更後のプライバシーポリシーは、当サイトに掲載した時点で効力を生じるものとします。
            </p>
          </section>

          <p className="mt-8 text-xs">最終更新日: 2025年1月</p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
