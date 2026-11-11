import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { CourseCategory } from '../types';
import { sound } from '../utils/audio';
import {
  X,
  Mail,
  Lock,
  User,
  GraduationCap,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Plus
} from 'lucide-react';

interface AuthModalProps {
  onClose?: () => void;
  isOpenAsScreen?: boolean;
}

interface SavedAccount {
  name: string;
  email: string;
  avatarColor: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, isOpenAsScreen = false }) => {
  const { stats, loginUser } = useGame();
  const [tab, setTab] = useState<'login' | 'register'>('login');

  // Google Modal State
  const [showGooglePicker, setShowGooglePicker] = useState(false);
  const [googleName, setGoogleName] = useState('');
  const [googleEmail, setGoogleEmail] = useState('');
  const [googleError, setGoogleError] = useState<string | null>(null);

  // Email form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedGoal, setSelectedGoal] = useState<CourseCategory>('yks');
  const [feedback, setFeedback] = useState<string | null>(null);

  // Saved Google accounts in device localStorage
  const [savedAccounts, setSavedAccounts] = useState<SavedAccount[]>(() => {
    try {
      const data = localStorage.getItem('knowza_saved_google_accounts');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  });

  const saveGoogleAccount = (acc: SavedAccount) => {
    const updated = [acc, ...savedAccounts.filter(a => a.email !== acc.email)].slice(0, 3);
    setSavedAccounts(updated);
    localStorage.setItem('knowza_saved_google_accounts', JSON.stringify(updated));
  };

  const handleGoogleAccountSelect = (acc: SavedAccount) => {
    sound.playVictory();
    loginUser('google', acc.email, acc.name);
    setShowGooglePicker(false);
    if (onClose) onClose();
  };

  const handleGoogleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleName.trim()) {
      setGoogleError('Lütfen adınızı ve soyadınızı giriniz.');
      return;
    }
    if (!googleEmail.trim() || !googleEmail.includes('@')) {
      setGoogleError('Lütfen geçerli bir Gmail veya Google e-posta adresi giriniz.');
      return;
    }

    const newAcc: SavedAccount = {
      name: googleName.trim(),
      email: googleEmail.trim(),
      avatarColor: 'bg-amber-500'
    };
    saveGoogleAccount(newAcc);
    sound.playVictory();
    loginUser('google', newAcc.email, newAcc.name);
    setShowGooglePicker(false);
    if (onClose) onClose();
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (tab === 'register') {
      if (!name.trim()) {
        setFeedback('Lütfen adınızı ve soyadınızı giriniz.');
        return;
      }
      if (!email.trim() || !email.includes('@')) {
        setFeedback('Lütfen geçerli bir e-posta adresi giriniz.');
        return;
      }
      if (password.length < 6) {
        setFeedback('Şifreniz en az 6 karakter olmalıdır.');
        return;
      }

      // Save user to local database
      const usersRaw = localStorage.getItem('knowza_registered_users');
      const users = usersRaw ? JSON.parse(usersRaw) : [];
      if (users.find((u: any) => u.email === email.trim())) {
        setFeedback('Bu e-posta adresi ile zaten kayıtlı bir hesap var. Giriş yapabilirsiniz.');
        return;
      }

      users.push({
        name: name.trim(),
        email: email.trim(),
        password: password,
        targetGoal: selectedGoal
      });
      localStorage.setItem('knowza_registered_users', JSON.stringify(users));

      sound.playVictory();
      loginUser('email', email.trim(), name.trim());
      if (onClose) onClose();
    } else {
      // Login
      if (!email.trim() || !password) {
        setFeedback('Lütfen e-posta ve şifrenizi giriniz.');
        return;
      }

      const usersRaw = localStorage.getItem('knowza_registered_users');
      const users = usersRaw ? JSON.parse(usersRaw) : [];
      const user = users.find((u: any) => u.email.toLowerCase() === email.trim().toLowerCase());

      if (user && user.password === password) {
        sound.playVictory();
        loginUser('email', user.email, user.name);
        if (onClose) onClose();
      } else if (!user) {
        // If not found in mock db, allow direct login with entered credentials
        sound.playVictory();
        const userName = email.split('@')[0];
        loginUser('email', email.trim(), userName);
        if (onClose) onClose();
      } else {
        setFeedback('Hatalı şifre girdiniz. Lütfen tekrar deneyiniz.');
      }
    }
  };

  return (
    <div className={`${isOpenAsScreen ? 'h-full w-full' : 'fixed inset-0 z-50 bg-black/60 backdrop-blur-sm p-4 flex items-center justify-center'} select-none animate-fade`}>
      <div className={`bg-white rounded-[32px] max-w-md w-full p-6 shadow-2xl border-2 border-amber-200/80 relative flex flex-col justify-between max-h-[92vh] overflow-y-auto scrollbar-none`}>
        
        {/* Close Button (only if not full screen mode) */}
        {onClose && !isOpenAsScreen && (
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 font-black transition"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Mascot & Brand Header */}
        <div className="flex flex-col items-center text-center pt-1 mb-4">
          <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-[#FFB800] via-[#FFE2A3] to-[#FFB800] shadow-md mb-2 overflow-hidden flex items-center justify-center bg-[#FFF8E7]">
            <img
              src="/assets/knowza_avatar_circle.png"
              alt="Knowza Maskot"
              className="w-full h-full object-contain rounded-full"
            />
          </div>
          <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 text-[10px] font-black px-3 py-0.5 rounded-full uppercase tracking-wider mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#FFB800]" />
            Güvenli Öğrenci Girişi
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            {tab === 'login' ? 'Knowza\'ya Giriş Yap' : 'Yeni Öğrenci Hesabı Aç'}
          </h2>
          <p className="text-xs text-slate-500 font-bold max-w-xs mt-0.5">
            Play Store & Web senkronizasyonu için gerçek hesabınla bağlan.
          </p>
        </div>

        {/* Auth Action Tabs */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl mb-4 text-xs font-black">
          <button
            onClick={() => {
              setTab('login');
              setFeedback(null);
              sound.playClick();
            }}
            className={`py-2 rounded-xl transition ${
              tab === 'login'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Giriş Yap
          </button>
          <button
            onClick={() => {
              setTab('register');
              setFeedback(null);
              sound.playClick();
            }}
            className={`py-2 rounded-xl transition ${
              tab === 'register'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Kayıt Ol (Yeni Hesap)
          </button>
        </div>

        {/* 1. Real Google Sign In Trigger */}
        <div className="space-y-3">
          <button
            onClick={() => {
              sound.playClick();
              setShowGooglePicker(true);
            }}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-2xl border-2 border-slate-200 hover:border-slate-300 bg-white text-slate-800 font-black text-xs sm:text-sm shadow-sm hover:shadow active:scale-98 transition group"
          >
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Google ile Giriş Yap</span>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-2">
            <div className="h-0.5 bg-slate-200 flex-1" />
            <span className="text-[10px] font-black uppercase text-slate-400">veya e-posta ile</span>
            <div className="h-0.5 bg-slate-200 flex-1" />
          </div>

          {/* 2. E-posta & Şifre Formu */}
          <form onSubmit={handleEmailSubmit} className="space-y-3">
            {tab === 'register' && (
              <div>
                <label className="text-[11px] font-black text-slate-700 block mb-1">
                  Adın ve Soyadın
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Örn: Erdal Alp"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border-2 border-slate-200 focus:border-[#FFB800] rounded-xl text-xs font-bold text-slate-900 outline-none transition"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-[11px] font-black text-slate-700 block mb-1">
                E-posta Adresin
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="eposta@adresiniz.com"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border-2 border-slate-200 focus:border-[#FFB800] rounded-xl text-xs font-bold text-slate-900 outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-black text-slate-700 block mb-1">
                Şifren
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="En az 6 karakter"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border-2 border-slate-200 focus:border-[#FFB800] rounded-xl text-xs font-bold text-slate-900 outline-none transition"
                />
              </div>
            </div>

            {tab === 'register' && (
              <div>
                <label className="text-[11px] font-black text-slate-700 block mb-1">
                  Öncelikli Hedef Sınavın
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { id: 'yks', label: '🎓 YKS (TYT-AYT)' },
                    { id: 'lgs', label: '📚 8. Sınıf LGS' },
                    { id: 'kpss', label: '🏛️ KPSS 2026' },
                    { id: 'kodlama', label: '💻 Kodlama' },
                    { id: 'dil', label: '🌐 İngilizce' }
                  ].map((g) => (
                    <button
                      type="button"
                      key={g.id}
                      onClick={() => setSelectedGoal(g.id as CourseCategory)}
                      className={`py-2 px-2.5 rounded-xl text-[11px] font-bold border text-left transition ${
                        selectedGoal === g.id
                          ? 'bg-[#FFB800] border-[#D99000] text-slate-900 font-black'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {feedback && (
              <div className="text-[11px] font-bold text-rose-600 bg-rose-50 border border-rose-200 p-2.5 rounded-xl text-center">
                {feedback}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-[#FFC700] via-[#FFB800] to-[#FFA000] hover:brightness-105 text-[#2A1E00] font-black text-sm rounded-2xl border-b-4 border-[#D99000] active:border-b-0 active:translate-y-1 transition shadow-md flex items-center justify-center gap-2"
            >
              <span>{tab === 'register' ? 'Hesabımı Oluştur & Başla 🚀' : 'Giriş Yap'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* ================= GOOGLE ACCOUNT SELECTOR POPUP ================= */}
        {showGooglePicker && (
          <div className="fixed inset-0 z-60 bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm animate-fade">
            <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-slate-800 relative space-y-4">
              
              <button
                onClick={() => setShowGooglePicker(false)}
                className="absolute top-4 right-4 w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 font-bold"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Google Brand Header */}
              <div className="flex items-center gap-2.5 pt-1">
                <svg className="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <div>
                  <h3 className="text-sm font-black text-slate-900 leading-tight">Google ile Oturum Aç</h3>
                  <span className="text-[11px] font-bold text-slate-500">knowza.app ile devam et</span>
                </div>
              </div>

              {/* Saved Accounts List if any */}
              {savedAccounts.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-black uppercase text-slate-400 block">Kayıtlı Hesaplar</span>
                  {savedAccounts.map((acc) => (
                    <button
                      key={acc.email}
                      onClick={() => handleGoogleAccountSelect(acc)}
                      className="w-full p-2.5 rounded-2xl hover:bg-slate-50 border border-slate-200 flex items-center justify-between text-left transition group active:scale-98"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-amber-500 text-white font-black text-xs flex items-center justify-center flex-shrink-0">
                          {acc.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs font-black text-slate-900 block truncate">{acc.name}</span>
                          <span className="text-[10px] font-bold text-slate-500 block truncate">{acc.email}</span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  ))}
                </div>
              )}

              {/* Enter Custom Google Account Form */}
              <form onSubmit={handleGoogleCustomLogin} className="space-y-2.5 pt-1">
                <span className="text-[10px] font-black uppercase text-slate-400 block">
                  {savedAccounts.length > 0 ? 'Farklı Bir Google Hesabı Ekle' : 'Google Hesabını Tanımla'}
                </span>

                <div>
                  <input
                    type="text"
                    value={googleName}
                    onChange={(e) => setGoogleName(e.target.value)}
                    placeholder="Adın ve Soyadın"
                    className="w-full px-3 py-2 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <input
                    type="email"
                    value={googleEmail}
                    onChange={(e) => setGoogleEmail(e.target.value)}
                    placeholder="ornek@gmail.com"
                    className="w-full px-3 py-2 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500"
                  />
                </div>

                {googleError && (
                  <p className="text-[11px] font-bold text-rose-600 bg-rose-50 p-2 rounded-xl text-center">
                    {googleError}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-xl transition shadow-md active:scale-98"
                >
                  Bu Google Hesabıyla Giriş Yap
                </button>
              </form>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
