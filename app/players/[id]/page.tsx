import { notFound } from 'next/navigation';
import PlayerDetailClient from './PlayerDetailClient';
import { mapNF3ToCompletePlayerData } from '@/lib/mappers/nf3PlayerMapper';

interface PageProps {
  params: { id: string };
}

export default async function PlayerDetailPage({ params }: PageProps) {
  const playerId = decodeURIComponent(params.id);
  const parts = playerId.split('_');

  if (parts.length < 3) {
    notFound();
  }

  const team = parts[0];
  const number = parts[1];
  const name = parts.slice(2).join('_');

  // Server-side data fetching
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/players/all-stats?name=${encodeURIComponent(name)}&team=${encodeURIComponent(team)}&number=${encodeURIComponent(number)}`,
    { cache: 'no-store' }
  );

  if (!res.ok) {
    notFound();
  }

  const rawData = await res.json();
  const playerData = mapNF3ToCompletePlayerData(rawData);

  return <PlayerDetailClient playerData={playerData} rawData={rawData} />;
}
