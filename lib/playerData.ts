import fs from 'fs/promises';
import path from 'path';
import { CompletePlayerData, NF3AllStatsData, PlayerProfile } from '@/lib/types';

const DATA_DIR = path.join(process.cwd(), 'data/players/detailed');

// 略称 -> フォルダ名
const TEAM_SHORT_TO_DIR: Record<string, string> = {
  'DB': 'DeNA', 'G': '巨人', 'T': '阪神', 'C': '広島', 'D': '中日', 'S': 'ヤクルト',
  'H': 'ソフトバンク', 'F': '日本ハム', 'M': 'ロッテ', 'E': '楽天', 'L': '西武', 'Bs': 'オリックス'
};

// 選手リスト表示用の型
export type PlayerSummary = {
  id: string;      // リンク用ID (例: DB_2025_2)
  name: string;    // 表示名
  number: string;  // 背番号
  position: string;// 守備位置
  faceImage?: string;
};

// 選手ID (例: "DB_2025_2") から詳細データを取得
export async function getPlayerData(simpleId: string): Promise<{ playerData: CompletePlayerData | null, rawData: NF3AllStatsData | null }> {
  const parts = simpleId.split('_');
  
  let teamShort, number;
  
  if (parts.length === 3 && parts[1].length === 4 && !isNaN(Number(parts[1]))) {
    // 新形式: DB_2025_69
    [teamShort, , number] = parts;
  } else {
    // 旧形式フォールバック
    teamShort = Object.keys(TEAM_SHORT_TO_DIR).find(k => TEAM_SHORT_TO_DIR[k] === parts[0]) || parts[0]; 
    number = parts[1];
  }

  const teamDirName = TEAM_SHORT_TO_DIR[teamShort] || teamShort;
  const targetDir = path.join(DATA_DIR, teamDirName);
  
  try {
    try {
        await fs.access(targetDir);
    } catch {
        return { playerData: null, rawData: null };
    }

    const entries = await fs.readdir(targetDir, { withFileTypes: true });
    
    // フォルダ検索: 背番号で始まるフォルダを探す
    const playerDirs = entries.filter(e => e.isDirectory() && e.name.startsWith(`${number}_`));
    
    if (playerDirs.length === 0) {
        return { playerData: null, rawData: null };
    }

    let batterDir = playerDirs.find(d => !d.name.startsWith(`${number}_${number}_`));
    let pitcherDir = playerDirs.find(d => d.name.startsWith(`${number}_${number}_`));

    const rawData: NF3AllStatsData = { batterStats: {}, pitcherStats: {} };

    if (batterDir) {
        const bData = await loadDataFromDir(path.join(targetDir, batterDir.name));
        rawData.batterStats = bData;
        if (bData.basic_info) rawData.basic_info = bData.basic_info;
    }

    if (pitcherDir) {
        const pData = await loadDataFromDir(path.join(targetDir, pitcherDir.name));
        rawData.pitcherStats = pData;
        if (!rawData.basic_info && pData.basic_info) rawData.basic_info = pData.basic_info;
    }
    
    if (Object.keys(rawData.batterStats || {}).length === 0 && Object.keys(rawData.pitcherStats || {}).length === 0) {
        return { playerData: null, rawData: null };
    }

    const playerData = mapRawDataToComplete(rawData, simpleId, teamDirName, number);
    
    return { playerData, rawData };

  } catch (error) {
    console.error(`Failed to load player data: ${error}`);
    return { playerData: null, rawData: null };
  }
}

// チームごとの全選手を取得する関数
export async function getTeamPlayers(teamShort: string): Promise<PlayerSummary[]> {
  const teamDirName = TEAM_SHORT_TO_DIR[teamShort];
  if (!teamDirName) return [];

  const targetDir = path.join(DATA_DIR, teamDirName);
  const playersMap = new Map<string, PlayerSummary>();

  try {
    try { await fs.access(targetDir); } catch { return []; }

    const entries = await fs.readdir(targetDir, { withFileTypes: true });
    const playerDirs = entries.filter(e => e.isDirectory());

    for (const dir of playerDirs) {
       const parts = dir.name.split('_');
       const number = parts[0];
       
       if (playersMap.has(number)) continue;

       try {
         const basicInfoPath = path.join(targetDir, dir.name, 'basic_info.json');
         const content = await fs.readFile(basicInfoPath, 'utf-8');
         const json = JSON.parse(content);
         const info = Array.isArray(json) ? json[0] : json;
         
         let position = '野手';
         if (parts.length >= 3 && parts[0] === parts[1]) {
             position = '投手';
         } else if (info['守備位置']) {
             position = info['守備位置'];
         } else if ((info['投打'] || '').includes('投')) {
             position = '投手';
         }

         playersMap.set(number, {
           id: `${teamShort}_2025_${number}`,
           name: info['名前'] || parts[parts.length - 1],
           number: number,
           position: position
         });

       } catch (e) {
         playersMap.set(number, {
            id: `${teamShort}_2025_${number}`,
            name: parts[parts.length - 1],
            number: number,
            position: parts.length >= 3 ? '投手' : '野手'
         });
       }
    }
    
    return Array.from(playersMap.values()).sort((a, b) => Number(a.number) - Number(b.number));

  } catch (e) {
    console.error(e);
    return [];
  }
}

// ヘルパー関数
async function loadDataFromDir(dirPath: string) {
    const files = await fs.readdir(dirPath);
    const jsonFiles = files.filter(f => f.endsWith('.json') && !f.endsWith('.bak'));
    
    let data: any = {};
    for (const file of jsonFiles) {
        try {
            const content = await fs.readFile(path.join(dirPath, file), 'utf-8');
            data[path.basename(file, '.json')] = JSON.parse(content);
        } catch (e) {
            console.warn(`Failed to parse ${file}`);
        }
    }
    return data;
}

function mapRawDataToComplete(raw: NF3AllStatsData, playerId: string, team: string, number: string): CompletePlayerData {
    const basicInfoSource = raw.basic_info || 
                            (raw.batterStats?.basic_info) || 
                            (raw.pitcherStats?.basic_info) || {};
                            
    const info = Array.isArray(basicInfoSource) ? basicInfoSource[0] : basicInfoSource;
    const isPitcher = !!raw.pitcherStats && Object.keys(raw.pitcherStats).length > 0;

    const profile: PlayerProfile = {
        player_id: playerId,
        name_kanji: info['名前'] || 'Unknown',
        name_kana: info['フリガナ'] || '',
        name_romaji: '',
        birth_date: info['生年月日'] || '',
        age: 0,
        birthplace_prefecture: info['出身地'] || '',
        height: parseInt(info['身長'] || '0'),
        weight: parseInt(info['体重'] || '0'),
        throws: (info['腕'] || info['投打'] || '').includes('左') ? 'L' : 'R',
        bats: (info['席'] || info['投打'] || '').includes('左') ? 'L' : (info['席'] || '').includes('両') ? 'S' : 'R',
        primary_position: isPitcher ? 'P' : 'Fielder',
        current_team: team,
        current_number: number,
        status: 'active',
        // SNS情報のマッピング (データがあれば)
        social: {
            twitter: info['Twitter'] || info['X'] || undefined,
            instagram: info['Instagram'] || undefined,
            youtube: info['YouTube'] || undefined,
        }
    };

    return {
        profile,
        career: { player_id: playerId, debut_year: 0, team_history: [], number_history: [] },
        season_stats: { 
            batting: raw.batterStats?.['通算成績'] || [], 
            pitching: raw.pitcherStats?.['通算成績'] || [] 
        },
        meta: { last_updated: new Date().toISOString(), version: '1.0.0', data_sources: [], data_quality: { completeness: 1, reliability: 'high' } }
    } as CompletePlayerData;
}