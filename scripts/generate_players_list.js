const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = '/opt/baseball-ai-media/output/2025';
const teams = [
  '巨人', '阪神', 'DeNA', '広島', '中日', 'ヤクルト',
  'ソフトバンク', '日本ハム', '西武', 'ロッテ', 'オリックス', '楽天'
];

const players = [];

teams.forEach(team => {
  const teamDir = path.join(OUTPUT_DIR, team);
  if (!fs.existsSync(teamDir)) return;

  const playerDirs = fs.readdirSync(teamDir);

  playerDirs.forEach(playerDir => {
    const basicInfoPath = path.join(teamDir, playerDir, 'basic_info.json');
    if (!fs.existsSync(basicInfoPath)) return;

    try {
      const basicInfo = JSON.parse(fs.readFileSync(basicInfoPath, 'utf8'));

      players.push({
        id: `${team}_${basicInfo.背番}_${basicInfo.名前}`,
        fullName: basicInfo.名前,
        jerseyNumber: basicInfo.背番,
        team: team,
        position: basicInfo.席 || null,
        battingAvg: parseFloat(basicInfo.打率) || 0,
        games: parseInt(basicInfo.試合) || 0,
        atBats: parseInt(basicInfo.打数) || 0,
        hits: parseInt(basicInfo.安打) || 0,
        homeRuns: parseInt(basicInfo.本塁) || 0,
        rbi: parseInt(basicInfo.打点) || 0,
        stolenBases: parseInt(basicInfo.盗塁) || 0,
        obp: parseFloat(basicInfo.出塁率) || 0,
        slg: parseFloat(basicInfo.長打率) || 0,
        ops: parseFloat(basicInfo.OPS) || 0
      });
    } catch (err) {
      console.error(`Error reading ${basicInfoPath}:`, err.message);
    }
  });
});

console.log(JSON.stringify({ players, total: players.length }, null, 2));
