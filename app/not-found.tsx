import { Home } from "lucide-react";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto flex max-w-5xl flex-col items-center justify-center px-4 py-20">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-primary">404</h1>
          <p className="mt-4 text-xl text-muted-foreground">
            ページが見つかりませんでした
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            お探しのページは削除されたか、URLが間違っている可能性があります。
          </p>

          <Link
            href="/"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Home className="h-4 w-4" />
            トップページへ戻る
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
