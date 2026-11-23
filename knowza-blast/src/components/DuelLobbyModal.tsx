import React, { useEffect, useState } from 'react';
import { Check, Copy, Crown, Flame, Play, Share2, Swords, Users, X, Zap } from 'lucide-react';
import { PlayerProgress } from '../types/game';
import {
  BlastDuelRoom,
  buildBlastShareUrl,
  createBlastDuelRoom,
  fetchBlastDuelRoom,
  joinBlastDuelRoom
} from '../utils/blastApi';
import { sfx } from '../utils/sound';
import { KnowzaSprite } from './KnowzaSprite';

export interface ActiveDuelSession {
  kind: 'bot' | 'room';
  seedKey: string;
  roomCode?: string;
  role?: 'host' | 'guest';
  opponentName: string;
}

interface DuelLobbyModalProps {
  progress: PlayerProgress;
  initialJoinCode?: string;
  onStartDuel: (session: ActiveDuelSession) => void;
  onClose: () => void;
}

export const DuelLobbyModal: React.FC<DuelLobbyModalProps> = ({
  progress,
  initialJoinCode = '',
  onStartDuel,
  onClose
}) => {
  const [joinCode, setJoinCode] = useState(initialJoinCode.toUpperCase());
  const [createdRoom, setCreatedRoom] = useState<BlastDuelRoom | null>(null);
  const [busy, setBusy] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Poll created waiting room until friend joins, then launch automatically!
  useEffect(() => {
    if (!createdRoom || createdRoom.status !== 'waiting') return;
    const id = setInterval(async () => {
      const fresh = await fetchBlastDuelRoom(createdRoom.code);
      if (fresh && fresh.guest && fresh.status === 'active') {
        sfx.win();
        onStartDuel({
          kind: 'room',
          seedKey: fresh.code,
          roomCode: fresh.code,
          role: 'host',
          opponentName: fresh.guest.name || 'Rakip'
        });
      }
    }, 1800);
    return () => clearInterval(id);
  }, [createdRoom, onStartDuel]);

  const handleStartBotDuel = () => {
    sfx.click();
    const seed = `BOT_${Date.now().toString(36)}`;
    onStartDuel({
      kind: 'bot',
      seedKey: seed,
      opponentName: 'Usta Knowza'
    });
  };

  const handleCreateRoom = async () => {
    if (busy) return;
    setBusy(true);
    setErrorMsg(null);
    sfx.click();
    const res = await createBlastDuelRoom(progress);
    setBusy(false);
    if (!res.ok || !res.room) {
      sfx.fail();
      setErrorMsg(res.error || 'Oda kurulamadı.');
      return;
    }
    sfx.reward();
    setCreatedRoom(res.room);
  };

  const handleJoinRoom = async () => {
    const clean = joinCode.trim().toUpperCase();
    if (!clean || busy) return;
    setBusy(true);
    setErrorMsg(null);
    sfx.click();
    const res = await joinBlastDuelRoom(clean, progress);
    setBusy(false);
    if (!res.ok || !res.room) {
      sfx.fail();
      setErrorMsg(res.error || 'Oda bulunamadı.');
      return;
    }
    sfx.win();
    const amHost = res.room.host.id === progress.playerId;
    onStartDuel({
      kind: 'room',
      seedKey: res.room.code,
      roomCode: res.room.code,
      role: amHost ? 'host' : 'guest',
      opponentName: amHost ? res.room.guest?.name || 'Rakip' : res.room.host.name || 'Ev Sahibi'
    });
  };

  const handleShareDuelLink = async () => {
    if (!createdRoom) return;
    sfx.click();
    const link = buildBlastShareUrl({ duel: createdRoom.code });
    const msg = `Knowza Blast 1v1 Düelloma katıl! 60 sn aynı bloklarla kapışalım (${createdRoom.code}): ${link}`;
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: 'Knowza Blast 1v1 Düello', text: msg, url: link });
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        return;
      } catch {
        // Ignore abort and copy
      }
    }
    try {
      await navigator.clipboard.writeText(msg);
    } catch {
      // Ignore restricted clipboard
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3">
      <div className="parchment-card w-full max-w-sm rounded-3xl p-4 relative animate-pop-in max-h-[88vh] overflow-y-auto no-scrollbar">
        <button
          type="button"
          onClick={onClose}
          aria-label="Kapat"
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-rose-500 border-2 border-white text-white flex items-center justify-center shadow z-10"
        >
          <X className="w-4 h-4 stroke-[3]" />
        </button>

        <div className="text-center mb-3">
          <div className="wood-ribbon inline-flex items-center gap-1.5 px-5 py-1 rounded-full font-display text-base font-bold text-[#fff3d1]">
            <Swords className="w-4 h-4 text-amber-300" />
            <span>1v1 Düello Arenası</span>
          </div>
          <p className="text-[11px] font-bold text-[#6e3a10] mt-1.5">
            60 saniyede aynı blok dizilimiyle en yüksek skoru kur, +250 Altın kazan!
          </p>
        </div>

        {/* Instant Quick Bot Match Card */}
        <div className="parchment-subcard rounded-2xl p-3 mb-2.5 border-2 border-amber-500/80 bg-gradient-to-br from-[#fff9e6] to-[#fde6ba]">
          <div className="flex items-center gap-2.5 mb-2.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-b from-rose-500 to-red-800 border-2 border-amber-300 p-0.5 shrink-0 shadow">
              <KnowzaSprite
                pose="portrait"
                outfit="karate"
                accessory="bandana"
                mood="combo"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <span className="font-display text-sm font-black text-[#471f04]">
                  Hızlı Maç: Usta Knowza
                </span>
                <span className="px-1.5 py-0.5 rounded-full text-[8.5px] font-black bg-orange-500 text-white">
                  60 Sn
                </span>
              </div>
              <div className="text-[10.5px] font-bold text-[#7c4819] flex items-center gap-1 mt-0.5">
                <Crown className="w-3 h-3 text-amber-600" />
                <span>Ödül: +250 Altın • +25 Yıldız</span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={handleStartBotDuel}
            className="gold-btn w-full py-2.5 rounded-xl font-display text-sm font-black flex items-center justify-center gap-1.5 shadow"
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>Hemen Düelloya Gir!</span>
          </button>
        </div>

        {/* Friend Room Create / Wait / Join */}
        <div className="parchment-subcard rounded-2xl p-3 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-[#471f04] flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-emerald-700" />
              <span>Arkadaşla Canlı Oda</span>
            </span>
            <span className="text-[9.5px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
              Aynı Bloklar
            </span>
          </div>

          {!createdRoom ? (
            <button
              type="button"
              disabled={busy}
              onClick={handleCreateRoom}
              className="green-btn w-full py-2 rounded-xl text-xs font-black flex items-center justify-center gap-1.5"
            >
              <Flame className="w-3.5 h-3.5" />
              <span>{busy ? 'Oda Kuruluyor...' : 'Arkadaş Odası Kur'}</span>
            </button>
          ) : (
            <div className="bg-white/95 border-2 border-emerald-500 rounded-2xl p-2.5 text-center animate-pop-in">
              <div className="text-[10px] font-extrabold text-[#78350f]">Oda Kodun (Rakip Bekleniyor...)</div>
              <div className="font-display text-2xl font-black text-[#451d05] tracking-widest my-0.5">
                {createdRoom.code}
              </div>
              <div className="grid grid-cols-2 gap-1.5 mt-1.5">
                <button
                  type="button"
                  onClick={handleShareDuelLink}
                  className="gold-btn py-1.5 px-2 rounded-xl text-[10.5px] font-black flex items-center justify-center gap-1"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Kopyalandı!' : 'Link Paylaş'}</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onStartDuel({
                      kind: 'room',
                      seedKey: createdRoom.code,
                      roomCode: createdRoom.code,
                      role: 'host',
                      opponentName: 'Rakip (Bekleniyor)'
                    })
                  }
                  className="green-btn py-1.5 px-2 rounded-xl text-[10.5px] font-black flex items-center justify-center gap-1"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Şimdi Başla</span>
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center gap-1.5 mt-1">
            <input
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              placeholder="Oda Kodu (Örn: GO-123)"
              maxLength={10}
              className="flex-1 rounded-xl border border-[#c69554] bg-white px-2.5 py-1.5 text-xs font-black text-[#451d05] uppercase focus:outline-none"
            />
            <button
              type="button"
              disabled={!joinCode.trim() || busy}
              onClick={handleJoinRoom}
              className="brown-btn px-3 py-1.5 rounded-xl text-xs font-black disabled:opacity-50 flex items-center gap-1 shrink-0"
            >
              <Copy className="w-3 h-3" />
              <span>Katıl</span>
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="mt-2 bg-rose-100 border border-rose-400 text-rose-900 rounded-xl px-3 py-1.5 text-[11px] font-black text-center">
            {errorMsg}
          </div>
        )}
      </div>
    </div>
  );
};
