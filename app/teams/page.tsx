// app/teams/page.tsx
import Link from 'next/link';
import { TEAMS } from '@/lib/mockData'; // チーム定義 (色情報など) を再利用

export default function TeamListPage() {
  // セ・パのチームIDリスト
  const centralTeams = ['T', 'G', 'DB', 'C', 'S', 'D'];
  const pacificTeams = ['H', 'F', 'M', 'E', 'L', 'Bs'];

  const TeamCard = ({ id }: { id: string }) => {
    const team = TEAMS[id];
    if (!team) return null;

    return (
      <Link href={`/teams/${team.id}`} className="group block">
        <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow text-center h-full flex flex-col items-center justify-center">
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold mb-4 shadow-sm group-hover:scale-110 transition-transform"
            style={{ backgroundColor: team.color }}
          >
            {team.shortName.charAt(0)}
          </div>
          <h3 className="font-bold text-lg text-gray-800 group-hover:text-blue-600 transition-colors">
            {team.name}
          </h3>
          <p className="text-xs text-gray-500 mt-1">選手一覧を見る &rarr;</p>
        </div>
      </Link>
    );
  };

  return (
    <main className="min-h-screen bg-[#f3f4f6] pb-12">
      <div className="container mx-auto max-w-5xl px-4 pt-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8 border-l-4 border-blue-600 pl-4">プロ野球 チーム一覧</h1>
        
        <section className="mb-10">
          <h2 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
            <span className="w-2 h-6 bg-green-600 rounded-sm"></span>
            セントラル・リーグ
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {centralTeams.map(id => <TeamCard key={id} id={id} />)}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
            <span className="w-2 h-6 bg-blue-600 rounded-sm"></span>
            パシフィック・リーグ
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {pacificTeams.map(id => <TeamCard key={id} id={id} />)}
          </div>
        </section>
      </div>
    </main>
  );
}