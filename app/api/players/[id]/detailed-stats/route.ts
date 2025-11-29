import { NextRequest, NextResponse } from 'next/server';

const VPS_API_URL = process.env.VPS_API_URL || 'http://133.18.115.175:3001';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 動的パラメータから playerId を取得（URL デコードもしておく）
    const playerId = decodeURIComponent(params.id);

    // クエリパラメータを取得
    const searchParams = request.nextUrl.searchParams;
    const team = searchParams.get('team') ?? undefined;
    const name = searchParams.get('name') ?? undefined;

    // VPS API 向けクエリ文字列を組み立て
    const vpsQuery = new URLSearchParams();
    if (team) vpsQuery.set('team', team);
    if (name) vpsQuery.set('name', name);

    const vpsUrl =
      `${VPS_API_URL}/api/players/${playerId}/detailed-stats` +
      (vpsQuery.toString() ? `?${vpsQuery.toString()}` : '');

    const response = await fetch(vpsUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 300 }, // 5分キャッシュ
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Player not found' },
          { status: 404 },
        );
      }

      const text = await response.text().catch(() => '');
      throw new Error(
        `VPS API error: ${response.status} ${response.statusText} ${text}`,
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching player stats from VPS:', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch player detailed stats',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
