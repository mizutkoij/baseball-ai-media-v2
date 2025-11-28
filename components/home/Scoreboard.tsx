import { Game } from '@/lib/types';

export function Scoreboard({ games }: { games: Game[] }) {
  if (!games.length) return null;

  return (
    <div className="w-full bg-white border-b border-gray-200 overflow-x-auto">
      <div className="container mx-auto px-4 py-3">
        <div className="flex space-x-4 min-w-max">
          {games.map((game) => (
            <div key={game.id} className="flex flex-col justify-center min-w-[140px] px-3 py-2 border border-gray-200 rounded-sm bg-gray-50/50">
              <div className="text-[10px] text-gray-500 mb-1 flex justify-between">
                <span>{game.status === 'live' ? <span className="text-red-600 font-bold animate-pulse">LIVE</span> : game.status === 'final' ? '試合終了' : '予告先発'}</span>
                <span>{game.status === 'scheduled' ? game.startTime : game.inning || '終了'}</span>
              </div>

              {/* ビジター */}
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-sm text-gray-800">{game.visitorTeam.name}</span>
                </div>
                <span className="font-mono font-bold text-base">
                  {game.status === 'scheduled' ? '-' : game.visitorScore}
                </span>
              </div>

              {/* ホーム */}
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-sm text-gray-800">{game.homeTeam.name}</span>
                </div>
                <span className="font-mono font-bold text-base">
                  {game.status === 'scheduled' ? '-' : game.homeScore}
                </span>
              </div>

              <div className="text-[10px] text-gray-400 mt-1 text-right truncate">
                {game.stadium}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
