import { NextRequest, NextResponse } from 'next/server';

const VPS_API_URL = process.env.VPS_API_URL || 'http://133.18.115.175:3001';

export async function GET(request: NextRequest) {
  try {
    // VPS APIにリクエストを転送
    const response = await fetch(`${VPS_API_URL}/api/players`, {
      headers: {
        'Content-Type': 'application/json',
      },
      // キャッシュ設定（必要に応じて調整）
      next: { revalidate: 300 }, // 5分間キャッシュ
    });

    if (!response.ok) {
      throw new Error(`VPS API error: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching from VPS:', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch players data',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
