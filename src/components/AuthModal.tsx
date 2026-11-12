import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { sound } from '../utils/audio';
import {
  listSavedAccounts,
  removeSavedAccount,
  SavedAccountSummary,
} from '../utils/accountStorage';
import {
  authenticateWithGoogleEmail,
  authenticateWithGoogleToken,
  loginWithEmailPassword,
  registerWithEmailPassword,
} from '../utils/apiClient';
import {
  getCustomGoogleClientId,
  resolveGoogleClientId,
  setCustomGoogleClientId,
  signInWithGoogleOAuth,
} from '../utils/googleOAuth';
import {
  X,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  Loader2,
  Flame,
  Swords,
  Trash2,
  Settings,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface AuthModalProps {
  onClose?: () => void;
  isOpenAsScreen?: boolean;
  initialMode?: 'google' | 'email';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  onClose,
  isOpenAsScreen = false,
  initialMode = 'google',
}) => {
  const { loginUser } = useGame();
  const [activeTab, setActiveTab] = useState<'google' | 'email'>(initialMode);
  const [emailSubTab, setEmailSubTab] = useState<'login' | 'register'>('login');

  // Google OAuth State
  const [googleClientId, setGoogleClientId] = useState<string>('');
  const [showOAuthSetup, setShowOAuthSetup] = useState<boolean>(false);
  const [clientIdDraft, setClientIdDraft] = useState<string>(() => getCustomGoogleClientId());
  const [googleEmail, setGoogleEmail] = useState<string>('');
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);
  const [googleLoadingMessage, setGoogleLoadingMessage] = useState<string>('');
  const [savedAccounts, setSavedAccounts] = useState<SavedAccountSummary[]>(() => listSavedAccounts());

  // Email form state (NO forced name field!)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    resolveGoogleClientId().then((id) => {
      setGoogleClientId(id);
    });
  }, []);

  const finishAuthLogin = (
    provider: 'google' | 'email',
    res: Awaited<ReturnType<typeof authenticateWithGoogleEmail>>
  ) => {
    if (!res.ok || !res.email) {
      sound.playWrong();
      setFeedback(res.error || 'Giriş yapılamadı.');
      return;
    }

    loginUser(provider, res.email, {
      username: res.googleName || '',
      googleSub: res.googleSub,
      avatarUrl: res.avatarUrl,
      existingStats: res.stats ?? null,
      existingNotes: res.notes ?? [],
      isNewAccount: res.isNewAccount,
    });
    if (onClose) onClose();
  };

  // Real Google Identity Services OAuth Popup
  const handleGoogleOAuthLogin = async () => {
    setFeedback(null);
    if (!googleClientId) {
      setFeedback('Önce aşağıdan Google OAuth Client ID girin veya e-posta adresinizle devam edin.');
      setShowOAuthSetup(true);
      return;
    }

    try {
      setIsGoogleLoading(true);
      setGoogleLoadingMessage('Google hesap seçici açılıyor...');
      sound.playClick();

      const profile = await signInWithGoogleOAuth(googleClientId);
      setGoogleLoadingMessage('Hesap ve kayıt verileri yükleniyor...');

      const res = await authenticateWithGoogleToken(profile.accessToken, profile);
      finishAuthLogin('google', res);
    } catch (err: any) {
      sound.playWrong();
      setFeedback(err?.message || 'Google ile giriş tamamlanamadı.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // Connect or resume real Google Email account (zero fake defaults!)
  const handleGoogleEmailLogin = async (targetEmail: string) => {
    setFeedback(null);
    const trimmed = targetEmail.trim();
    if (!trimmed) {
      setFeedback('Lütfen kendi Google e-posta adresini yaz (örn: adin@gmail.com).');
      return;
    }

    try {
      setIsGoogleLoading(true);
      setGoogleLoadingMessage('Hesap kontrol ediliyor & kayıt yükleniyor...');
      sound.playClick();

      const res = await authenticateWithGoogleEmail(trimmed);
      finishAuthLogin('google', res);
    } catch {
      sound.playWrong();
      setFeedback('Hesaba bağlanılırken hata oluştu.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleSaveCustomClientId = () => {
    setCustomGoogleClientId(clientIdDraft);
    setGoogleClientId(clientIdDraft.trim());
    setShowOAuthSetup(false);
    setFeedback(
      clientIdDraft.trim()
        ? 'Google OAuth Client ID kaydedildi! Artık Google pop-up ile giriş yapabilirsin.'
        : 'Özel Google Client ID temizlendi.'
    );
  };

  const handleRemoveSavedAccount = (targetEmail: string, e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playClick();
    removeSavedAccount(targetEmail);
    setSavedAccounts(listSavedAccounts());
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    setIsEmailLoading(true);

    try {
      if (emailSubTab === 'register') {
        const res = await registerWithEmailPassword(email, password);
        finishAuthLogin('email', res);
      } else {
        const res = await loginWithEmailPassword(email, password);
        finishAuthLogin('email', res);
      }
    } finally {
      setIsEmailLoading(false);
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
        className="relative w-full max-w-sm bg-white rounded-3xl p-5 sm:p-6 shadow-2xl border border-amber-200/80 text-slate-800 animate-scale-up overflow-y-auto max-h-[92dvh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

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
            İlerlemen, Düello ELO & Serin Hesabında Saklansın 🎯
          </p>
        </div>

        {/* Tabs: Google vs E-posta */}
        <div className="flex bg-slate-100 p-1 rounded-2xl mb-4 text-xs font-black">
          <button
            type="button"
            onClick={() => {
              setActiveTab('google');
              setFeedback(null);
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
            <span>Google Hesabı</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('email');
              setFeedback(null);
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

        {/* ================= TAB 1: GOOGLE AUTH ================= */}
        {activeTab === 'google' && (
          <div className="space-y-3">
            {isGoogleLoading ? (
              <div className="py-8 flex flex-col items-center justify-center text-center space-y-3">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                <p className="text-xs font-black text-slate-700 animate-pulse">
                  {googleLoadingMessage}
                </p>
                <span className="text-[10px] font-bold text-slate-400">
                  Kayıtlı ilerleme ve düello ELO verilerin eşitleniyor
                </span>
              </div>
            ) : (
              <>
                {/* Real Saved Accounts on This Device */}
                {savedAccounts.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-black uppercase text-slate-500 block">
                      Kayıtlı Hesaplarından Devam Et
                    </span>
                    <div className="space-y-1.5 max-h-40 overflow-y-auto pr-0.5">
                      {savedAccounts.map((acc) => (
                        <div
                          key={acc.email}
                          onClick={() => handleGoogleEmailLogin(acc.email)}
                          className="p-2.5 rounded-2xl bg-amber-50/70 hover:bg-amber-100/70 border-2 border-amber-200/80 hover:border-[#FFB800] transition cursor-pointer flex items-center justify-between gap-2 group"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            {acc.avatarUrl ? (
                              <img
                                src={acc.avatarUrl}
                                alt={acc.email}
                                className="w-9 h-9 rounded-full object-cover border border-amber-300 flex-shrink-0"
                              />
                            ) : (
                              <div className="w-9 h-9 rounded-full bg-white border border-amber-300 flex items-center justify-center text-xs font-black text-amber-800 flex-shrink-0">
                                {acc.email.slice(0, 2).toUpperCase()}
                              </div>
                            )}
                            <div className="min-w-0">
                              <span className="text-xs font-black text-slate-900 block truncate">
                                {acc.username || acc.email}
                              </span>
                              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                                {acc.username && (
                                  <span className="truncate max-w-[110px]">{acc.email}</span>
                                )}
                                <span className="flex items-center gap-0.5 text-amber-700">
                                  <Sparkles className="w-2.5 h-2.5" /> {acc.xp} XP
                                </span>
                                <span className="flex items-center gap-0.5 text-orange-600">
                                  <Flame className="w-2.5 h-2.5" /> {acc.streak}g
                                </span>
                                <span className="flex items-center gap-0.5 text-rose-600">
                                  <Swords className="w-2.5 h-2.5" /> {acc.eloRating}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 flex-shrink-0">
                            <button
                              type="button"
                              onClick={(e) => handleRemoveSavedAccount(acc.email, e)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                              title="Bu cihazdan kaldır"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                            <ArrowRight className="w-4 h-4 text-amber-700 group-hover:translate-x-0.5 transition" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Live Official Google OAuth Button (Active when GOOGLE_CLIENT_ID is configured) */}
                {googleClientId ? (
                  <button
                    type="button"
                    onClick={handleGoogleOAuthLogin}
                    className="w-full py-3 bg-white hover:bg-slate-50 text-slate-900 font-black text-xs rounded-2xl border-2 border-blue-500 shadow-sm transition active:scale-98 flex items-center justify-center gap-2.5"
                  >
                    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    <span>Google Hesabınla Giriş Yap</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  </button>
                ) : (
                  <div className="p-3.5 rounded-2xl bg-slate-50 border-2 border-slate-200 space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-white shadow-xs border border-slate-200 flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                          </svg>
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs font-black text-slate-900 block">
                            Google E-posta ile Bağlan
                          </span>
                          <span className="text-[10px] font-bold text-slate-500 block">
                            Kayıtların & düello ELO'n bu hesaba işlenir
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowOAuthSetup((v) => !v)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition"
                        title="Google OAuth Client ID Ayarla"
                      >
                        <Settings className="w-4 h-4" />
                      </button>
                    </div>

                    <input
                      type="email"
                      value={googleEmail}
                      onChange={(e) => setGoogleEmail(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleGoogleEmailLogin(googleEmail);
                      }}
                      placeholder="Kendi e-postanı yaz (örn: adin@gmail.com)"
                      className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-blue-500"
                    />

                    <button
                      type="button"
                      onClick={() => handleGoogleEmailLogin(googleEmail)}
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-sm transition active:scale-98 flex items-center justify-center gap-1.5"
                    >
                      <span>Hesaba Bağlan / Oluştur</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Collapsible Google OAuth Client ID Settings */}
                {(showOAuthSetup || googleClientId) && (
                  <div className="pt-1">
                    {googleClientId && !showOAuthSetup ? (
                      <button
                        type="button"
                        onClick={() => setShowOAuthSetup(true)}
                        className="text-[10px] font-bold text-slate-400 hover:text-slate-600 mx-auto block"
                      >
                        OAuth Client ID Ayarı
                      </button>
                    ) : (
                      <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-200 space-y-2 text-[10px]">
                        <p className="font-bold text-blue-900 leading-snug">
                          Canlı Google OAuth Pop-up için Google Cloud Web Client ID girin (veya Render ortamına{' '}
                          <code className="bg-white px-1 rounded">GOOGLE_CLIENT_ID</code> ekleyin):
                        </p>
                        <div className="flex gap-1.5">
                          <input
                            type="text"
                            value={clientIdDraft}
                            onChange={(e) => setClientIdDraft(e.target.value)}
                            placeholder="xxxx.apps.googleusercontent.com"
                            className="flex-1 min-w-0 px-2 py-1.5 rounded-lg border border-blue-200 bg-white text-[11px] font-bold text-slate-800 outline-none"
                          />
                          <button
                            type="button"
                            onClick={handleSaveCustomClientId}
                            className="px-2.5 py-1.5 bg-blue-600 text-white font-black rounded-lg text-[10px]"
                          >
                            Kaydet
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {feedback && (
                  <div className="text-[11px] font-bold text-rose-600 bg-rose-50 border border-rose-200 p-2.5 rounded-xl text-center">
                    {feedback}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ================= TAB 2: EMAIL & PASSWORD ================= */}
        {activeTab === 'email' && (
          <div>
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

            <form onSubmit={handleEmailSubmit} className="space-y-3">
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
                    className="w-full pl-8 pr-3 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#FFB800] rounded-xl text-xs font-bold text-slate-900 outline-none"
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
                    className="w-full pl-8 pr-3 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#FFB800] rounded-xl text-xs font-bold text-slate-900 outline-none"
                  />
                </div>
              </div>

              {feedback && (
                <div className="text-[11px] font-bold text-rose-600 bg-rose-50 border border-rose-200 p-2.5 rounded-xl text-center">
                  {feedback}
                </div>
              )}

              <button
                type="submit"
                disabled={isEmailLoading}
                className="w-full py-3 mt-1 bg-gradient-to-r from-[#FFC700] via-[#FFB800] to-[#FFA000] hover:brightness-105 disabled:opacity-60 text-[#2A1E00] font-black text-xs rounded-xl border-b-4 border-[#D99000] active:border-b-0 active:translate-y-1 transition shadow-sm flex items-center justify-center gap-1.5"
              >
                {isEmailLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>{emailSubTab === 'register' ? 'Hesabımı Oluştur & Sorulara Geç 🚀' : 'Giriş Yap'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Security Trust Footnote */}
        <div className="flex items-center justify-center gap-1 mt-4 pt-2 border-t border-slate-100 text-[10px] font-bold text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>İlerlemen, Düello ELO & Çerçevelerin Hesabına Kaydedilir</span>
        </div>
      </div>
    </div>
  );
};
