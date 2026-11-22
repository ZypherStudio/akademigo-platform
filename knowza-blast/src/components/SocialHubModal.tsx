import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Check,
  Coins,
  Copy,
  Crown,
  Flame,
  Gift,
  Heart,
  RefreshCw,
  Share2,
  Smartphone,
  Star,
  Trophy,
  UserPlus,
  X
} from 'lucide-react';
import { PlayerProgress } from '../types/game';
import {
  LeaderboardEntry,
  LeaderboardTab,
  PendingBlastGift,
  buildBlastShareUrl,
  claimBlastReferral,
  claimPendingBlastGifts,
  fetchBlastLeaderboard,
  sendBlastGift,
  syncBlastPlayer
} from '../utils/blastApi';
import { sfx } from '../utils/sound';
import { KnowzaSprite } from './KnowzaSprite';

export type SocialTab = 'leaderboard' | 'invite' | 'install';

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface SocialHubModalProps {
  progress: PlayerProgress;
  initialTab?: SocialTab;
  initialReferralCode?: string;
  deferredInstallPrompt?: BeforeInstallPromptEvent | null;
  onConsumeInstallPrompt?: () => void;
  onClaimReferralReward: (code: string, coins: number, rockets: number) => void;
  onClaimPendingGifts: (gifts: PendingBlastGift[]) => void;
  onHelperGiftCoinReward: (coins: number) => void;
  onClose: () => void;
}

const LEAGUE_BADGE_MAP: Record<string, string> = {
  Efsane: 'bg-purple-600 text-white border-purple-200',
  Elmas: 'bg-cyan-500 text-white border-cyan-100',
  Altın: 'bg-amber-400 text-[#4a2204] border-yellow-100',
  Gümüş: 'bg-slate-400 text-white border-slate-100',
  Bronz: 'bg-amber-700 text-amber-50 border-amber-300',
  Çırak: 'bg-stone-500 text-white border-stone-200'
};

export const SocialHubModal: React.FC<SocialHubModalProps> = ({
  progress,
  initialTab = 'leaderboard',
  initialReferralCode = '',
  deferredInstallPrompt = null,
  onConsumeInstallPrompt,
  onClaimReferralReward,
  onClaimPendingGifts,
  onHelperGiftCoinReward,
  onClose
}) => {
  const [tab, setTab] = useState<SocialTab>(initialTab);
  const [lbTab, setLbTab] = useState<LeaderboardTab>('endless');
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [myRank, setMyRank] = useState<number | null>(null);
  const [totalPlayers, setTotalPlayers] = useState(0);
  const [loadingLb, setLoadingLb] = useState(false);

  const [pendingGifts, setPendingGifts] = useState<PendingBlastGift[]>([]);
  const [codeInput, setCodeInput] = useState(initialReferralCode);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [copiedFlag, setCopiedFlag] = useState<'ref' | 'heart' | null>(null);
  const [sentHearts, setSentHearts] = useState<Record<string, boolean>>({});
  const [busyAction, setBusyAction] = useState(false);

  const today = new Date().toISOString().slice(0, 10);

  const loadLeaderboard = async (activeLbTab: LeaderboardTab) => {
    setLoadingLb(true);
    await syncBlastPlayer(progress);
    const res = await fetchBlastLeaderboard(activeLbTab, progress.playerId, today);
    if (res) {
      setEntries(res.players);
      setMyRank(res.myRank);
      setTotalPlayers(res.totalPlayers);
    }
    setLoadingLb(false);
  };

  useEffect(() => {
    if (tab === 'leaderboard') {
      loadLeaderboard(lbTab);
    }
  }, [tab, lbTab]);

  const handleCopyOrShare = async (kind: 'ref' | 'heart') => {
    sfx.click();
    const shareUrl =
      kind === 'ref'
        ? buildBlastShareUrl({ ref: progress.inviteCode || 'KNOWZA' })
        : buildBlastShareUrl({ gift_req: progress.playerId || '' });
    const text =
      kind === 'ref'
        ? `Knowza Blast oynuyorum! Bu linkle katıl, ikimiz de +300 Altın + Güçlendirici kazanalım (${progress.inviteCode}): ${shareUrl}`
        : `Knowza Blast'ta canım bitti! Bu linke dokunup bana +1 Can hediye gönderir misin? ${shareUrl}`;

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: 'Knowza Blast', text, url: shareUrl });
        setCopiedFlag(kind);
        setTimeout(() => setCopiedFlag(null), 2000);
        return;
      } catch {
        // User cancelled or share unsupported, fall back to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Clipboard blocked silently in restricted context
    }
    setCopiedFlag(kind);
    setTimeout(() => setCopiedFlag(null), 2000);
  };

  const handleSubmitReferral = async () => {
    const clean = codeInput.trim().toUpperCase();
    if (!clean || busyAction) return;
    setBusyAction(true);
    setStatusMsg(null);
    await syncBlastPlayer(progress);
    const res = await claimBlastReferral(progress, clean);
    setBusyAction(false);
    if (!res.ok) {
      sfx.fail();
      setStatusMsg(res.error || 'Davet kodu uygulanamadı.');
      return;
    }
    sfx.win();
    confetti({ particleCount: 55, spread: 70, origin: { y: 0.55 } });
    onClaimReferralReward(clean, res.rewardCoins || 300, res.rewardRocket || 1);
    setStatusMsg(`${res.inviterName} daveti onaylandı! +${res.rewardCoins || 300} Altın + 1 Roket kazandın!`);
  };

  const handleCheckAndClaimGifts = async () => {
    if (busyAction) return;
    setBusyAction(true);
    const gifts = await claimPendingBlastGifts(progress.playerId);
    setBusyAction(false);
    if (gifts.length === 0) {
      setStatusMsg('Şu an bekleyen hediye bulunmuyor.');
      return;
    }
    sfx.reward();
    confetti({ particleCount: 45, spread: 60, origin: { y: 0.55 } });
    setPendingGifts(gifts);
    onClaimPendingGifts(gifts);
  };

  const handleSendHeartToPlayer = async (target: LeaderboardEntry) => {
    if (sentHearts[target.playerId]) return;
    const res = await sendBlastGift(progress, { targetPlayerId: target.playerId });
    if (res.ok) {
      sfx.reward();
      setSentHearts((prev) => ({ ...prev, [target.playerId]: true }));
      onHelperGiftCoinReward(res.helperCoins || 50);
    } else {
      sfx.fail();
      setStatusMsg(res.error || 'Bugün zaten can gönderildi.');
    }
  };

  const handleTriggerPwaInstall = async () => {
    sfx.click();
    if (!deferredInstallPrompt) return;
    await deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    onConsumeInstallPrompt?.();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3">
      <div className="parchment-card w-full max-w-sm rounded-3xl p-4 relative animate-pop-in max-h-[88vh] flex flex-col">
        <button
          type="button"
          onClick={onClose}
          aria-label="Kapat"
          className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-rose-500 border-2 border-white text-white flex items-center justify-center shadow z-10"
        >
          <X className="w-4 h-4 stroke-[3]" />
        </button>

        <div className="text-center mb-2.5 shrink-0">
          <div className="wood-ribbon inline-block px-5 py-1 rounded-full font-display text-base font-bold text-[#fff3d1] -mt-8">
            Topluluk & Sıralama
          </div>
        </div>

        {/* Main Hub Tabs */}
        <div className="bg-[#e8cb99] border border-[#c69554] rounded-2xl p-1 grid grid-cols-3 gap-1 mb-3 shrink-0">
          <button
            type="button"
            onClick={() => {
              sfx.click();
              setTab('leaderboard');
            }}
            className={`py-1.5 rounded-xl font-extrabold text-[11px] flex items-center justify-center gap-1 transition ${
              tab === 'leaderboard' ? 'bg-[#fffaf0] text-[#4a2206] shadow' : 'text-[#6e3d12]'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-600" />
            <span>Sıralama</span>
          </button>
          <button
            type="button"
            onClick={() => {
              sfx.click();
              setTab('invite');
            }}
            className={`py-1.5 rounded-xl font-extrabold text-[11px] flex items-center justify-center gap-1 transition ${
              tab === 'invite' ? 'bg-[#fffaf0] text-[#4a2206] shadow' : 'text-[#6e3d12]'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5 text-emerald-600" />
            <span>Davet & Can</span>
          </button>
          <button
            type="button"
            onClick={() => {
              sfx.click();
              setTab('install');
            }}
            className={`py-1.5 rounded-xl font-extrabold text-[11px] flex items-center justify-center gap-1 transition ${
              tab === 'install' ? 'bg-[#fffaf0] text-[#4a2206] shadow' : 'text-[#6e3d12]'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-sky-600" />
            <span>Uygulama</span>
          </button>
        </div>

        {/* Tab 1: Real Server Leaderboard */}
        {tab === 'leaderboard' && (
          <div className="flex-1 flex flex-col min-h-0">
            <div className="grid grid-cols-4 gap-1 mb-2 shrink-0">
              {(
                [
                  { id: 'daily', label: 'Günlük' },
                  { id: 'endless', label: 'Sonsuz' },
                  { id: 'sprint', label: '90 Sn' },
                  { id: 'level', label: 'Seviye' }
                ] as { id: LeaderboardTab; label: string }[]
              ).map((sub) => (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => {
                    sfx.click();
                    setLbTab(sub.id);
                  }}
                  className={`py-1 rounded-xl text-[10px] font-black border transition ${
                    lbTab === sub.id
                      ? 'gold-btn border-amber-700'
                      : 'bg-white/75 text-[#69370f] border-[#d3ad77]'
                  }`}
                >
                  {sub.label}
                </button>
              ))}
            </div>

            <div className="parchment-subcard rounded-2xl px-3 py-1.5 mb-2 flex items-center justify-between text-[11px] font-black text-[#4d2407] shrink-0">
              <span>
                {myRank ? `Sıralaman: #${myRank} / ${totalPlayers}` : `Kayıtlı Oyuncu: ${totalPlayers}`}
              </span>
              <button
                type="button"
                onClick={() => loadLeaderboard(lbTab)}
                className="inline-flex items-center gap-1 text-amber-800 hover:underline"
              >
                <RefreshCw className={`w-3 h-3 ${loadingLb ? 'animate-spin' : ''}`} />
                <span>Yenile</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-1.5 pr-0.5">
              {loadingLb && entries.length === 0 ? (
                <div className="py-8 text-center text-xs font-bold text-[#7c4819]">
                  Sunucu sıralaması yükleniyor...
                </div>
              ) : entries.length === 0 ? (
                <div className="parchment-subcard rounded-2xl p-4 text-center text-xs font-bold text-[#6e3a10]">
                  Bu kategoride ilk rekoru kır ve zirveye yerleş!
                </div>
              ) : (
                entries.map((item, idx) => {
                  const isMe = item.playerId === progress.playerId;
                  const metric =
                    lbTab === 'daily'
                      ? `${item.dailyScore} puan`
                      : lbTab === 'sprint'
                      ? `${item.highSprintScore} puan`
                      : lbTab === 'level'
                      ? `Seviye ${item.unlockedLevel}`
                      : `${item.highBlockScore} puan`;
                  return (
                    <div
                      key={item.playerId}
                      className={`rounded-2xl p-2 border flex items-center gap-2 ${
                        isMe
                          ? 'bg-amber-200/90 border-amber-600 ring-1 ring-amber-500'
                          : 'parchment-subcard border-[#d8b786]'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black shrink-0 ${
                          idx === 0
                            ? 'bg-yellow-400 text-[#471f04]'
                            : idx === 1
                            ? 'bg-slate-300 text-slate-900'
                            : idx === 2
                            ? 'bg-amber-600 text-white'
                            : 'bg-[#d8b482] text-[#4d2407]'
                        }`}
                      >
                        {idx + 1}
                      </div>

                      <div className="w-8 h-8 rounded-full bg-amber-100 border border-amber-500 overflow-hidden shrink-0">
                        <KnowzaSprite
                          pose="portrait"
                          outfit={item.outfit || 'classic'}
                          accessory={item.accessory || 'none'}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-black text-[#451d05] truncate">
                            {item.name}
                          </span>
                          <span
                            className={`px-1.5 py-[1px] rounded-full text-[8px] font-black border shrink-0 ${
                              LEAGUE_BADGE_MAP[item.league] || LEAGUE_BADGE_MAP['Çırak']
                            }`}
                          >
                            {item.league}
                          </span>
                        </div>
                        <div className="text-[10.5px] font-extrabold text-[#78350f] flex items-center gap-2">
                          <span>{metric}</span>
                          <span className="inline-flex items-center gap-0.5 text-amber-700">
                            <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-500" />
                            {item.stars}
                          </span>
                        </div>
                      </div>

                      {!isMe && (
                        <button
                          type="button"
                          disabled={Boolean(sentHearts[item.playerId])}
                          onClick={() => handleSendHeartToPlayer(item)}
                          className={`px-2 py-1 rounded-xl text-[9.5px] font-black flex items-center gap-0.5 shrink-0 ${
                            sentHearts[item.playerId]
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-rose-500 text-white shadow active:scale-95'
                          }`}
                          title="Günlük Can Gönder (+50 Altın kazan)"
                        >
                          <Heart className="w-3 h-3 fill-current" />
                          <span>{sentHearts[item.playerId] ? 'Gitti' : '+Can'}</span>
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Referral Rewards + Heart Requests + Gift Inbox */}
        {tab === 'invite' && (
          <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-2.5 pr-0.5">
            <div className="parchment-subcard rounded-2xl p-3 text-center">
              <div className="inline-flex items-center gap-1 text-xs font-black text-[#471f04]">
                <Gift className="w-4 h-4 text-emerald-600" />
                <span>Arkadaşını Çağır, İkiniz de Kazanın!</span>
              </div>
              <p className="text-[10.5px] font-bold text-[#6e3a10] mt-1">
                Linkinle katılan her arkadaşın için hem sana hem arkadaşına +300 Altın ve ekstra hediye!
              </p>

              <div className="mt-2 bg-white/90 border-2 border-dashed border-amber-500 rounded-xl py-1.5 px-3 flex items-center justify-between gap-2">
                <span className="text-[10px] font-extrabold text-[#78350f]">Davet Kodun:</span>
                <span className="font-display text-base font-black text-[#451d05] tracking-wider">
                  {progress.inviteCode || 'KB-KNOW'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-1.5 mt-2">
                <button
                  type="button"
                  onClick={() => handleCopyOrShare('ref')}
                  className="gold-btn py-2 px-2 rounded-xl text-[11px] font-black flex items-center justify-center gap-1"
                >
                  {copiedFlag === 'ref' ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span>{copiedFlag === 'ref' ? 'Kopyalandı!' : 'Davet Linki Paylaş'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleCopyOrShare('heart')}
                  className="green-btn py-2 px-2 rounded-xl text-[11px] font-black flex items-center justify-center gap-1"
                >
                  {copiedFlag === 'heart' ? <Check className="w-3.5 h-3.5" /> : <Heart className="w-3.5 h-3.5 fill-current" />}
                  <span>{copiedFlag === 'heart' ? 'Hazır!' : 'Can İste Linki'}</span>
                </button>
              </div>
            </div>

            {/* Enter Friend Invite Code */}
            <div className="parchment-subcard rounded-2xl p-3">
              <div className="text-xs font-black text-[#471f04] mb-1">
                {progress.claimedReferralCode
                  ? `Kullanılan Davet Kodu: ${progress.claimedReferralCode}`
                  : 'Arkadaşının Davet Kodunu Gir (+300 Altın + 1 Roket)'}
              </div>
              {!progress.claimedReferralCode && (
                <div className="flex gap-1.5 mt-1.5">
                  <input
                    value={codeInput}
                    onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
                    placeholder="Örn: KB-4829"
                    maxLength={12}
                    className="flex-1 rounded-xl border border-[#c69554] bg-white px-2.5 py-1.5 text-xs font-black text-[#451d05] uppercase focus:outline-none"
                  />
                  <button
                    type="button"
                    disabled={!codeInput.trim() || busyAction}
                    onClick={handleSubmitReferral}
                    className="gold-btn px-3 py-1.5 rounded-xl text-xs font-black disabled:opacity-50"
                  >
                    Uygula
                  </button>
                </div>
              )}
            </div>

            {/* Gift Inbox */}
            <div className="parchment-subcard rounded-2xl p-3">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <div className="text-xs font-black text-[#471f04]">Gelen Hediye Kutusu</div>
                  <div className="text-[10px] font-bold text-[#7c4819]">
                    Arkadaşlarından gelen Can ve Davet altınlarını al
                  </div>
                </div>
                <button
                  type="button"
                  disabled={busyAction}
                  onClick={handleCheckAndClaimGifts}
                  className="gold-btn px-3 py-1.5 rounded-xl text-[11px] font-black shrink-0"
                >
                  Kontrol Et
                </button>
              </div>

              {pendingGifts.length > 0 && (
                <div className="mt-2 flex flex-col gap-1">
                  {pendingGifts.map((g) => (
                    <div
                      key={g.id}
                      className="bg-emerald-50 border border-emerald-300 rounded-xl px-2.5 py-1 text-[10.5px] font-black text-emerald-900 flex items-center justify-between"
                    >
                      <span>{g.fromName}</span>
                      <span>+{g.coins} Altın • +{g.hearts} Can</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {statusMsg && (
              <div className="bg-amber-100 border border-amber-400 text-amber-950 rounded-xl px-3 py-2 text-[11px] font-black text-center">
                {statusMsg}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: PWA Mobile App Install Guide */}
        {tab === 'install' && (
          <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-2.5 pr-0.5">
            <div className="parchment-subcard rounded-2xl p-3 text-center">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-b from-amber-300 to-orange-500 border-2 border-[#78350f] mx-auto flex items-center justify-center shadow mb-2">
                <Smartphone className="w-6 h-6 text-[#471f04]" />
              </div>
              <div className="font-display text-sm font-black text-[#471f04]">
                Knowza Blast’ı Telefona Kur (PWA)
              </div>
              <p className="text-[10.5px] font-bold text-[#6e3a10] mt-1">
                Tarayıcı çubuğu olmadan tam ekran uygulama ikonu gibi açılır ve ilerlemeni her zaman korur!
              </p>

              {deferredInstallPrompt && (
                <button
                  type="button"
                  onClick={handleTriggerPwaInstall}
                  className="gold-btn w-full py-2.5 rounded-xl text-xs font-black mt-3 flex items-center justify-center gap-1.5"
                >
                  <Crown className="w-4 h-4" />
                  <span>Uygulama Olarak Yükle</span>
                </button>
              )}
            </div>

            <div className="parchment-subcard rounded-2xl p-3 text-left text-[11px] font-bold text-[#5c2c09] flex flex-col gap-1.5">
              <div className="font-black text-[#471f04] flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-orange-500" />
                <span>iPhone / Safari Kurulumu</span>
              </div>
              <div>1. Alt menüden Paylaş simgesine (yukarı ok) dokun.</div>
              <div>2. Listeden "Ana Ekrana Ekle" seçeneğine bas ve Ekle de.</div>
            </div>

            <div className="parchment-subcard rounded-2xl p-3 text-left text-[11px] font-bold text-[#5c2c09] flex flex-col gap-1.5">
              <div className="font-black text-[#471f04] flex items-center gap-1">
                <Coins className="w-3.5 h-3.5 text-amber-600" />
                <span>Android / Chrome Kurulumu</span>
              </div>
              <div>1. Sağ üst menüye (3 nokta) dokun.</div>
              <div>2. "Ana ekrana ekle" veya "Uygulamayı yükle"ye bas.</div>
            </div>

            <button
              type="button"
              onClick={() => handleCopyOrShare('ref')}
              className="brown-btn w-full py-2 rounded-xl text-xs font-black flex items-center justify-center gap-1.5"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Oyun Linkini Kopyala</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
