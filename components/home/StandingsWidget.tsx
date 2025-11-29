import { StandingItem } from '@/lib/types';

type Props = {
  central: StandingItem[];
  pacific: StandingItem[];
};

export function StandingsWidget({ central, pacific }: Props) {
  const renderTable = (items: StandingItem[], leagueName: string, headerColor: string) => (
    <div className="flex-1 min-w-[300px]">
      <div className={`px-3 py-2 border-b border-gray-200 ${headerColor} text-white rounded-t-sm`}>
        <h3 className="font-bold text-sm">{leagueName}</h3>
      </div>
      <div className="bg-white border-x border-b border-gray-200">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-500 bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-2 py-2 font-medium w-8 text-center">順</th>
              <th className="px-2 py-2 font-medium">チーム</th>
              <th className="px-2 py-2 font-medium text-center">差</th>
              <th className="px-2 py-2 font-medium text-center">率</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
  {items.map((item) => (
    <tr
      key={`${item.rank}-${item.name}`}
      className="hover:bg-gray-50 transition-colors"
    >
      <td className="px-2 py-2 font-mono text-gray-600 text-center">
        {item.rank}
      </td>
      <td className="px-2 py-2 font-bold text-gray-800 flex items-center gap-2">
        <span
          className="w-2 h-2 rounded-full shrink-0"
          style={{ backgroundColor: item.color }}
        />
        <span className="truncate">{item.name}</span>
      </td>
      <td className="px-2 py-2 text-center font-mono text-gray-600">
        {item.gamesBack}
      </td>
      <td className="px-2 py-2 text-center font-mono text-gray-600">
        {item.pct}
      </td>
    </tr>
  ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-bold text-gray-800 text-lg border-l-4 border-blue-700 pl-3">順位表</h2>
        <a href="/standings" className="text-xs text-blue-600 hover:underline">
          詳細 »
        </a>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        {renderTable(central, 'セ・リーグ', 'bg-green-700')}
        {renderTable(pacific, 'パ・リーグ', 'bg-blue-600')}
      </div>
    </div>
  );
}
