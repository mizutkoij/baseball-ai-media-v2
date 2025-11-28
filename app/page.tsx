import Link from "next/link";
import { Trophy, BarChart3, Calendar } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-6">
            ⚾ Baseball AI Media
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
            NPBデータ分析プラットフォーム v2
          </p>
          <p className="text-sm text-slate-400">
            Vercel完結型・クリーンアーキテクチャ
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Link
            href="/players"
            className="bg-black/20 backdrop-blur-md border border-white/10 rounded-lg p-6 hover:bg-black/30 transition-all"
          >
            <div className="flex items-center gap-3 mb-4">
              <Trophy className="w-6 h-6 text-blue-500" />
              <h3 className="text-lg font-semibold text-white">選手データ</h3>
            </div>
            <p className="text-slate-400 text-sm">
              選手成績・統計情報
            </p>
          </Link>

          <Link
            href="/games"
            className="bg-black/20 backdrop-blur-md border border-white/10 rounded-lg p-6 hover:bg-black/30 transition-all"
          >
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-6 h-6 text-purple-500" />
              <h3 className="text-lg font-semibold text-white">試合情報</h3>
            </div>
            <p className="text-slate-400 text-sm">
              試合結果・スケジュール
            </p>
          </Link>

          <Link
            href="/stats"
            className="bg-black/20 backdrop-blur-md border border-white/10 rounded-lg p-6 hover:bg-black/30 transition-all"
          >
            <div className="flex items-center gap-3 mb-4">
              <BarChart3 className="w-6 h-6 text-green-500" />
              <h3 className="text-lg font-semibold text-white">統計分析</h3>
            </div>
            <p className="text-slate-400 text-sm">
              高度な分析指標
            </p>
          </Link>
        </div>

        {/* Status */}
        <div className="text-center text-slate-400 text-sm mt-16">
          <p>🚀 Next.js 15 + Vercel Postgres + Prisma</p>
          <p className="mt-2">シンプル・高速・スケーラブル</p>
        </div>
      </div>
    </div>
  );
}
