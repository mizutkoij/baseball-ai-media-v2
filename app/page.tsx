import { Scoreboard } from '@/components/home/Scoreboard';
import { StandingsWidget } from '@/components/home/StandingsWidget';
import { NewsFeed } from '@/components/home/NewsFeed';
import { QuickLeaders } from '@/components/home/QuickLeaders';
import { 
  TODAYS_GAMES, 
  STANDINGS, 
  LEADERS, 
  ARTICLES 
} from '@/lib/mockData';

export default function HomePage() {
  return (
    <main className="pb-10">
      
      {/* 1. スコアボード (最上部) */}
      <Scoreboard games={TODAYS_GAMES} />

      <div className="container mx-auto max-w-6xl mt-6 px-4">
        
        {/* 上段: メインニュースとサイドバー広告 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10">
          
          {/* 左側: ヒーロー記事 & ニュース */}
          <div className="lg:col-span-8 space-y-8">
            <section className="bg-white border border-gray-200 rounded-sm overflow-hidden shadow-sm">
              <div className="aspect-video w-full bg-slate-800 relative flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <span className="block text-4xl mb-2">⚾️</span>
                  <span className="font-bold text-lg text-slate-500">Main Feature Visual</span>
                </div>
              </div>
              <div className="p-5">
                <h2 className="text-2xl font-bold text-gray-900 mb-3 hover:text-blue-800 cursor-pointer">
                  2025年プロ野球、AI分析が予測する「後半戦のキーマン」とは？
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed">
                  データスタジアムの数値を基に、セイバーメトリクス指標「wRC+」が急上昇している選手をピックアップ...
                </p>
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-3 pl-2 border-l-4 border-blue-700">
                <h2 className="text-lg font-bold text-gray-800">最新記事</h2>
                <a href="/news" className="text-xs text-blue-600 font-bold hover:underline">一覧へ »</a>
              </div>
              <NewsFeed articles={ARTICLES} />
            </section>
          </div>

          {/* 右側: 広告や小さなトピック */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-gray-200 h-64 flex flex-col items-center justify-center text-gray-400 text-xs border border-gray-300 rounded-sm">
              <span>Advertisement</span>
            </div>
            <div className="bg-white p-4 border border-gray-200 rounded-sm">
              <h3 className="font-bold text-sm mb-2">注目タグ</h3>
              <div className="flex flex-wrap gap-2">
                {['#佐藤輝明', '#大谷翔平', '#完全試合', '#ドラフト'].map(tag => (
                  <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full cursor-pointer hover:bg-gray-200">{tag}</span>
                ))}
              </div>
            </div>
          </aside>
        </div>

        {/* 下段: データエリア (ここをワイドに見せる) 
          「Left Ce, Right Pa」を実現するために幅広のエリアを使います
        */}
        <div className="grid grid-cols-1 gap-8">
          
          {/* 順位表セクション */}
          <section>
            <StandingsWidget 
              central={STANDINGS.central} 
              pacific={STANDINGS.pacific} 
            />
          </section>

          {/* 個人成績セクション */}
          <section>
            <QuickLeaders 
              central={LEADERS.central.batting}
              pacific={LEADERS.pacific.batting}
            />
          </section>

        </div>

      </div>
    </main>
  );
}
