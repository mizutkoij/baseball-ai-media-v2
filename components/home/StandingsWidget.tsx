import { StandingItem } from '@/lib/types';

export function StandingsWidget({ items }: { items: StandingItem[] }) {
  return (
    <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
      <div className="bg-gray-100 px-3 py-2 border-b border-gray-200 flex justify-between items-center">
        <h3 className="font-bold text-sm text-gray-700">順位表 (セ)</h3>
        <span className="text-[10px] text-gray-500">6/15更新</span>
      </div>
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-gray-500 bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-3 py-2 font-medium w-10">順</th>
            <th className="px-2 py-2 font-medium">チーム</th>
            <th className="px-2 py-2 font-medium text-center">差</th>
            <th className="px-2 py-2 font-medium text-center">率</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {items.map((item) => (
            <tr key={item.team.id} className="hover:bg-gray-50">
              <td className="px-3 py-2 font-mono text-gray-600">{item.rank}</td>
              <td className="px-2 py-2 font-bold text-gray-800">{item.team.name}</td>
              <td className="px-2 py-2 text-center font-mono text-gray-600">{item.gamesBack}</td>
              <td className="px-2 py-2 text-center font-mono text-gray-600">{item.pct}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="p-2 text-right bg-gray-50 border-t border-gray-200">
        <a href="#" className="text-xs text-blue-600 hover:underline">詳細を見る »</a>
      </div>
    </div>
  );
}
