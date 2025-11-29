// components/layout/Footer.tsx
import Link from 'next/link';

export function Footer() {
  const footerSections = [
    {
      title: "試合・日程",
      links: [
        { label: "日程・結果一覧", href: "/games" },
        { label: "順位表", href: "/standings" },
        { label: "一球速報（デモ）", href: "/games/live" },
      ]
    },
    {
      title: "データ・成績",
      links: [
        { label: "個人成績ランキング", href: "/stats" },
        { label: "チーム一覧", href: "/teams" },
        { label: "選手名鑑", href: "/players" },
        { label: "セイバーメトリクス用語集", href: "/help/metrics" },
      ]
    },
    {
      title: "コンテンツ",
      links: [
        { label: "ニュース・コラム", href: "/news" },
        { label: "AI勝敗予測", href: "/analysis/prediction" },
        { label: "パワーランキング", href: "/analysis/power-ranking" },
      ]
    },
    {
      title: "サイト情報",
      links: [
        { label: "Baseball AI Mediaについて", href: "/about" },
        { label: "利用規約", href: "/terms" },
        { label: "プライバシーポリシー", href: "/privacy" },
      ]
    }
  ];

  return (
    // bg-gray-900 で濃いグレー背景にし、引き締まった印象に
    <footer className="bg-gray-900 text-white pt-12 pb-6 mt-auto border-t border-gray-800">
      <div className="container mx-auto px-4">
        
        {/* 上部：ロゴとサイトマップ */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
          {/* ロゴエリア */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-sm flex items-center justify-center text-white font-bold font-mono text-sm">
                  BA
                </div>
                <span className="text-lg font-bold tracking-tight text-gray-100">
                  Baseball<br/>AI Media
                </span>
              </div>
            </Link>
            <p className="text-xs text-gray-400 leading-relaxed">
              データとAIでプロ野球を深掘りする<br/>次世代メディアプラットフォーム。
            </p>
          </div>

          {/* リンクエリア（4カラム） */}
          {footerSections.map((section) => (
            <div key={section.title} className="col-span-1">
              <h3 className="font-bold text-gray-300 mb-3 text-sm border-b border-gray-700 pb-1 inline-block">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link 
                      href={link.href} 
                      className="text-xs text-gray-400 hover:text-blue-400 hover:underline transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        {/* 下部：コピーライト */}
        <div className="border-t border-gray-800 pt-6 text-center">
          <p className="text-[10px] text-gray-600">
            &copy; 2025 Baseball AI Media. All Data Provided by MockData Inc.
          </p>
        </div>
      </div>
    </footer>
  );
}