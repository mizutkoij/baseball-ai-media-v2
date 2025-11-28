import { StatLeader } from '@/lib/types';

type Props = {
  central: StatLeader[];
  pacific: StatLeader[];
};

export function QuickLeaders({ central, pacific }: Props) {
  
  const renderList = (items: StatLeader[], leagueName: string, headerColor: string) => (
    <div className="flex-1 min-w-[300px]">
      <div className={`px-3 py-2 border-b border-gray-200 ${headerColor} text-white rounded-t-sm`}>
        <h3 className="font-bold text-sm">打率ランキング ({leagueName})</h3>
      </div>
      <div className="bg-white border-x border-b border-gray-200">
        <ul className="divide-y divide-gray-100 text-sm">
          {items.map((player) => (
            <li key={player.rank} className="flex justify-between items-center px-3 py-2.5 hover:bg-gray-50">
              <div className="flex items-center space-x-3 overflow-hidden">
                <span className={`font-mono font-bold w-4 text-center shrink-0 ${player.rank === 1 ? 'text-yellow-600' : 'text-gray-400'}`}>
                  {player.rank}
                </span>
                <div className="truncate">
                  <div className="font-bold text-gray-800 truncate">{player.player}</div>
                  <div className="text-[10px] text-gray-500">{player.team}</div>
                </div>
              </div>
              <span className="font-mono font-bold text-lg text-blue-700 ml-2">{player.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-bold text-gray-800 text-lg border-l-4 border-blue-700 pl-3">個人成績</h2>
        <a href="/stats" className="text-xs text-blue-600 hover:underline">詳細 »</a>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        {renderList(central, 'セ', 'bg-green-700')}
        {renderList(pacific, 'パ', 'bg-blue-600')}
      </div>
    </div>
  );
}
