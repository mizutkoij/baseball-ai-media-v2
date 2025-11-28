'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Users, ArrowLeft, Loader2 } from 'lucide-react';

interface Player {
  id: string;
  fullName: string;
  team?: string;
  position?: string;
  battingAvg?: number;
  homeRuns?: number;
  era?: number;
}

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTeam, setFilterTeam] = useState<string>('all');

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/players');

      if (!response.ok) {
        throw new Error('選手データの取得に失敗しました');
      }

      const data = await response.json();
      setPlayers(data.players || data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : '不明なエラー');
      console.error('Error fetching players:', err);
    } finally {
      setLoading(false);
    }
  };

  // フィルタリング
  const filteredPlayers = players.filter(player => {
    const matchesSearch = !searchQuery || player.fullName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTeam = filterTeam === 'all' || player.team === filterTeam;
    return matchesSearch && matchesTeam;
  });

  // チーム一覧を取得（重複なし）
  const teams = Array.from(new Set(players.map(p => p.team).filter(Boolean))).sort();

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

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 mb-6">
            <p className="text-red-400 mb-2">エラーが発生しました</p>
            <p className="text-slate-300 text-sm">{error}</p>
          </div>
          <button
            onClick={fetchPlayers}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            再試行
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            ホームに戻る
          </Link>

          <div className="flex items-center gap-3 mb-2">
            <Users className="w-8 h-8 text-blue-500" />
            <h1 className="text-3xl font-bold text-white">選手一覧</h1>
          </div>
          <p className="text-slate-400">
            全{players.length}名の選手データ
          </p>
        </div>

        {/* Filters */}
        <div className="bg-black/20 backdrop-blur-md border border-white/10 rounded-lg p-6 mb-6">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm text-slate-400 mb-2">選手名で検索</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="選手名を入力..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Team Filter */}
            <div>
              <label className="block text-sm text-slate-400 mb-2">チームで絞り込み</label>
              <select
                value={filterTeam}
                onChange={(e) => setFilterTeam(e.target.value)}
                className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">すべてのチーム</option>
                {teams.map(team => (
                  <option key={team} value={team}>{team}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 text-sm text-slate-400">
            {filteredPlayers.length}名の選手を表示中
          </div>
        </div>

        {/* Players Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPlayers.map((player) => (
            <Link
              key={player.id}
              href={`/players/${player.id}`}
              className="bg-black/20 backdrop-blur-md border border-white/10 rounded-lg p-6 hover:bg-black/30 hover:border-blue-500/30 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">
                    {player.fullName}
                  </h3>
                  {player.team && (
                    <p className="text-sm text-blue-400">{player.team}</p>
                  )}
                </div>
                {player.position && (
                  <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded">
                    {player.position}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs">
                {player.battingAvg !== undefined && (
                  <div>
                    <p className="text-slate-500">打率</p>
                    <p className="text-white font-medium">{player.battingAvg.toFixed(3)}</p>
                  </div>
                )}
                {player.homeRuns !== undefined && (
                  <div>
                    <p className="text-slate-500">本塁打</p>
                    <p className="text-white font-medium">{player.homeRuns}</p>
                  </div>
                )}
                {player.era !== undefined && (
                  <div>
                    <p className="text-slate-500">防御率</p>
                    <p className="text-white font-medium">{player.era.toFixed(2)}</p>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>

        {filteredPlayers.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">該当する選手が見つかりませんでした</p>
          </div>
        )}
      </div>
    </div>
  );
}
