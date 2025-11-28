'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, TrendingUp, Calendar, MapPin, Users, Activity, Loader2 } from 'lucide-react';

interface PlayerStats {
  basic_info?: {
    名前: string;
    背番: string;
    チーム: string;
    位置: string;
    打率: string;
    試合: string;
    打数: string;
    安打: string;
    本塁: string;
    打点: string;
    盗塁: string;
    出塁率: string;
    長打率: string;
    OPS: string;
  };
  monthly?: Array<{
    月: string;
    [key: string]: any;
  }>;
  ballpark?: Array<{
    球場: string;
    [key: string]: any;
  }>;
  opponent_team_league?: Array<{
    対戦チーム: string;
    [key: string]: any;
  }>;
  vs_leftright?: {
    [key: string]: any;
  };
  day_night?: {
    [key: string]: any;
  };
  home_visitor?: {
    [key: string]: any;
  };
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function PlayerDetailPage({ params }: PageProps) {
  const [playerId, setPlayerId] = useState<string>('');
  const [stats, setStats] = useState<PlayerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    params.then(p => setPlayerId(p.id));
  }, [params]);

  useEffect(() => {
    if (!playerId) return;
    fetchPlayerStats();
  }, [playerId]);

  const fetchPlayerStats = async () => {
    try {
      setLoading(true);

      // Parse player ID: format is "team_number_name"
      const parts = playerId.split('_');
      if (parts.length < 3) {
        throw new Error('Invalid player ID format');
      }

      const team = parts[0];
      const name = parts.slice(2).join('_');

      const response = await fetch(
        `/api/players/${encodeURIComponent(playerId)}/detailed-stats?team=${encodeURIComponent(team)}&name=${encodeURIComponent(name)}`
      );

      if (!response.ok) {
        throw new Error('選手データの取得に失敗しました');
      }

      const data = await response.json();
      setStats(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : '不明なエラー');
      console.error('Error fetching player stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-300">選手データを読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 mb-6">
            <p className="text-red-400 mb-2">エラーが発生しました</p>
            <p className="text-slate-300 text-sm">{error}</p>
          </div>
          <Link
            href="/players"
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors inline-block"
          >
            選手一覧に戻る
          </Link>
        </div>
      </div>
    );
  }

  const basicInfo = stats.basic_info;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/players"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            選手一覧に戻る
          </Link>

          {basicInfo && (
            <div className="bg-black/20 backdrop-blur-md border border-white/10 rounded-lg p-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">{basicInfo.名前}</h1>
                  <div className="flex items-center gap-4 text-slate-300">
                    <span className="text-2xl">#{basicInfo.背番}</span>
                    <span>|</span>
                    <span>{basicInfo.チーム}</span>
                    {basicInfo.位置 && (
                      <>
                        <span>|</span>
                        <span>{basicInfo.位置}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Main Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-6">
                <StatCard label="打率" value={basicInfo.打率} highlight />
                <StatCard label="試合" value={basicInfo.試合} />
                <StatCard label="打数" value={basicInfo.打数} />
                <StatCard label="安打" value={basicInfo.安打} />
                <StatCard label="本塁打" value={basicInfo.本塁} highlight />
                <StatCard label="打点" value={basicInfo.打点} />
                <StatCard label="盗塁" value={basicInfo.盗塁} />
                <StatCard label="出塁率" value={basicInfo.出塁率} highlight />
                <StatCard label="長打率" value={basicInfo.長打率} />
                <StatCard label="OPS" value={basicInfo.OPS} highlight />
              </div>
            </div>
          )}
        </div>

        {/* Detailed Stats Sections */}
        <div className="space-y-6">
          {/* Monthly Stats */}
          {stats.monthly && stats.monthly.length > 0 && (
            <StatsSection
              title="月別成績"
              icon={<Calendar className="w-6 h-6" />}
              data={stats.monthly}
            />
          )}

          {/* Ballpark Stats */}
          {stats.ballpark && stats.ballpark.length > 0 && (
            <StatsSection
              title="球場別成績"
              icon={<MapPin className="w-6 h-6" />}
              data={stats.ballpark}
            />
          )}

          {/* Opponent Team Stats */}
          {stats.opponent_team_league && stats.opponent_team_league.length > 0 && (
            <StatsSection
              title="対戦チーム別成績"
              icon={<Users className="w-6 h-6" />}
              data={stats.opponent_team_league}
            />
          )}

          {/* vs Left/Right */}
          {stats.vs_leftright && (
            <StatsSection
              title="対左右別成績"
              icon={<TrendingUp className="w-6 h-6" />}
              data={Object.entries(stats.vs_leftright).map(([key, value]) => ({
                対戦: key,
                ...value as object
              }))}
            />
          )}

          {/* Day/Night */}
          {stats.day_night && (
            <StatsSection
              title="デーゲーム・ナイター別成績"
              icon={<Activity className="w-6 h-6" />}
              data={Object.entries(stats.day_night).map(([key, value]) => ({
                時間帯: key,
                ...value as object
              }))}
            />
          )}

          {/* Home/Visitor */}
          {stats.home_visitor && (
            <StatsSection
              title="ホーム・ビジター別成績"
              icon={<Activity className="w-6 h-6" />}
              data={Object.entries(stats.home_visitor).map(([key, value]) => ({
                場所: key,
                ...value as object
              }))}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-lg p-4 ${highlight ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-black/20 border border-white/5'}`}>
      <p className="text-xs text-slate-400 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${highlight ? 'text-blue-400' : 'text-white'}`}>{value}</p>
    </div>
  );
}

function StatsSection({ title, icon, data }: { title: string; icon: React.ReactNode; data: any[] }) {
  if (!data || data.length === 0) return null;

  const keys = Object.keys(data[0] || {});

  return (
    <div className="bg-black/20 backdrop-blur-md border border-white/10 rounded-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="text-blue-500">{icon}</div>
        <h2 className="text-xl font-bold text-white">{title}</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              {keys.map(key => (
                <th key={key} className="text-left py-3 px-4 text-slate-400 font-medium">
                  {key}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                {keys.map(key => (
                  <td key={key} className="py-3 px-4 text-white">
                    {typeof row[key] === 'object' ? JSON.stringify(row[key]) : String(row[key] ?? '-')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
