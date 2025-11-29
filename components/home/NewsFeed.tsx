import { Article } from '@/lib/types';

export function NewsFeed({ articles }: { articles: Article[] }) {
  return (
    <div className="space-y-4">
      {articles.map((article) => (
        <article key={article.id} className="flex flex-col sm:flex-row gap-4 p-4 bg-white border border-gray-200 rounded-sm hover:shadow-sm transition-shadow">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2 py-0.5 text-[10px] font-bold text-white rounded-sm ${article.category === 'コラム' ? 'bg-blue-600' : 'bg-gray-600'}`}>
                {article.category}
              </span>
              <time className="text-xs text-gray-400 font-mono">{article.publishedAt}</time>
            </div>
            <h3 className="text-lg font-bold text-gray-900 leading-snug mb-2 hover:text-blue-700 cursor-pointer">
              {article.title}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
              {article.summary}
            </p>
          </div>
        </article>
      ))}
    </div>
  );
}