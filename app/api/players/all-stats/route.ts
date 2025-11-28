import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const playerName = searchParams.get('name');
    const team = searchParams.get('team');
    const number = searchParams.get('number');

    if (!playerName || !team || !number) {
      return NextResponse.json(
        { error: 'name, team, and number parameters are required' },
        { status: 400 }
      );
    }

    // パスの構築
    const baseDir = path.join(process.cwd(), 'public', 'data', 'players', 'detailed', team);
    const pitcherDir = path.join(baseDir, `${number}_${number}_${playerName}`);
    const batterDir = path.join(baseDir, `${number}_${playerName}`);

    const result: {
      playerName: string;
      team: string;
      number: string;
      pitcherStats: Record<string, any> | null;
      batterStats: Record<string, any> | null;
    } = {
      playerName,
      team,
      number,
      pitcherStats: null,
      batterStats: null,
    };

    // 投手成績の取得
    if (fs.existsSync(pitcherDir)) {
      const pitcherStats: Record<string, any> = {};
      const pitcherFiles = fs.readdirSync(pitcherDir).filter(f => f.endsWith('.json'));

      for (const file of pitcherFiles) {
        const filePath = path.join(pitcherDir, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const key = file.replace('.json', '');
        pitcherStats[key] = JSON.parse(content);
      }

      result.pitcherStats = pitcherStats;
    }

    // 打者成績の取得
    if (fs.existsSync(batterDir)) {
      const batterStats: Record<string, any> = {};
      const batterFiles = fs.readdirSync(batterDir).filter(f => f.endsWith('.json'));

      for (const file of batterFiles) {
        const filePath = path.join(batterDir, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const key = file.replace('.json', '');
        batterStats[key] = JSON.parse(content);
      }

      result.batterStats = batterStats;
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching player all stats:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch player stats',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
