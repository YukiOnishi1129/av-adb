export function SisterSiteBanner() {
  return (
    <section className="mt-10 mb-4">
      <a
        href="https://vr-adb.com"
        target="_blank"
        rel="noopener noreferrer"
        className="block overflow-hidden rounded-lg border border-border hover:border-primary/50 transition-all"
      >
        <div className="relative aspect-[1200/630] w-full">
          <img
            src="https://vr-adb.com/ogp/top_ogp.png"
            alt="VR-ADB｜アダルトVR動画レビュー・おすすめ作品紹介"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="bg-card p-3 text-center">
          <p className="text-sm font-bold text-foreground">
            姉妹サイト「VR-ADB」もチェック！
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            VR動画のおすすめランキング・セール情報を毎日更新中
          </p>
        </div>
      </a>
    </section>
  );
}
