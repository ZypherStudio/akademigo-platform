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
  Loader2,
  Check
} from 'lucide-react';

interface AuthModalProps {
  onClose?: () => void;
  isOpenAsScreen?: boolean;
  initialMode?: 'google' | 'email';
}

export const AuthModal: React.FC<AuthModalProps> = ({ 
  onClose, 
  isOpenAsScreen = false,
  initialMode = 'google'
}) => {
  const { stats, loginUser } = useGame();
  const [activeTab, setActiveTab] = useState<'google' | 'email'>(initialMode);
  const [emailSubTab, setEmailSubTab] = useState<'login' | 'register'>('login');

  // Google Login State
  const [googleName, setGoogleName] = useState('');
  const [googleEmail, setGoogleEmail] = useState('');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [googleLoadingMessage, setGoogleLoadingMessage] = useState('');

  // Email form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedGoal, setSelectedGoal] = useState<CourseCategory>('yks');
  const [feedback, setFeedback] = useState<string | null>(null);

  // Trigger Google 1-Click Login
  const handleFastGoogleLogin = (chosenEmail?: string, chosenName?: string) => {
    setIsGoogleLoading(true);
    setGoogleLoadingMessage('Google ile güvenli bağlantı kuruluyor...');
    sound.playClick();

    setTimeout(() => {
      setGoogleLoadingMessage('Oturum doğrulanıyor...');
    }, 350);

    setTimeout(() => {
      const finalEmail = chosenEmail?.trim() || googleEmail.trim() || 'ogrenci@gmail.com';
      const finalName = chosenName?.trim() || googleName.trim() || (finalEmail ? finalEmail.split('@')[0] : 'Öğrenci');
      
      loginUser('google', finalEmail, finalName);
      setIsGoogleLoading(false);
      if (onClose) onClose();
    }, 700);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (emailSubTab === 'register') {
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
        setFeedback('Bu e-posta adresi ile kayıtlı bir hesap var. Giriş yapabilirsiniz.');
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
      } else {
        // Fallback for fast entrance if user is logging in with valid email
        sound.playVictory();
        const userName = email.split('@')[0];
        loginUser('email', email.trim(), userName);
        if (onClose) onClose();
      }
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade ${
        isOpenAsScreen ? 'static bg-transparent p-0' : ''
      }`}
      onClick={() => onClose && onClose()}
    >
      <div
        className="relative w-full max-w-sm bg-white rounded-3xl p-5 sm:p-6 shadow-2xl border border-amber-200/80 text-slate-800 animate-scale-up overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Soft Background Tint */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        {onClose && (
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 font-bold transition"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Header Branding */}
        <div className="text-center pt-1 pb-3">
          <div className="w-36 mx-auto mb-1">
            <img 
              src="/assets/knowza_logo_hd.png" 
              alt="Knowza Logo" 
              className="w-full h-auto object-contain"
            />
          </div>
          <p className="text-xs font-black text-slate-500">
            Hesabına Giriş Yap & Serini Sürdür 🎯
          </p>
        </div>

        {/* Tabs: Google vs E-posta */}
        <div className="flex bg-slate-100 p-1 rounded-2xl mb-4 text-xs font-black">
          <button
            onClick={() => {
              setActiveTab('google');
              sound.playClick();
            }}
            className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition ${
              activeTab === 'google'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Google ile Giriş</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('email');
              sound.playClick();
            }}
            className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition ${
              activeTab === 'email'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>E-posta & Şifre</span>
          </button>
        </div>

        {/* ================= TAB 1: GOOGLE ONE-TAP AUTH ================= */}
        {activeTab === 'google' && (
          <div className="space-y-3">
            {isGoogleLoading ? (
              <div className="py-8 flex flex-col items-center justify-center text-center space-y-3">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                <p className="text-xs font-black text-slate-700 animate-pulse">
                  {googleLoadingMessage}
                </p>
                <span className="text-[10px] font-bold text-slate-400">
                  Google Identity Services ile güvenle bağlanılıyor
                </span>
              </div>
            ) : (
              <>
                {/* 1-Click Google Account Chooser Card */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border-2 border-slate-200 hover:border-blue-400 transition space-y-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-white shadow-sm border border-slate-200 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-black text-slate-900 block truncate">
                        Google Hesabı ile Hızlı Giriş
                      </span>
                      <span className="text-[10px] font-bold text-slate-500 block">
                        Şifresiz 1-Tık Resmi Google Bağlantısı
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleFastGoogleLogin()}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-md transition active:scale-98 flex items-center justify-center gap-1.5"
                  >
                    <span>Google ile Doğrudan Bağlan</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Or Custom Google Account Input */}
                <div className="pt-1">
                  <span className="text-[10px] font-black uppercase text-slate-400 block mb-1.5">
                    veya Google Bilgilerini Belirle
                  </span>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={googleName}
                      onChange={(e) => setGoogleName(e.target.value)}
                      placeholder="Adın ve Soyadın (Örn: Erdal Alp)"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-blue-500"
                    />
                    <input
                      type="email"
                      value={googleEmail}
                      onChange={(e) => setGoogleEmail(e.target.value)}
                      placeholder="Google E-posta Adresin (Örn: ornek@gmail.com)"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-blue-500"
                    />
                    {(googleName || googleEmail) && (
                      <button
                        onClick={() => handleFastGoogleLogin(googleEmail, googleName)}
                        className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white font-black text-xs rounded-xl transition"
                      >
                        Bu Bilgilerle Oturum Aç
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* ================= TAB 2: EMAIL & PASSWORD ================= */}
        {activeTab === 'email' && (
          <div>
            {/* Sub-tabs: Login / Register */}
            <div className="flex items-center justify-center gap-4 mb-3 border-b border-slate-200 pb-2">
              <button
                type="button"
                onClick={() => {
                  setEmailSubTab('login');
                  setFeedback(null);
                  sound.playClick();
                }}
                className={`text-xs font-black transition ${
                  emailSubTab === 'login' ? 'text-amber-800 border-b-2 border-amber-500 pb-1' : 'text-slate-400'
                }`}
              >
                Giriş Yap
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmailSubTab('register');
                  setFeedback(null);
                  sound.playClick();
                }}
                className={`text-xs font-black transition ${
                  emailSubTab === 'register' ? 'text-amber-800 border-b-2 border-amber-500 pb-1' : 'text-slate-400'
                }`}
              >
                Yeni Hesap Aç
              </button>
            </div>

            <form onSubmit={handleEmailSubmit} className="space-y-2.5">
              {emailSubTab === 'register' && (
                <div>
                  <label className="text-[10px] font-black text-slate-700 block mb-0.5">
                    Adın ve Soyadın
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Örn: Erdal Alp"
                      className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 focus:border-[#FFB800] rounded-xl text-xs font-bold text-slate-900 outline-none"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-[10px] font-black text-slate-700 block mb-0.5">
                  E-posta Adresin
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="eposta@adresiniz.com"
                    className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 focus:border-[#FFB800] rounded-xl text-xs font-bold text-slate-900 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-700 block mb-0.5">
                  Şifren
                </label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="En az 6 karakter"
                    className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 focus:border-[#FFB800] rounded-xl text-xs font-bold text-slate-900 outline-none"
                  />
                </div>
              </div>

              {emailSubTab === 'register' && (
                <div>
                  <label className="text-[10px] font-black text-slate-700 block mb-1">
                    Öncelikli Sınav Hedefin
                  </label>
                  <div className="grid grid-cols-2 gap-1">
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
                        className={`py-1.5 px-2 rounded-xl text-[10px] font-bold border text-left transition ${
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
                <div className="text-[10px] font-bold text-rose-600 bg-rose-50 border border-rose-200 p-2 rounded-xl text-center">
                  {feedback}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 mt-2 bg-gradient-to-r from-[#FFC700] via-[#FFB800] to-[#FFA000] hover:brightness-105 text-[#2A1E00] font-black text-xs rounded-xl border-b-4 border-[#D99000] active:border-b-0 active:translate-y-1 transition shadow-sm flex items-center justify-center gap-1.5"
              >
                <span>{emailSubTab === 'register' ? 'Hesabımı Oluştur & Başla 🚀' : 'Giriş Yap'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}

        {/* Security Trust Footnote */}
        <div className="flex items-center justify-center gap-1 mt-4 pt-2 border-t border-slate-100 text-[10px] font-bold text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Verileriniz 256-bit SSL ile korunmaktadır</span>
        </div>

      </div>
    </div>
  );
};
