import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import {
  ArrowLeft,
  Settings,
  User,
  Globe,
  Bell,
  Sliders,
  HelpCircle,
  ChevronRight,
  LogOut,
  Sparkles,
  Check,
  Edit3,
  Download,
  Compass,
  GraduationCap
} from 'lucide-react';
import { soundSystem } from '../utils/audio';
import { KnowzaAvatar } from './KnowzaAvatar';

interface KnowzaProfileProps {
  onBack?: () => void;
  onOpenAuth?: () => void;
  onOpenOnboarding?: () => void;
}

export const KnowzaProfile: React.FC<KnowzaProfileProps> = ({
  onBack,
  onOpenAuth,
  onOpenOnboarding
}) => {
  const { stats, updateUsername, logoutUser } = useGame();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [bgmOn, setBgmOn] = useState(() => soundSystem.getBgmEnabled());
  const [sfxOn, setSfxOn] = useState(() => soundSystem.getSfxEnabled());
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(stats.username || 'Öğrenci');
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const handleSaveName = () => {
    if (nameInput.trim()) {
      updateUsername(nameInput.trim());
      setIsEditingName(false);
      soundSystem.playCorrect();
    }
  };

  const currentLevel = Math.max(13, Math.floor((stats.xp || 1200) / 100));
  const currentXp = stats.xp || 720;
  const targetXp = 1000;
  const xpPercent = Math.min(100, Math.round((currentXp / targetXp) * 100));

  return (
    <div className="min-h-screen bg-[#FFFDF7] text-slate-800 pb-28 select-none">
      {/* Top Header */}
      <div className="sticky top-0 z-30 bg-[#FFFDF7]/95 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-amber-100/50">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full flex items-center justify-center text-slate-700 hover:bg-amber-100/60 active:scale-95 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-base font-bold text-slate-900">Profil</span>
        <button
          onClick={() => setActiveModal('settings')}
          className="w-10 h-10 rounded-full flex items-center justify-center text-slate-700 hover:bg-amber-100/60 active:scale-95 transition"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      <div className="max-w-md mx-auto px-5 pt-4 space-y-6">
        {/* User Card matching Screen 8 */}
        <div className="flex flex-col items-center text-center pt-2">
          {/* Avatar with dynamic costume badge from Shop */}
          <div className="relative mb-3 filter drop-shadow-md">
            <KnowzaAvatar size="2xl" costume={stats.selectedCostume} animate="dance" />
            {/* Verified badge */}
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#FFB800] border-2 border-white flex items-center justify-center shadow-md">
              <Check className="w-4 h-4 text-slate-900 stroke-[3]" />
            </div>
          </div>

          {/* Name & Editing */}
          {isEditingName ? (
            <div className="flex items-center gap-2 mb-1">
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="px-3 py-1 bg-white border-2 border-amber-400 rounded-xl font-extrabold text-lg text-slate-900 text-center w-36 outline-none shadow-inner"
                autoFocus
              />
              <button
                onClick={handleSaveName}
                className="px-2.5 py-1 bg-amber-400 hover:bg-amber-500 rounded-xl text-xs font-bold text-slate-900 shadow-sm"
              >
                Kaydet
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditingName(true)}
              className="group flex items-center gap-1.5 text-xl font-extrabold text-slate-900 hover:text-amber-600 transition"
            >
              <span>{stats.username || 'Öğrenci'}</span>
              <Edit3 className="w-4 h-4 text-slate-400 group-hover:text-amber-500 transition" />
            </button>
          )}

          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 mb-2">
            <span>Seviye {currentLevel}</span>
            <span>•</span>
            <span className="text-amber-700 font-bold truncate max-w-[140px]">
              {stats.email || 'Öğrenci'}
            </span>
            <span>•</span>
            <span className="text-amber-800 font-extrabold uppercase">
              {stats.targetGoal || 'YKS'}
            </span>
          </div>

          {/* XP Progress Bar (720 / 1.000 XP) */}
          <div className="w-full max-w-xs space-y-1">
            <div className="w-full bg-[#ECE7DC] h-3 rounded-full overflow-hidden p-0.5">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-[#FFB800] rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${xpPercent}%` }}
              />
            </div>
            <div className="text-[12px] font-bold text-slate-500 text-center">
              {currentXp.toLocaleString()} / {targetXp.toLocaleString()} XP
            </div>
          </div>
        </div>

        {/* Menu Items matching Screen 8 */}
        <div className="bg-white rounded-3xl p-2 shadow-sm border border-amber-100/70 divide-y divide-amber-50">
          {/* Hedef Değiştirme */}
          {onOpenOnboarding && (
            <button
              onClick={onOpenOnboarding}
              className="w-full flex items-center justify-between p-3.5 hover:bg-amber-50/60 rounded-2xl transition text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#FFB800] to-amber-400 text-slate-900 flex items-center justify-center shadow-xs">
                  <Compass className="w-5 h-5 text-slate-900" />
                </div>
                <div>
                  <span className="text-sm font-black text-slate-900 block">Hedef Sınavım</span>
                  <span className="text-[11px] font-bold text-amber-800">
                    🎯 {stats.targetGoal?.toUpperCase() || 'YKS'} ({stats.dailyGoalQuestions || 25} Soru/Gün)
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[11px] font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
                  Değiştir
                </span>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          )}

          {/* Profil Bilgileri */}
          <button
            onClick={() => setActiveModal('profileInfo')}
            className="w-full flex items-center justify-between p-3.5 hover:bg-amber-50/60 rounded-2xl transition text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100/70 text-amber-900 flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <span className="text-sm font-bold text-slate-800">Profil Bilgileri</span>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </button>

          {/* Dil Tercihleri */}
          <button
            onClick={() => setActiveModal('languages')}
            className="w-full flex items-center justify-between p-3.5 hover:bg-amber-50/60 rounded-2xl transition text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-100/70 text-purple-700 flex items-center justify-center">
                <Globe className="w-5 h-5" />
              </div>
              <span className="text-sm font-bold text-slate-800">Dil Tercihleri</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-400">Türkçe / İngilizce</span>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </div>
          </button>

          {/* Bildirimler (Toggle Switch) */}
          <div className="w-full flex items-center justify-between p-3.5 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100/70 text-amber-800 flex items-center justify-center">
                <Bell className="w-5 h-5" />
              </div>
              <span className="text-sm font-bold text-slate-800">Bildirimler</span>
            </div>
            <button
              onClick={() => {
                soundSystem.playClick();
                setNotificationsEnabled(!notificationsEnabled);
              }}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notificationsEnabled ? 'bg-[#FFB800]' : 'bg-slate-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform ${
                  notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Hesap Ayarları */}
          <button
            onClick={() => (onOpenAuth ? onOpenAuth() : setActiveModal('account'))}
            className="w-full flex items-center justify-between p-3.5 hover:bg-amber-50/60 rounded-2xl transition text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-bold text-slate-800 block">Hesap Ayarları</span>
                <span className="text-[11px] font-medium text-slate-400">
                  {!stats.isLoggedIn ? 'Misafir Hesabı (Google ile bağla)' : stats.email || 'Giriş yapıldı'}
                </span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </button>

          {/* Yardım & Destek */}
          <button
            onClick={() => setActiveModal('help')}
            className="w-full flex items-center justify-between p-3.5 hover:bg-amber-50/60 rounded-2xl transition text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
                <HelpCircle className="w-5 h-5" />
              </div>
              <span className="text-sm font-bold text-slate-800">Yardım & Destek</span>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Logout or Account Action */}
        {stats.isLoggedIn ? (
          <button
            onClick={() => {
              logoutUser();
              soundSystem.playClick();
            }}
            className="w-full py-3 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs flex items-center justify-center gap-2 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Hesaptan Çıkış Yap</span>
          </button>
        ) : (
          <button
            onClick={onOpenAuth}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-[#FFB800] text-slate-900 font-extrabold text-sm shadow-md active:scale-95 transition flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Google veya E-posta ile Kaydol / Giriş Yap</span>
          </button>
        )}
      </div>

      {/* Info & Settings Modal */}
      {activeModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-amber-100 text-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            <h4 className="text-lg font-black text-slate-900 mb-3">
              {activeModal === 'profileInfo' && 'Profil Bilgileri 👤'}
              {activeModal === 'languages' && 'Dil Tercihleri 🌍'}
              {activeModal === 'settings' && 'Uygulama & Ses Ayarları ⚙️'}
              {activeModal === 'help' && 'Yardım & Destek 💬'}

            </h4>

            {activeModal === 'settings' ? (
              <div className="space-y-4 mb-5">
                {/* Background Music Toggle */}
                <div className="flex items-center justify-between p-3 bg-amber-50/70 rounded-2xl border border-amber-200/60">
                  <div>
                    <span className="font-extrabold text-sm text-slate-900 block">Arka Plan Müziği 🎵</span>
                    <span className="text-[11px] font-semibold text-slate-500">Sakinleştirici odaklanma melodisi</span>
                  </div>
                  <button
                    onClick={() => {
                      const newState = soundSystem.toggleBgm();
                      setBgmOn(newState);
                    }}
                    className={`w-12 h-7 rounded-full transition-colors relative p-1 ${
                      bgmOn ? 'bg-[#FFB800]' : 'bg-slate-300'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                        bgmOn ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Sound Effects (SFX) Toggle */}
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-200/60">
                  <div>
                    <span className="font-extrabold text-sm text-slate-900 block">Ses Efektleri 🔔</span>
                    <span className="text-[11px] font-semibold text-slate-500">Doğru, yanlış ve kutlama sesleri</span>
                  </div>
                  <button
                    onClick={() => {
                      const newState = soundSystem.toggleSfx();
                      setSfxOn(newState);
                    }}
                    className={`w-12 h-7 rounded-full transition-colors relative p-1 ${
                      sfxOn ? 'bg-[#FFB800]' : 'bg-slate-300'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                        sfxOn ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Daily Notifications Toggle */}
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-200/60">
                  <div>
                    <span className="font-extrabold text-sm text-slate-900 block">Günlük Hatırlatıcı ⏰</span>
                    <span className="text-[11px] font-semibold text-slate-500">Serini koruman için günde 1 bildirim</span>
                  </div>
                  <button
                    onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                    className={`w-12 h-7 rounded-full transition-colors relative p-1 ${
                      notificationsEnabled ? 'bg-[#FFB800]' : 'bg-slate-300'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                        notificationsEnabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            ) : activeModal === 'profileInfo' ? (
              <div className="space-y-2.5 mb-5 text-xs text-slate-700 bg-amber-50/60 p-4 rounded-2xl border border-amber-200/60">
                <div className="flex justify-between py-1 border-b border-amber-200/40">
                  <span className="font-bold text-slate-500">Öğrenci Adı:</span>
                  <span className="font-black text-slate-900">{stats.username || 'Öğrenci'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-amber-200/40">
                  <span className="font-bold text-slate-500">Hesap E-postası:</span>
                  <span className="font-black text-slate-900">{stats.email || 'Giriş yapılmadı'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-amber-200/40">
                  <span className="font-bold text-slate-500">Giriş Türü:</span>
                  <span className="font-black text-amber-900 uppercase">{stats.authProvider || 'Misafir'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-amber-200/40">
                  <span className="font-bold text-slate-500">Öncelikli Hedef:</span>
                  <span className="font-black text-amber-900">{stats.targetGoal?.toUpperCase() || 'YKS'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-amber-200/40">
                  <span className="font-bold text-slate-500">Günlük Hedef:</span>
                  <span className="font-black text-amber-800">{stats.dailyGoalQuestions || 25} Soru / gün</span>
                </div>
                <div className="flex justify-between py-1 border-b border-amber-200/40">
                  <span className="font-bold text-slate-500">Toplam XP & Seviye:</span>
                  <span className="font-black text-slate-900">{stats.xp} XP • Seviye {currentLevel}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="font-bold text-slate-500">Günlük Seri:</span>
                  <span className="font-black text-amber-600">🔥 {stats.streak} Gün</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-600 mb-5 leading-relaxed">
                {activeModal === 'languages' &&
                  'Knowza üzerinde Türkçe, İngilizce, Almanca ve Fransızca dilleri arasında pratik yapabilirsiniz.'}
                {activeModal === 'help' &&
                  'Herhangi bir sorun için destek@knowza.app üzerinden bizimle 7/24 iletişime geçebilirsiniz.'}
              </p>
            )}

            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-3 rounded-2xl bg-[#FFB800] text-slate-900 font-extrabold text-sm shadow-sm active:scale-95 transition"
            >
              Tamam
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
