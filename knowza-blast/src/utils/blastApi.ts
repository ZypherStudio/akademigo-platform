import { AccessoryId, OutfitId, PlayerProgress } from '../types/game';

export interface LeaderboardEntry {
  playerId: string;
  inviteCode: string;
  name: string;
  unlockedLevel: number;
  highBlockScore: number;
  highSprintScore: number;
  bestWinStreak: number;
  stars: number;
  outfit: OutfitId;
  accessory: AccessoryId;
  dailyScore: number;
  dailyLines: number;
  league: string;
}

export interface PendingBlastGift {
  id: string;
  type: 'referral' | 'heart';
  fromName: string;
  coins: number;
  hearts: number;
  createdAt: string;
}

export type LeaderboardTab = 'daily' | 'endless' | 'sprint' | 'level';

export function buildBlastShareUrl(params: Record<string, string> = {}): string {
  if (typeof window === 'undefined') return 'https://akademigo-platform.onrender.com/blast/';
  const url = new URL(window.location.pathname || './', window.location.origin);
  Object.entries(params).forEach(([k, v]) => {
    if (v) url.searchParams.set(k, v);
  });
  return url.toString();
}

export async function syncBlastPlayer(
  progress: PlayerProgress,
  daily?: { date: string; score: number; lines: number }
): Promise<{ inviteCode?: string; league?: string; pendingGiftsCount?: number } | null> {
  if (!progress.playerId) return null;
  try {
    const res = await fetch('/api/blast/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        playerId: progress.playerId,
        inviteCode: progress.inviteCode,
        name: progress.name,
        unlockedLevel: progress.unlockedLevel,
        highBlockScore: progress.highBlockScore,
        highSprintScore: progress.highSprintScore || 0,
        bestWinStreak: progress.bestWinStreak || 0,
        stars: progress.stars,
        outfit: progress.equippedOutfit,
        accessory: progress.equippedAccessory,
        dailyDate: daily?.date,
        dailyScore: daily?.score,
        dailyLines: daily?.lines
      })
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.player || null;
  } catch {
    return null;
  }
}

export async function fetchBlastLeaderboard(
  tab: LeaderboardTab,
  playerId?: string,
  date = new Date().toISOString().slice(0, 10)
): Promise<{ players: LeaderboardEntry[]; myRank: number | null; totalPlayers: number } | null> {
  try {
    const q = new URLSearchParams({ tab, date });
    if (playerId) q.set('playerId', playerId);
    const res = await fetch(`/api/blast/leaderboard?${q.toString()}`);
    if (!res.ok) return null;
    const data = await res.json();
    if (!data?.ok) return null;
    return {
      players: Array.isArray(data.players) ? data.players : [],
      myRank: data.myRank ?? null,
      totalPlayers: Number(data.totalPlayers || 0)
    };
  } catch {
    return null;
  }
}

export async function claimBlastReferral(
  progress: PlayerProgress,
  inviteCode: string
): Promise<{ ok: boolean; rewardCoins?: number; rewardRocket?: number; inviterName?: string; error?: string }> {
  if (!progress.playerId) return { ok: false, error: 'Oyuncu kimliği hazır değil.' };
  try {
    const res = await fetch('/api/blast/referral/claim', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        playerId: progress.playerId,
        inviteCode,
        name: progress.name,
        ownInviteCode: progress.inviteCode
      })
    });
    const data = await res.json();
    if (!res.ok || !data?.ok) {
      return { ok: false, error: data?.error || 'Davet kodu uygulanamadı.' };
    }
    return data;
  } catch {
    return { ok: false, error: 'Sunucuya bağlanılamadı.' };
  }
}

export async function sendBlastGift(
  progress: PlayerProgress,
  target: { targetPlayerId?: string; targetInviteCode?: string }
): Promise<{ ok: boolean; receiverName?: string; helperCoins?: number; error?: string }> {
  if (!progress.playerId) return { ok: false, error: 'Oyuncu kimliği hazır değil.' };
  try {
    const res = await fetch('/api/blast/gift/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fromPlayerId: progress.playerId,
        fromName: progress.name,
        ...target
      })
    });
    const data = await res.json();
    if (!res.ok || !data?.ok) {
      return { ok: false, error: data?.error || 'Hediye gönderilemedi.' };
    }
    return data;
  } catch {
    return { ok: false, error: 'Sunucuya bağlanılamadı.' };
  }
}

export async function claimPendingBlastGifts(playerId?: string): Promise<PendingBlastGift[]> {
  if (!playerId) return [];
  try {
    const res = await fetch('/api/blast/gifts/claim', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerId })
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data?.gifts) ? data.gifts : [];
  } catch {
    return [];
  }
}
