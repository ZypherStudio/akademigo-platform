import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { X, Sparkles, Check, Mail, Lock, User, ShieldCheck, ArrowRight } from 'lucide-react';
import { HariboAvatar } from './HariboAvatar';
import { sound } from '../utils/audio';

interface AuthModalProps {
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const { stats, loginUser, logoutUser, updateUsername } = useGame();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState(stats.username || 'Ali');
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleGoogleLogin = () => {
    sound.playClick();
    loginUser('google', 'ali.yilmaz@gmail.com', nickname || 'Ali Yılmaz');
    onClose();
  };

  const handleEmailAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setFeedback('Lütfen e-posta ve şifrenizi giriniz.');
      return;
    }
    if (password.length < 4) {
      setFeedback('Şifreniz en az 4 karakter olmalıdır.');
      return;
    }
    loginUser('email', email, nickname || email.split('@')[0]);
    onClose();
  };

  const handleGuestSaveName = () => {
    const res = updateUsername(nickname);
    if (res.success) {
      setFeedback(`✅ Takma adın "${res.finalUsername}" olarak ayarlandı!`);
      setTimeout(() => onClose(), 1000);
    } else {
      setFeedback(res.error || 'Hata oluştu');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-fade select-none">
      <div className="bg-white dark:bg-[#1a2c35] rounded-3xl max-w-md w-full p-6 shadow-2xl border-2 border-gray-200 dark:border-[#2b3d45] relative animate-pop transition-colors duration-300">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center text-gray-500 font-black transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Mascot */}
        <div className="flex flex-col items-center text-center mb-5">
          <div className="p-2 bg-amber-50 dark:bg-amber-950/40 rounded-3xl border-2 border-amber-200 dark:border-amber-700 mb-2">
            <HariboAvatar size="xl" costume={stats.selectedCostume} animate="dance" />
          </div>
          <div className="inline-flex items-center gap-1.5 bg-green-100 dark:bg-green-950/50 text-green-800 dark:text-green-300 text-[11px] font-black px-3 py-0.5 rounded-full uppercase tracking-wider mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
            Öğrenci Giriş & Kimlik Kapısı
          </div>
          <h2 className="text-2xl font-black text-gray-800 dark:text-gray-100">
            {stats.isLoggedIn ? 'Öğrenci Profilin' : 'AkademiGO Hesabın'}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold max-w-xs mt-0.5">
            {stats.isLoggedIn 
              ? `${stats.email} ile giriş yapıldı. İlerlemen buluta kaydediliyor.`
              : 'Hesap açmadan istediğin testi çözebilirsin! Giriş yaparak puanlarını ve Haribo kostümlerini koru.'}
          </p>
        </div>

        {/* If Already Logged In */}
        {stats.isLoggedIn ? (
          <div className="space-y-4">
            <div className="bg-green-50 dark:bg-green-950/40 border-2 border-green-200 dark:border-green-800 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <div className="text-xs font-black text-green-800 dark:text-green-200">{stats.username}</div>
                <div className="text-[11px] text-green-700 dark:text-green-400 font-mono mt-0.5">{stats.email}</div>
                <span className="text-[10px] bg-green-500 text-white font-black px-2 py-0.5 rounded-full mt-1.5 inline-block">
                  {stats.authProvider === 'google' ? 'Google Doğrulandı' : 'E-posta Onaylı'}
                </span>
              </div>
              <Check className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>

            <button
              onClick={() => {
                logoutUser();
                onClose();
              }}
              className="w-full py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 text-gray-700 dark:text-gray-300 font-black text-xs rounded-2xl transition-all"
            >
              Çıkış Yap (Misafir Moduna Dön)
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Quick Google Sign In Button */}
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-[#202f36] text-gray-800 dark:text-gray-100 font-black text-xs sm:text-sm shadow-sm hover:shadow active:scale-98 transition-all"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Google ile 1 Tıkla Bağlan</span>
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-2">
              <div className="h-0.5 bg-gray-200 dark:bg-[#2b3d45] flex-1" />
              <span className="text-[10px] font-black uppercase text-gray-400">veya e-posta</span>
              <div className="h-0.5 bg-gray-200 dark:bg-[#2b3d45] flex-1" />
            </div>

            {/* Email & Password Form */}
            <form onSubmit={handleEmailAuth} className="space-y-3">
              <div>
                <label className="text-[11px] font-black text-gray-600 dark:text-gray-300 block mb-1">
                  Kullanıcı Adı (Benzersiz)
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="Örn: Ali"
                    className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-[#202f36] border-2 border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold text-gray-800 dark:text-gray-100 outline-none focus:border-[#1cb0f6]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-black text-gray-600 dark:text-gray-300 block mb-1">
                  E-Posta Adresi
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ornek@ogrenci.com"
                    className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-[#202f36] border-2 border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold text-gray-800 dark:text-gray-100 outline-none focus:border-[#1cb0f6]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-black text-gray-600 dark:text-gray-300 block mb-1">
                  Şifre
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-[#202f36] border-2 border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold text-gray-800 dark:text-gray-100 outline-none focus:border-[#1cb0f6]"
                  />
                </div>
              </div>

              {feedback && (
                <div className="text-[11px] font-bold text-red-500 bg-red-50 dark:bg-red-950/50 p-2 rounded-xl text-center">
                  {feedback}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-[#58cc02] hover:bg-[#46a302] text-white font-extrabold text-xs sm:text-sm rounded-xl border-b-4 border-[#46a302] active:border-b-0 active:translate-y-1 transition-all shadow-md"
              >
                Giriş Yap & Kaydet
              </button>
            </form>

            {/* Guest Quick Play Option */}
            <div className="pt-2 border-t border-gray-100 dark:border-[#2b3d45] text-center">
              <button
                type="button"
                onClick={handleGuestSaveName}
                className="text-xs font-extrabold text-gray-500 hover:text-[#1cb0f6] flex items-center justify-center gap-1 mx-auto transition-colors"
              >
                <span>Üye Olmadan "{nickname}" Olarak Hızlıca Oyna</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
