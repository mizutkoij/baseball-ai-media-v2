// components/stats/StatTable.tsx

import { StatLeader } from '@/lib/types';
import Link from 'next/link';

type Props = {
  /** テーブルに表示する成績データ */
  data: StatLeader[];
  /** 統計項目のタイトル (例: 打率, 防御率) */
  statTitle: string;
};

// 選手IDが存在すれば、選手名をクリックして個人ページに飛べるようにする
const getPlayerLink = (player: StatLeader) => {
    // 例: 選手名にIDを持たせるか、別途マッピングが必要だが、ここでは仮に # を返す
    // if (player.playerId) return `/players/${player.playerId}`;
    return '#'; 
};


export function StatTable({ data, statTitle }: Props) {
  const isBatting = statTitle === '打率' || statTitle === '本塁打'; // 打者か投手かで列を分ける（簡易判定）

  // テーブルヘッダーの定義
  const headers = [
    { key: 'rank', label: '順', className: 'w-10 text-center' },
    { key: 'player', label: '選手名', className: 'w-48 text-left' },
    { key: 'team', label: 'チーム', className: 'w-20 text-center hidden sm:table-cell' },
    { key: 'value', label: statTitle, className: 'w-20 text-center font-bold' },
    // 項目に合わせて列を拡張可能
    { key: 'games', label: '試合', className: 'w-12 text-center hidden md:table-cell' },
    { key: 'atBats', label: isBatting ? '打席' : '投球回', className: 'w-16 text-center hidden lg:table-cell' },
  ];

  // ダミーの追加成績（StatLeader型にないため、モックとして付与）
  const mockExtraData = [
    { games: 60, atBats: 240 },
    { games: 58, atBats: 235 },
    { games: 60, atBats: 220 },
    { games: 55, atBats: 200 },
    { games: 59, atBats: 195 },
    { games: 57, atBats: 180 },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <table className="min-w-full text-sm text-left">
        <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200 sticky top-0">
          <tr>
            {headers.map((header) => (
              <th 
                key={header.key} 
                className={`px-3 py-3 font-medium ${header.className}`}
              >
                {header.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((item, index) => (
            <tr key={item.rank} className="hover:bg-blue-50/50 transition-colors">
              {/* 順位 */}
              <td className="px-3 py-3 font-mono text-gray-600 text-center">
                <span className={item.rank === 1 ? 'text-xl font-extrabold text-yellow-600' : 'text-sm'}>
                    {item.rank}
                </span>
              </td>
              
              {/* 選手名（リンク） */}
              <td className="px-3 py-3 font-bold text-gray-800">
                <Link href={getPlayerLink(item)} className="hover:text-blue-700 hover:underline transition-colors">
                    {item.player}
                </Link>
              </td>

              {/* チーム */}
              <td className="px-3 py-3 text-center text-gray-600 hidden sm:table-cell">
                {item.team}
              </td>
              
              {/* 成績値（強調） */}
              <td className="px-3 py-3 text-center font-extrabold text-lg text-blue-700 font-mono">
                {item.value}
              </td>

              {/* 試合数（ダミーデータ） */}
              <td className="px-3 py-3 text-center font-mono text-gray-600 hidden md:table-cell">
                {mockExtraData[index % mockExtraData.length].games}
              </td>

              {/* 打席/投球回（ダミーデータ） */}
              <td className="px-3 py-3 text-center font-mono text-gray-600 hidden lg:table-cell">
                {mockExtraData[index % mockExtraData.length].atBats}
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}