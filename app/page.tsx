// app/page.tsx
import { Scoreboard } from '@/components/home/Scoreboard';
import { StandingsWidget } from '@/components/home/StandingsWidget';
import { NewsFeed } from '@/components/home/NewsFeed';
import { QuickLeaders } from '@/components/home/QuickLeaders';
import { FeaturedArticle } from '@/components/home/FeaturedArticle';

import { 
  TODAYS_GAMES, 
  STANDINGS, 
  LEADERS, 
  ARTICLES 
} from '@/lib/mockData';

export default function HomePage() {
  return (
    <main className="pb-10">
      
      <Scoreboard games={TODAYS_GAMES} />

      <div className="container mx-auto max-w-6xl mt-6 px-4">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10">
          
          <div className="lg:col-span-8 space-y-8">
            
            <FeaturedArticle />
            
            <section>
              <div className="flex items-center justify-between mb-3 pl-2 border-l-4 border-blue-700">
                <h2 className="text-lg font-bold text-gray-800">最新記事</h2>
                <a href="/news" className="text-xs text-blue-600 font-bold hover:underline">一覧へ »</a>
              </div>
              <NewsFeed articles={ARTICLES} />
            </section>
          </div>

          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-gray-200 h-64 flex flex-col items-center justify-center text-gray-400 text-xs border border-gray-300 rounded-sm">
              <span>Advertisement</span>
              <span className="text-[10px] mt-1">300x250</span>
            </div>
            
            <div className="bg-white p-4 border border-gray-200 rounded-sm">
              <h3 className="font-bold text-sm mb-2 text-gray-700">注目タグ</h3>
              <div className="flex flex-wrap gap-2">
                {['#佐藤輝明', '#佐々木朗希', '#セイバーメトリクス', '#ドラフト'].map(tag => (
                  <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full cursor-pointer hover:bg-gray-200 transition-colors">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </aside>
        </div>

        <div className="grid grid-cols-1 gap-10">
          <section>
            <StandingsWidget 
              central={STANDINGS.central} 
              pacific={STANDINGS.pacific} 
            />
          </section>

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