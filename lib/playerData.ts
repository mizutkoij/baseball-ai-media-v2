import fs from 'fs/promises';
import path from 'path';
import { CompletePlayerData, NF3AllStatsData, PlayerProfile } from '@/lib/types';

const DATA_DIR = path.join(process.cwd(), 'data/players/detailed');

// 略称 -> フォルダ名
const TEAM_SHORT_TO_DIR: Record<string, string> = {
  'DB': 'DeNA', 'G': '巨人', 'T': '阪神', 'C': '広島', 'D': '中日', 'S': 'ヤクルト',
  'H': 'ソフトバンク', 'F': '日本ハム', 'M': 'ロッテ', 'E': '楽天', 'L': '西武', 'Bs': 'オリックス'
};

export async function getPlayerData(simpleId: string): Promise<{ playerData: CompletePlayerData | null, rawData: NF3AllStatsData | null }> {
  // ID解析
  const parts = simpleId.split('_');
  
  // 従来のID形式 (DeNA_69_ケイ) にも対応できるようにするフォールバック
  let teamShort, number, name;
  
  if (parts.length === 3 && parts[1].length === 4 && !isNaN(Number(parts[1]))) {
    // 新形式: DB_2025_69
    [teamShort, , number] = parts;
  } else {
    // 旧形式またはその他: DeNA_69_ケイ -> これも許容する
    // ※チーム名が漢字の場合は略称変換が必要だが、一旦既存ロジックで救えるか試みる
    // 簡易的に parts[0] をチーム名キーとしてトライ
    teamShort = Object.keys(TEAM_SHORT_TO_DIR).find(k => TEAM_SHORT_TO_DIR[k] === parts[0]) || parts[0]; 
    number = parts[1];
  }

  const teamDirName = TEAM_SHORT_TO_DIR[teamShort] || teamShort; // マップになければそのまま使う
  const targetDir = path.join(DATA_DIR, teamDirName);
  
  console.log(`[Debug] Loading data for: ${teamShort} #${number} (Path: ${targetDir})`);

  try {
    // ディレクトリ存在確認
    try {
        await fs.access(targetDir);
    } catch {
        console.error(`[Debug] Team directory not found: ${targetDir}`);
        return { playerData: null, rawData: null };
    }

    const entries = await fs.readdir(targetDir, { withFileTypes: true });
    
    // フォルダ検索ロジック（少し緩くする）
    // "69_" で始まるフォルダを探す
    const playerDirs = entries.filter(e => e.isDirectory() && e.name.startsWith(`${number}_`));
    
    if (playerDirs.length === 0) {
        console.error(`[Debug] Player directory not found for number: ${number}`);
        return { playerData: null, rawData: null };
    }

    console.log(`[Debug] Found player directories:`, playerDirs.map(d => d.name));

    let batterDir = playerDirs.find(d => !d.name.startsWith(`${number}_${number}_`)); // "69_ケイ"
    let pitcherDir = playerDirs.find(d => d.name.startsWith(`${number}_${number}_`)); // "69_69_ケイ"

    const rawData: NF3AllStatsData = { batterStats: {}, pitcherStats: {} };

    // 野手データ読み込み
    if (batterDir) {
        const bData = await loadDataFromDir(path.join(targetDir, batterDir.name));
        rawData.batterStats = bData;
        if (bData.basic_info) rawData.basic_info = bData.basic_info;
    }

    // 投手データ読み込み
    if (pitcherDir) {
        const pData = await loadDataFromDir(path.join(targetDir, pitcherDir.name));
        rawData.pitcherStats = pData;
        // 基本情報を優先的に確保
        if (!rawData.basic_info && pData.basic_info) rawData.basic_info = pData.basic_info;
    }
    
    // どちらのデータも空だった場合
    if (Object.keys(rawData.batterStats || {}).length === 0 && Object.keys(rawData.pitcherStats || {}).length === 0) {
        console.error(`[Debug] No JSON data loaded.`);
        return { playerData: null, rawData: null };
    }

    // 変換
    const playerData = mapRawDataToComplete(rawData, simpleId, teamDirName, number);
    
    return { playerData, rawData };

  } catch (error) {
    console.error(`[Debug] Failed to load player data: ${error}`);
    return { playerData: null, rawData: null };
  }
}

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
        status: 'active'
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

// lib/playerData.ts
// ... (既存の imports と定数はそのまま) ...

// 追加: 選手リスト表示用の型
export type PlayerSummary = {
  id: string;      // リンク用ID (例: DB_2025_2)
  name: string;    // 表示名
  number: string;  // 背番号
  position: string;// 守備位置 (投手/捕手/内野手/外野手)
  faceImage?: string;
};

// 追加: チームごとの全選手を取得する関数
export async function getTeamPlayers(teamShort: string): Promise<PlayerSummary[]> {
  const teamDirName = TEAM_SHORT_TO_DIR[teamShort];
  if (!teamDirName) return [];

  const targetDir = path.join(DATA_DIR, teamDirName);
  const playersMap = new Map<string, PlayerSummary>();

  try {
    // ディレクトリチェック
    try { await fs.access(targetDir); } catch { return []; }

    const entries = await fs.readdir(targetDir, { withFileTypes: true });
    const playerDirs = entries.filter(e => e.isDirectory());

    for (const dir of playerDirs) {
       // フォルダ名から背番号と名前を簡易的に抽出 (例: "2_牧秀悟", "11_11_東克樹")
       // "11_11_東" のように数字が2回続くのは投手フォルダの傾向があるが、
       // 基本的には背番号でユニークにする
       const parts = dir.name.split('_');
       const number = parts[0];
       
       // 既に登録済みの背番号ならスキップ (投手/野手フォルダの重複対策)
       // ※本来はマージすべきですが、リスト表示用ならどちらか一方で十分
       if (playersMap.has(number)) continue;

       try {
         // basic_info.json を読み込んで正確な名前とポジションを取得
         const basicInfoPath = path.join(targetDir, dir.name, 'basic_info.json');
         const content = await fs.readFile(basicInfoPath, 'utf-8');
         const json = JSON.parse(content);
         const info = Array.isArray(json) ? json[0] : json;
         
         // ポジション判定
         let position = '野手';
         if (parts.length >= 3 && parts[0] === parts[1]) {
             position = '投手'; // "11_11_東" のパターン
         } else if (info['守備位置']) {
             position = info['守備位置'];
         } else if ((info['投打'] || '').includes('投')) {
             // 簡易判定
             position = '投手';
         }

         playersMap.set(number, {
           id: `${teamShort}_2025_${number}`, // リンク先ID (DB_2025_2)
           name: info['名前'] || parts[parts.length - 1],
           number: number,
           position: position
         });

       } catch (e) {
         // basic_infoがない、または読み込めない場合はフォルダ名から最低限の情報を生成
         playersMap.set(number, {
            id: `${teamShort}_2025_${number}`,
            name: parts[parts.length - 1],
            number: number,
            position: parts.length >= 3 ? '投手' : '野手'
         });
       }
    }
    
    // 背番号順にソートして配列化
    return Array.from(playersMap.values()).sort((a, b) => Number(a.number) - Number(b.number));

  } catch (e) {
    console.error(e);
    return [];
  }
}