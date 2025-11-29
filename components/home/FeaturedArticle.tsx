// components/home/FeaturedArticle.tsx

export function FeaturedArticle() {
  return (
    <section className="bg-white border-l-4 border-blue-700 shadow-sm p-5 rounded-sm border-y border-r border-gray-200">
      <div className="flex items-center gap-2 mb-2">
        <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm">AI PICK</span>
        <span className="text-xs text-gray-500">2025.06.15</span>
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-3 leading-snug hover:text-blue-800 cursor-pointer transition-colors">
        AI予測：今年のセ・リーグ優勝確率は阪神が55%でリード！ データから見るキーポイントは？
      </h2>
      
      <p className="text-gray-600 text-sm leading-relaxed mb-4">
        独自AIモデル「BASEBALL FLASH 1.0」の分析結果を公開。勝利貢献度WARに基づき、各チームの後半戦の展望を解説します。
      </p>
      
      <a href="#" className="text-sm font-bold text-blue-600 hover:text-blue-800 hover:underline">
        AI分析記事を読む »
      </a>
    </section>
  );
}