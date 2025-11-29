import { StandingItem } from '@/lib/types';
import { TEAM_COLORS } from '@/lib/mockData';

type Props = {
  central: StandingItem[];
  pacific: StandingItem[];
};

export function StandingsWidget({ central, pacific }: Props) {
  
  // チーム名からID(T, G等)を逆引きしてカラーを取得するヘルパー（簡易的）
  // 本来はStandingItemにteamIdを持たせるのがベストですが、現状の型に合わせて名前から解決します
  const getTeamColor = (teamShort: string) => {
    // データとの整合性のため簡易マッピング
    const map: Record<string, string> = {
      '阪神': TEAM_COLORS.T, '巨人': TEAM_COLORS.G, 'DeNA': TEAM_COLORS.DB, 
      '広島': TEAM_COLORS.C, 'ヤクルト': TEAM_COLORS.S, '中日': TEAM_COLORS.D,
      'ソフトバンク': TEAM_COLORS.H, '日本ハム': TEAM_COLORS.F, 'ロッテ': TEAM_COLORS.M, 
      '楽天': TEAM_COLORS.E, '西武': TEAM_COLORS.L, 'オリックス': TEAM_COLORS.Bs
    };
    return map[teamShort] || '#ccc';
  };

  const renderTable = (items: StandingItem[], leagueName: string, headerColor: string) => (
    <div className="flex-1 min-w-[320px]">
      <div className={`px-3 py-2 border-b border-gray-200 ${headerColor} text-white rounded-t-sm`}>
        <h3 className="font-bold text-sm">{leagueName}</h3>
      </div>
      <div className="bg-white border-x border-b border-gray-200">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-500 bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-2 py-2 font-medium w-8 text-center">順</th>
              <th className="px-2 py-2 font-medium">チーム</th>
              <th className="px-2 py-2 font-medium text-center">勝</th>
              <th className="px-2 py-2 font-medium text-center">負</th>
              <th className="px-2 py-2 font-medium text-center">差</th>
              <th className="px-2 py-2 font-medium text-center">率</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map((item) => (
              <tr key={item.teamShort} className="hover:bg-gray-50 transition-colors">
                <td className="px-2 py-2 font-mono text-gray-600 text-center">{item.rank}</td>
                <td className="px-2 py-2 font-bold text-gray-800 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: getTeamColor(item.teamShort) }}></span>
                  <span className="truncate">{item.teamShort}</span>
                </td>
                <td className="px-2 py-2 text-center font-mono text-gray-600">{item.wins}</td>
                <td className="px-2 py-2 text-center font-mono text-gray-600">{item.losses}</td>
                <td className="px-2 py-2 text-center font-mono text-gray-600">{item.gb}</td>
                <td className="px-2 py-2 text-center font-mono text-gray-600">
                  {/* winPctはnumberなので .3f 形式にフォーマット */}
                  {item.winPct.toFixed(3).replace('0.', '.')}
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
        <a href="/standings" className="text-xs text-blue-600 hover:underline">詳細 »</a>
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        {renderTable(central, 'セ・リーグ', 'bg-green-700')}
        {renderTable(pacific, 'パ・リーグ', 'bg-blue-600')}
      </div>
    </div>
  );
}