import { notFound } from 'next/navigation';
import {PlayerDetailClient} from '@/components/stats/PlayerDetailClient';
import { getPlayerData } from '@/lib/playerData';

// 修正1: 型定義を Promise に変更
interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PlayerDetailPage({ params }: PageProps) {
  // 修正2: params を await して id を取り出す
  const { id } = await params;
  
  const playerId = decodeURIComponent(id);

  // 実データを取得
  const { playerData, rawData } = await getPlayerData(playerId);

  if (!playerData || !rawData) {
    notFound();
  }

  return <PlayerDetailClient playerData={playerData} rawData={rawData} />;
}