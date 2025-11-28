// app/page.tsx
import { Scoreboard } from '@/components/home/Scoreboard';
import { StandingsWidget } from '@/components/home/StandingsWidget';
import { NewsFeed } from '@/components/home/NewsFeed';
import {
  TODAYS_GAMES,
  STANDINGS_CENTRAL,
  LEADERS,
  ARTICLES
} from '@/lib/mockData';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f3f4f6]">

      {/* 1. スコアボード (Game Status) */}
      <Scoreboard games={TODAYS_GAMES} />

      <div className="container mx-auto max-w-6xl mt-6 px-4 pb-12 grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* === 左カラム: メインコンテンツ (幅広) === */}
        <div className="lg:col-span-8 space-y-8">

          {/* 最新ニュースリスト */}
          <section>
            <div className="flex items-center justify-between mb-3 border-l-4 border-blue-700 pl-3">
              <h2 className="text-lg font-bold text-gray-800">最新記事</h2>
              <a href="#" className="text-xs text-blue-600 font-bold hover:underline">記事一覧へ »</a>
            </div>
            <NewsFeed articles={ARTICLES} />
          </section>
        </div>

        {/* === 右カラム: データサイドバー (幅狭) === */}
        <aside className="lg:col-span-4 space-y-6">

          {/* 順位表 */}
          <StandingsWidget items={STANDINGS_CENTRAL} />

          {/* 個人成績リーダーズ (簡易版) */}
          <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
            <div className="bg-gray-100 px-3 py-2 border-b border-gray-200">
              <h3 className="font-bold text-sm text-gray-700">打率ランキング (セ)</h3>
            </div>
            <ul className="divide-y divide-gray-100 text-sm">
              {LEADERS.batting.map((player) => (
                <li key={player.rank} className="flex justify-between items-center px-3 py-2 hover:bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <span className="font-mono font-bold text-gray-400 w-4">{player.rank}</span>
                    <span className="text-gray-800">{player.player}</span>
                    <span className="text-xs text-gray-500">({player.team})</span>
                  </div>
                  <span className="font-mono font-bold text-blue-700">{player.value}</span>
                </li>
              ))}
            </ul>
            <div className="p-2 text-right bg-gray-50 border-t border-gray-200">
              <a href="#" className="text-xs text-blue-600 hover:underline">個人成績一覧 »</a>
            </div>
          </div>

          {/* 広告枠やバナーを想定したエリア */}
          <div className="bg-gray-200 h-64 flex items-center justify-center text-gray-400 text-xs border border-gray-300">
            Ad Space / Pick Up
          </div>

        </aside>

      </div>
    </main>
  );
}
