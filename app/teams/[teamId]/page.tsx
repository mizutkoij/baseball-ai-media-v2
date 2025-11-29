// app/teams/[teamId]/page.tsx
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTeamPlayers } from '@/lib/playerData';
import { TEAMS } from '@/lib/mockData';
import { BiUser } from 'react-icons/bi';

interface PageProps {
  params: Promise<{ teamId: string }>;
}

export default async function TeamPlayerListPage({ params }: PageProps) {
  const { teamId } = await params;
  
  // チーム略称がmockDataのID(DB, Tなど)と一致するか確認
  // URLが /teams/DB なら teamId='DB'
  const team = TEAMS[teamId];
  if (!team) {
    // URLが /teams/DeNA のようにフォルダ名で来る可能性も考慮するならここで変換処理が必要
    // 今回はモックデータのID(DB等)を正とする
    return notFound();
  }

  // 選手リスト取得
  const players = await getTeamPlayers(teamId);

  // ポジション別にグループ化
  const groupedPlayers = {
    pitcher: players.filter(p => p.position === '投手' || p.position.includes('投')),
    catcher: players.filter(p => p.position === '捕手'),
    infielder: players.filter(p => p.position === '内野手' || p.position.includes('内')),
    outfielder: players.filter(p => p.position === '外野手' || p.position.includes('外')),
    other: players.filter(p => !['投手', '捕手', '内野手', '外野手'].includes(p.position) && !p.position.includes('投') && !p.position.includes('内') && !p.position.includes('外')),
  };

  const Section = ({ title, list }: { title: string, list: typeof players }) => {
    if (list.length === 0) return null;
    return (
      <section className="mb-8">
        <h3 className="text-sm font-bold text-gray-600 border-b border-gray-300 pb-2 mb-4">{title}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {list.map((player) => (
            <Link 
              key={player.id} 
              href={`/players/${player.id}`}
              className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-sm hover:shadow-md hover:border-blue-400 transition-all group"
            >
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                <BiUser />
              </div>
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="font-mono font-bold text-lg text-gray-400 w-6 text-right">{player.number}</span>
                  <span className="font-bold text-gray-800 text-base group-hover:text-blue-700 group-hover:underline">
                    {player.name}
                  </span>
                </div>
                <div className="text-xs text-gray-500 pl-8">{player.position}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    );
  };

  return (
    <main className="min-h-screen bg-[#f3f4f6] pb-12">
      {/* チームヘッダー */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto max-w-6xl px-4 py-8">
          <div className="flex items-center gap-4">
            <div 
              className="w-16 h-16 rounded-lg flex items-center justify-center text-white text-2xl font-bold shadow-sm"
              style={{ backgroundColor: team.color }}
            >
              {team.shortName.charAt(0)}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{team.name}</h1>
              <p className="text-sm text-gray-500">2025年度 選手一覧 ({players.length}名)</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 pt-8">
        <Section title="投手" list={groupedPlayers.pitcher} />
        <Section title="捕手" list={groupedPlayers.catcher} />
        <Section title="内野手" list={groupedPlayers.infielder} />
        <Section title="外野手" list={groupedPlayers.outfielder} />
        <Section title="その他" list={groupedPlayers.other} />

        {players.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            選手データが見つかりませんでした。<br/>
            <span className="text-xs">※データのフォルダ構成を確認してください。</span>
          </div>
        )}
      </div>
    </main>
  );
}