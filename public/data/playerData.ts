// lib/playerData.ts
import fs from 'fs/promises';
import path from 'path';
import { CompletePlayerData, NF3AllStatsData } from '@/lib/types';

const DATA_DIR = path.join(process.cwd(), 'data/players/detailed');

// チーム名とディレクトリ名のマッピング (必要に応じて調整)
const TEAM_DIR_MAP: Record<string, string> = {
  'DeNA': 'DeNA',
  '巨人': '巨人',
  '阪神': '阪神',
  '広島': '広島',
  '中日': '中日', // 仮
  'ヤクルト': 'ヤクルト', // 仮
  // パ・リーグも同様に
};

// 選手ID (例: "DeNA_69_ケイ") から詳細データを取得
export async function getPlayerData(playerId: string): Promise<{ playerData: CompletePlayerData | null, rawData: NF3AllStatsData | null }> {
  // IDのフォーマット: {Team}_{Number}_{Name} を想定
  // 例: DeNA_69_ケイ
  const parts = playerId.split('_');
  if (parts.length < 3) return { playerData: null, rawData: null };

  const teamKey = parts[0];
  const number = parts[1];
  const name = parts[2];
  
  const teamDirName = TEAM_DIR_MAP[teamKey];
  if (!teamDirName) return { playerData: null, rawData: null };

  // フォルダ名を探す (例: "69_ケイ" または "69_69_ケイ")
  // 投手・野手でフォルダが分かれている場合の処理が必要
  const targetDir = path.join(DATA_DIR, teamDirName);
  
  try {
    const entries = await fs.readdir(targetDir, { withFileTypes: true });
    
    // フォルダ名で検索 (部分一致など柔軟に)
    // 例: "69_ケイ" を探す
    const playerDir = entries.find(entry => 
      entry.isDirectory() && entry.name.includes(`${number}_${name}`)
    );

    if (!playerDir) {
        // "69_69_ケイ" のパターンも試す (投手の場合など)
         const playerDir2 = entries.find(entry => 
            entry.isDirectory() && entry.name.includes(`${number}_${number}_${name}`)
        );
        if(!playerDir2) return { playerData: null, rawData: null };
        
        return await loadDataFromDir(path.join(targetDir, playerDir2.name));
    }

    return await loadDataFromDir(path.join(targetDir, playerDir.name));

  } catch (error) {
    console.error(`Failed to load player data: ${error}`);
    return { playerData: null, rawData: null };
  }
}

async function loadDataFromDir(dirPath: string) {
    // ここでJSONファイルを読み込む
    // 例: batter_stats.json, pitcher_stats.json, profile.json など
    // ファイル構成が不明なため、とりあえず全JSONを読むか、特定のファイルを指定
    
    // 仮の実装: profile.json と stats.json があると仮定
    // 実際には ls の結果にあるファイル名に合わせて調整が必要
    
    try {
        // TODO: 実際のJSONファイル名に合わせて読み込み処理を書く
        // 今回は "data/players/detailed/DeNA/69_ケイ/..." の中身が不明なため
        // ファイル一覧を取得して、それらしいJSONを読み込む
        
        const files = await fs.readdir(dirPath);
        const jsonFiles = files.filter(f => f.endsWith('.json'));
        
        let rawData: any = {};
        
        for (const file of jsonFiles) {
            const content = await fs.readFile(path.join(dirPath, file), 'utf-8');
            const json = JSON.parse(content);
            // ファイル名に応じてデータを結合
            // 例: basic_info.json -> rawData.basic_info
            const key = path.basename(file, '.json');
            rawData[key] = json;
        }

        // CompletePlayerData への変換 (マッパー)
        const playerData = mapRawDataToComplete(rawData);
        
        return { playerData, rawData };

    } catch (e) {
        console.error(e);
        return { playerData: null, rawData: null };
    }
}

// 生データ(JSON)を CompletePlayerData に変換する関数
function mapRawDataToComplete(raw: any): CompletePlayerData {
    // TODO: JSONの構造に合わせてマッピングロジックを実装
    // ここでは最低限のプロパティを埋めるダミー実装
    
    return {
        profile: {
            player_id: 'dummy',
            name_kanji: raw.profile?.name || 'Unknown',
            // ... 他のフィールド
            // 型エラー回避のためのダミー
            name_kana: '', name_romaji: '', birth_date: '', age: 0,
            throws: 'R', bats: 'R', primary_position: 'P',
            current_team: 'DeNA', current_number: '00', status: 'active'
        },
        career: { player_id: 'dummy', debut_year: 0, team_history: [], number_history: [] },
        season_stats: { batting: [], pitching: [] },
        meta: { last_updated: '', version: '', data_sources: [], data_quality: { completeness: 0, reliability: 'low' } }
    } as CompletePlayerData;
}