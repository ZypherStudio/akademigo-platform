import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { BookMarked, CheckCircle2, Trash2, RotateCcw, Sparkles, Filter, AlertTriangle } from 'lucide-react';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Mascot } from './Mascot';

export const ErrorNotebook: React.FC = () => {
  const { stats, removeMistake, clearAllMistakes } = useGame();
  const [selectedSubject, setSelectedSubject] = useState<string>('all');

  const mistakes = stats.errorList || [];

  const subjects = ['all', ...Array.from(new Set(mistakes.map(m => m.subject)))];

  const filteredMistakes = selectedSubject === 'all'
    ? mistakes
    : mistakes.filter(m => m.subject === selectedSubject);

  const handleClearMistake = (id: string) => {
    sound.playVictory();
    removeMistake(id);
    confetti({ particleCount: 50, spread: 60 });
  };

  return (
    <div className="flex-1 max-w-4xl mx-auto py-6 px-4 space-y-6 pb-24 select-none">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rose-500 via-pink-600 to-red-600 rounded-3xl p-6 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-black/20 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Aralıklı Tekrar (Spaced Repetition)
          </div>
          <h2 className="text-2xl sm:text-3xl font-black">Akıllı Hata Defteri</h2>
          <p className="text-white/90 text-xs sm:text-sm font-semibold mt-1">
            Yanlış yaptığın sorular burada toplanır. Tekrar çözüp hatalarını temizledikçe elmas ve XP kazanırsın!
          </p>
        </div>
        <div className="text-5xl animate-bounceSubtle">📕</div>
      </div>

      {/* Filter and Clear All Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border-2 border-gray-200 shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto">
          <Filter className="w-4 h-4 text-gray-400 ml-1" />
          {subjects.map(s => (
            <button
              key={s}
              onClick={() => {
                sound.playClick();
                setSelectedSubject(s);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                selectedSubject === s
                  ? 'bg-rose-50 text-rose-600 border border-rose-300 shadow-sm'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              {s === 'all' ? 'Tüm Hatalar' : s}
            </button>
          ))}
        </div>

        {mistakes.length > 0 && (
          <button
            onClick={() => {
              if (confirm('Tüm hata defterini temizlemek istediğine emin misin?')) {
                clearAllMistakes();
              }
            }}
            className="text-xs font-bold text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Tümünü Temizle
          </button>
        )}
      </div>

      {/* Mistakes List */}
      {filteredMistakes.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 border-2 border-gray-200 shadow-sm text-center max-w-md mx-auto space-y-4 animate-pop">
          <Mascot size="lg" mood="happy" speech="Tebrikler! Hata defterin tertemiz! Tüm eksiklerini kapattın! 🎉" />
          <h3 className="text-xl font-black text-gray-800">Hiç Hatan Kalmadı!</h3>
          <p className="text-xs font-semibold text-gray-500">
            Ders veya deneme çözerken yanlış yaparsan sistem otomatik olarak buraya kaydedecek.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMistakes.map(item => (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-5 border-2 border-rose-100 shadow-sm space-y-3 hover:border-rose-300 transition-all animate-pop"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg">
                  {item.subject}
                </span>
                <span className="text-[11px] font-bold text-gray-400">{item.addedAt}</span>
              </div>

              <h4 className="text-base font-bold text-gray-800 leading-snug">
                {item.prompt}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-bold">
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-800">
                  <span className="font-black block text-red-900 mb-0.5">Senin Verdiğin Cevap:</span>
                  {item.userAnswer || 'Hatalı Cevap'}
                </div>
                <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-green-800">
                  <span className="font-black block text-green-900 mb-0.5">Doğru Cevap:</span>
                  {item.correctAnswer}
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs font-semibold text-amber-900">
                <span className="font-black block mb-0.5">💡 Çözüm ve Püf Noktası:</span>
                {item.explanation}
              </div>

              <div className="flex items-center justify-end pt-2">
                <button
                  onClick={() => handleClearMistake(item.id)}
                  className="bg-[#58cc02] hover:bg-[#46a302] text-white font-black text-xs px-4 py-2.5 rounded-xl border-b-4 border-[#46a302] active:border-b-0 active:translate-y-1 transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>ÖĞRENDİM, HATAYI TEMİZLE (+5 XP)</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
