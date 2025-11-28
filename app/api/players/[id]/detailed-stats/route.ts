import { NextRequest, NextResponse } from 'next/server';

const VPS_API_URL = process.env.VPS_API_URL || 'http://133.18.115.175:3001';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: playerId } = await params;

    // Get query parameters from the request
    const searchParams = request.nextUrl.searchParams;
    const team = searchParams.get('team');
    const name = searchParams.get('name');

    // Build query string for VPS API
    const queryString = new URLSearchParams({
      ...(team && { team }),
      ...(name && { name }),
    }).toString();

    // VPS APIにリクエストを転送
    const response = await fetch(
      `${VPS_API_URL}/api/players/${playerId}/detailed-stats${queryString ? `?${queryString}` : ''}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        next: { revalidate: 300 }, // 5分間キャッシュ
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Player not found' },
          { status: 404 }
        );
      }
      throw new Error(`VPS API error: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching player stats from VPS:', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch player detailed stats',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
