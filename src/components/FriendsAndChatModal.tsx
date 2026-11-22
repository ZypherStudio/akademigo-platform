import React, { useEffect, useState } from 'react';
import {
  Users,
  MessageSquare,
  UserPlus,
  Check,
  ShieldAlert,
  Send,
  Crown,
  Flame,
  Trophy,
  X,
  Lock,
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { KnowzaAvatar } from './KnowzaAvatar';
import { getStreakTier, getEloLeague } from '../utils/streakTiers';
import { moderateChatMessage } from '../utils/chatModeration';
import { sound } from '../utils/audio';

interface FriendProfileItem {
  id: string;
  name: string;
  elo: number;
  xp: number;
  streak: number;
  isPro: boolean;
  costume: any;
  frameId: any;
  rank: number;
}

interface ChatMessageItem {
  id: string;
  senderName: string;
  senderIsPro: boolean;
  senderLeague: string;
  senderStreak: number;
  text: string;
  createdAt: string;
}

const FRIENDS_STORAGE_KEY = 'knowza_friends_list_v1';
const CHAT_STORAGE_KEY = 'knowza_moderated_chat_v1';
const CHAT_BAN_STORAGE_KEY = 'knowza_chat_ban_v1';

const INITIAL_SAFE_MESSAGES: ChatMessageItem[] = [
  {
    id: 'm-1',
    senderName: 'Zeynep_YKS',
    senderIsPro: true,
    senderLeague: '🥇 Altın Arena',
    senderStreak: 28,
    text: 'Bugünkü TYT Matematik ve Ehliyet denemesini bitirdim, herkese iyi çalışmalar! 🔥',
    createdAt: '10 dk önce',
  },
  {
    id: 'm-2',
    senderName: 'Kerem_Code',
    senderIsPro: false,
    senderLeague: '🥈 Gümüş Arena',
    senderStreak: 12,
    text: '1v1 Genel Kültür düellosuna gelecek var mı? Oda açıyorum!',
    createdAt: '4 dk önce',
  },
];

export const FriendsAndChatModal: React.FC<{
  open: boolean;
  onClose: () => void;
}> = ({ open, onClose }) => {
  const { stats, leaderboard } = useGame();
  const [tab, setTab] = useState<'friends' | 'chat'>('friends');
  const [searchInput, setSearchInput] = useState('');
  const [friendIds, setFriendIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(FRIENDS_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [customFriends, setCustomFriends] = useState<FriendProfileItem[]>([]);
  const [messages, setMessages] = useState<ChatMessageItem[]>(() => {
    try {
      const raw = localStorage.getItem(CHAT_STORAGE_KEY);
      return raw ? JSON.parse(raw) : INITIAL_SAFE_MESSAGES;
    } catch {
      return INITIAL_SAFE_MESSAGES;
    }
  });
  const [chatInput, setChatInput] = useState('');
  const [lastSentAt, setLastSentAt] = useState(0);
  const [chatWarning, setChatWarning] = useState<string | null>(null);
  const [banInfo, setBanInfo] = useState<{ banned: boolean; reason: string }>(() => {
    try {
      const raw = localStorage.getItem(CHAT_BAN_STORAGE_KEY);
      return raw ? JSON.parse(raw) : { banned: false, reason: '' };
    } catch {
      return { banned: false, reason: '' };
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(FRIENDS_STORAGE_KEY, JSON.stringify(friendIds));
    } catch {
      // ignore
    }
  }, [friendIds]);

  useEffect(() => {
    try {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages.slice(-40)));
    } catch {
      // ignore
    }
  }, [messages]);

  if (!open) return null;

  const myRank = Math.max(
    1,
    leaderboard.findIndex((u) => u.isCurrentUser) + 1
  );
  const myLeague = getEloLeague(stats.eloRating || 1000);
  const myStreakTier = getStreakTier(stats.streak || 0);

  // Build rich directory from leaderboard + custom added friends
  const directory: FriendProfileItem[] = [
    ...leaderboard.map((u, idx) => {
      const parsedEloMatch = u.name.match(/\((\d+)\s*ELO\)/i);
      const cleanName = u.name.replace(/\s*\(\d+\s*ELO\)/i, '').trim();
      const elo = parsedEloMatch ? Number(parsedEloMatch[1]) : 1000 + Math.min(600, Math.floor(u.xp / 3));
      const isMe = Boolean(u.isCurrentUser);
      return {
        id: u.id,
        name: cleanName || 'Öğrenci',
        elo: isMe ? stats.eloRating : elo,
        xp: u.xp,
        streak: isMe ? stats.streak : Math.max(1, Math.floor(u.xp / 60)),
        isPro: isMe ? Boolean(stats.isPro || stats.isFounder) : u.xp >= 400,
        costume: isMe ? stats.selectedCostume : u.xp >= 400 ? 'king' : 'classic',
        frameId: isMe ? stats.equippedAvatarFrame : u.xp >= 400 ? 'royal_crown' : 'gold_flame',
        rank: idx + 1,
      };
    }),
    ...customFriends,
  ];

  const handleAddByUsername = () => {
    const trimmed = searchInput.trim();
    if (!trimmed) return;
    sound.playVictory();
    const newId = 'friend-' + trimmed.toLowerCase();
    if (!directory.some((d) => d.id === newId || d.name.toLowerCase() === trimmed.toLowerCase())) {
      setCustomFriends((prev) => [
        ...prev,
        {
          id: newId,
          name: trimmed,
          elo: 1120,
          xp: 240,
          streak: 5,
          isPro: false,
          costume: 'graduate',
          frameId: 'gold_flame',
          rank: directory.length + 1,
        },
      ]);
    }
    if (!friendIds.includes(newId)) {
      setFriendIds((prev) => [...prev, newId]);
    }
    setSearchInput('');
  };

  const toggleFriend = (id: string) => {
    sound.playClick();
    setFriendIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSendMessage = () => {
    if (banInfo.banned) return;
    const now = Date.now();
    if (now - lastSentAt < 3000) {
      setChatWarning('⏳ Çok hızlı mesaj gönderiyorsun! Lütfen 3 saniye bekle.');
      return;
    }

    const mod = moderateChatMessage(chatInput);
    if (!mod.allowed) {
      sound.playWrong();
      if (mod.shouldBanImmediately) {
        const nextBan = {
          banned: true,
          reason: mod.reason || 'Sohbet kuralları ihlali nedeniyle kalıcı olarak yasaklandınız.',
        };
        setBanInfo(nextBan);
        try {
          localStorage.setItem(CHAT_BAN_STORAGE_KEY, JSON.stringify(nextBan));
        } catch {
          // ignore
        }
      } else {
        setChatWarning(mod.reason || 'Mesaj gönderilemedi.');
      }
      return;
    }

    sound.playClick();
    setChatWarning(null);
    setLastSentAt(now);
    const senderName = stats.username || stats.email?.split('@')[0] || 'Knowza Öğrencisi';
    const newMsg: ChatMessageItem = {
      id: 'msg-' + now,
      senderName,
      senderIsPro: Boolean(stats.isPro || stats.isFounder),
      senderLeague: `${myLeague.emoji} ${myLeague.titleTr}`,
      senderStreak: stats.streak || 0,
      text: chatInput.trim(),
      createdAt: 'Şimdi',
    };
    setMessages((prev) => [...prev, newMsg]);
    setChatInput('');
  };

  return (
    <div className="fixed inset-0 z-[125] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fade select-none">
      <div className="w-full max-w-md md:max-w-xl bg-[#FFFDF7] rounded-[32px] border-2 border-amber-200 shadow-2xl overflow-hidden flex flex-col max-h-[88dvh]">
        {/* Header */}
        <div className="px-4 py-3.5 bg-gradient-to-r from-amber-400 via-[#FFB800] to-orange-400 text-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            <h3 className="font-black text-base">Arkadaşlar & Güvenli Sohbet</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-slate-800 hover:bg-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* My Summary Strip (Rank, League, Streak, PRO, Avatar) */}
        <div className="px-4 py-3 bg-white border-b border-amber-100 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <KnowzaAvatar
              size="sm"
              costume={stats.selectedCostume}
              frameId={stats.equippedAvatarFrame}
              customBear={stats.customBear}
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-xs text-slate-900 truncate">
                  {stats.username || 'Sen'}
                </span>
                {(stats.isPro || stats.isFounder) && (
                  <span className="px-1.5 py-0.5 rounded-full bg-amber-300 text-slate-950 text-[9px] font-black">
                    👑 PRO
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600">
                <span>{myLeague.emoji} {myLeague.titleTr}</span>
                <span>•</span>
                <span>🔥 {stats.streak || 0}g</span>
                <span>•</span>
                <span>🏆 #{myRank}</span>
              </div>
            </div>
          </div>
          <span className="text-[10px] font-black px-2 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
            {myStreakTier.emoji} {stats.eloRating} ELO
          </span>
        </div>

        {/* Mode Switch Tabs */}
        <div className="grid grid-cols-2 gap-2 p-3 bg-amber-50/60">
          <button
            onClick={() => setTab('friends')}
            className={`py-2 rounded-2xl font-black text-xs flex items-center justify-center gap-1.5 transition ${
              tab === 'friends'
                ? 'bg-slate-900 text-amber-300 shadow-sm'
                : 'bg-white text-slate-600 border border-amber-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Arkadaşlar ({friendIds.length})</span>
          </button>
          <button
            onClick={() => setTab('chat')}
            className={`py-2 rounded-2xl font-black text-xs flex items-center justify-center gap-1.5 transition ${
              tab === 'chat'
                ? 'bg-slate-900 text-amber-300 shadow-sm'
                : 'bg-white text-slate-600 border border-amber-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Kurallı Sohbet</span>
          </button>
        </div>

        {/* TAB 1: FRIENDS & PLAYER CARDS */}
        {tab === 'friends' && (
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3">
            {/* Add Friend Input */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Kullanıcı adı ile arkadaş ekle..."
                maxLength={32}
                className="flex-1 px-3.5 py-2.5 rounded-2xl bg-white border border-amber-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-amber-500"
              />
              <button
                onClick={handleAddByUsername}
                className="px-3.5 py-2.5 rounded-2xl bg-[#58cc02] hover:bg-[#46a302] text-white font-black text-xs flex items-center gap-1 shadow-xs"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Ekle</span>
              </button>
            </div>

            <div className="space-y-2">
              {directory.map((p) => {
                const pLeague = getEloLeague(p.elo);
                const pStreak = getStreakTier(p.streak);
                const isAdded = friendIds.includes(p.id);
                return (
                  <div
                    key={p.id}
                    className="p-3 rounded-2xl bg-white border border-amber-100 shadow-xs flex items-center justify-between gap-2.5"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <KnowzaAvatar size="sm" costume={p.costume} frameId={p.frameId} />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-black text-xs text-slate-900 truncate">
                            {p.name}
                          </span>
                          {p.isPro && (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-gradient-to-r from-amber-300 to-yellow-400 text-slate-950 text-[9px] font-black">
                              <Crown className="w-2.5 h-2.5" /> PRO
                            </span>
                          )}
                          <span className="text-[10px] font-black text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-md">
                            🏆 #{p.rank}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 mt-0.5 flex-wrap">
                          <span className={`px-1.5 py-0.2 rounded border text-[9px] font-black ${pLeague.badgeClass}`}>
                            {pLeague.emoji} {pLeague.titleTr} ({p.elo})
                          </span>
                          <span className="inline-flex items-center gap-0.5 text-orange-600 font-black">
                            <Flame className="w-3 h-3 fill-orange-500" />
                            {p.streak}g {pStreak.emoji}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleFriend(p.id)}
                      className={`px-3 py-1.5 rounded-xl font-black text-[11px] flex items-center gap-1 transition flex-shrink-0 ${
                        isAdded
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-900 text-amber-300 hover:bg-black'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3 h-3" />
                          <span>Arkadaş</span>
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-3 h-3" />
                          <span>Ekle</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: STRICT MODERATED CHAT WITH AUTO-BAN */}
        {tab === 'chat' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Strict Rules Banner */}
            <div className="px-3.5 py-2 bg-rose-50 border-b border-rose-200 flex items-center gap-2 text-[10px] font-bold text-rose-800">
              <ShieldAlert className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>
                Kurallı Sohbet: Küfür, argo, hakaret veya link paylaşımı sistem tarafından algılanır ve <b>anında kalıcı ban</b> uygulanır. (Maks 160 krktr)
              </span>
            </div>

            {banInfo.banned ? (
              <div className="flex-1 p-6 flex flex-col items-center justify-center text-center space-y-3 bg-rose-50/40">
                <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
                  <Lock className="w-8 h-8" />
                </div>
                <h4 className="text-base font-black text-rose-900">
                  Sohbetten Kalıcı Olarak Yasaklandın! 🚫
                </h4>
                <p className="text-xs font-semibold text-rose-700 max-w-xs leading-relaxed">
                  {banInfo.reason}
                </p>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-3.5 space-y-2.5">
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className="p-2.5 rounded-2xl bg-white border border-amber-100 shadow-2xs space-y-1"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-black text-xs text-slate-900">{m.senderName}</span>
                          {m.senderIsPro && (
                            <span className="px-1.5 py-0.2 rounded-full bg-amber-300 text-slate-950 text-[9px] font-black">
                              👑 PRO
                            </span>
                          )}
                          <span className="text-[9px] font-extrabold text-slate-500">
                            {m.senderLeague} • 🔥{m.senderStreak}g
                          </span>
                        </div>
                        <span className="text-[9px] font-bold text-slate-400">{m.createdAt}</span>
                      </div>
                      <p className="text-xs font-semibold text-slate-700 break-words">{m.text}</p>
                    </div>
                  ))}
                </div>

                {chatWarning && (
                  <div className="px-3.5 py-1.5 bg-amber-100 text-amber-900 text-[11px] font-black">
                    {chatWarning}
                  </div>
                )}

                <div className="p-3 bg-white border-t border-amber-100 flex items-center gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSendMessage();
                    }}
                    maxLength={160}
                    placeholder="Kurallara uygun mesaj yaz (maks 160)..."
                    className="flex-1 px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-amber-500"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="p-2.5 rounded-2xl bg-[#FFB800] hover:bg-amber-400 text-slate-950 font-black transition"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
