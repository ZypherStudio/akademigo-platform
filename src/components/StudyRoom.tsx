import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { VIDEO_RESOURCES } from '../data/videoResources';
import { Play, Pause, RotateCcw, Plus, Trash2, BookOpen, Clock, Video, Sparkles, ExternalLink } from 'lucide-react';
import { sound } from '../utils/audio';

export const StudyRoom: React.FC = () => {
  const { selectedCourseId, notes, addNote, deleteNote } = useGame();

  // Pomodoro Timer State
  const [timerMode, setTimerMode] = useState<25 | 5 | 50>(25);
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  // Video State
  const filteredVideos = VIDEO_RESOURCES.filter(v => v.category === selectedCourseId);
  const [activeVideo, setActiveVideo] = useState(filteredVideos[0] || VIDEO_RESOURCES[0]);

  // Note State
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');

  // Update active video when course changes
  useEffect(() => {
    const list = VIDEO_RESOURCES.filter(v => v.category === selectedCourseId);
    if (list.length > 0) {
      setActiveVideo(list[0]);
    }
  }, [selectedCourseId]);

  // Pomodoro countdown effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      sound.playVictory();
      alert('Tebrikler! Pomodoro seansını başarıyla tamamladın! 🎉');
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft]);

  const handleSetTimer = (minutes: 25 | 5 | 50) => {
    sound.playClick();
    setTimerMode(minutes);
    setTimeLeft(minutes * 60);
    setIsRunning(false);
  };

  const toggleTimer = () => {
    sound.playClick();
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    sound.playClick();
    setIsRunning(false);
    setTimeLeft(timerMode * 60);
  };

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim() || !noteContent.trim()) return;
    addNote(noteTitle, noteContent, selectedCourseId);
    setNoteTitle('');
    setNoteContent('');
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex-1 max-w-5xl mx-auto py-6 px-4 space-y-8 pb-24">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl p-6 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Odaklanma & Araştırma Alanı
            </div>
            <h2 className="text-2xl sm:text-3xl font-black">Ders Çalışma & Video Odası</h2>
            <p className="text-white/80 text-sm font-semibold mt-1">
              Telifsiz açık eğitim kaynakları, Pomodoro odak sayacı ve hızlı not alma defteri.
            </p>
          </div>
          <div className="text-5xl">📺</div>
        </div>
      </div>

      {/* Grid: Left = Video & Notes, Right = Pomodoro & Quick Guide */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 Cols): Curated Educational Videos & Notes */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Video Player Card */}
          <div className="bg-white dark:bg-[#1a2c35] rounded-3xl p-5 shadow-sm border-2 border-gray-200 dark:border-[#2b3d45] transition-colors duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Video className="w-6 h-6 text-red-500" />
                <h3 className="font-black text-gray-800 dark:text-gray-100 text-lg">Açık Ders Anlatımı</h3>
              </div>
              <span className="text-xs font-black text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/40 px-2.5 py-1 rounded-lg border border-green-200 dark:border-green-800">
                Açık Kaynak & Telifsiz
              </span>
            </div>

            {/* Embedded Player or Interactive Educational Viewer */}
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-900 border-2 border-gray-100 dark:border-gray-800 shadow-inner">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube-nocookie.com/embed/${activeVideo?.youtubeId || 'videoseries'}`}
                title={activeVideo?.title || 'Ders Anlatımı'}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Active Video Info */}
            {activeVideo && (
              <div className="mt-4">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-extrabold text-base text-gray-800 dark:text-gray-100">{activeVideo.title}</h4>
                  <span className="text-xs font-bold text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md whitespace-nowrap">
                    {activeVideo.duration}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1">{activeVideo.description}</p>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {activeVideo.tags.map((t, idx) => (
                    <span key={idx} className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded-md">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Other Videos in this course */}
            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-[#2b3d45]">
              <div className="text-xs font-black uppercase text-gray-400 dark:text-gray-500 mb-3">DİĞER DERS VİDEOLARI</div>
              <div className="space-y-2">
                {filteredVideos.map((vid) => (
                  <button
                    key={vid.id}
                    onClick={() => {
                      sound.playClick();
                      setActiveVideo(vid);
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl border-2 text-left transition-all ${
                      activeVideo?.id === vid.id
                        ? 'border-[#af72ff] bg-purple-50 dark:bg-purple-950/40 text-purple-900 dark:text-purple-200'
                        : 'border-gray-200 dark:border-[#2b3d45] hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-[#20343f] text-gray-700 dark:text-gray-200 bg-white dark:bg-[#202f36]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center text-purple-600 dark:text-purple-300 font-bold">
                        ▶
                      </div>
                      <div>
                        <div className="font-bold text-xs sm:text-sm">{vid.title}</div>
                        <div className="text-[11px] text-gray-400 dark:text-gray-500">{vid.channel}</div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-gray-400 dark:text-gray-500">{vid.duration}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Quick Study Notes (Defter) */}
          <div className="bg-white dark:bg-[#1a2c35] rounded-3xl p-5 shadow-sm border-2 border-gray-200 dark:border-[#2b3d45] transition-colors duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-indigo-500" />
                <h3 className="font-black text-gray-800 dark:text-gray-100 text-lg">Ders Notlarım</h3>
              </div>
              <span className="text-xs font-bold text-gray-400 dark:text-gray-500">{notes.length} Not Kayıtlı</span>
            </div>

            {/* Note Input Form */}
            <form onSubmit={handleCreateNote} className="space-y-3 mb-5">
              <input
                type="text"
                placeholder="Not Başlığı (örn. TYT Matematik Bölünebilme Kuralı)..."
                value={noteTitle}
                onChange={e => setNoteTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 dark:border-[#2b3d45] focus:border-indigo-500 focus:outline-none text-sm font-bold text-gray-800 dark:text-gray-100 bg-white dark:bg-[#202f36]"
              />
              <textarea
                placeholder="Önemli formülü, kilit cümleyi veya püf noktasını buraya yaz..."
                value={noteContent}
                onChange={e => setNoteContent(e.target.value)}
                rows={2}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 dark:border-[#2b3d45] focus:border-indigo-500 focus:outline-none text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-[#202f36]"
              />
              <button
                type="submit"
                disabled={!noteTitle.trim() || !noteContent.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-black text-xs px-4 py-2 rounded-xl border-b-4 border-indigo-800 active:border-b-0 active:translate-y-1 transition-all flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                Notu Kaydet
              </button>
            </form>

            {/* Notes List */}
            <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
              {notes.length === 0 ? (
                <div className="text-center py-6 text-gray-400 text-xs font-semibold">
                  Henüz bir ders notu eklemedin. Önemli bilgileri buraya kaydedebilirsin!
                </div>
              ) : (
                notes.map(note => (
                  <div key={note.id} className="p-3.5 bg-gray-50 dark:bg-[#202f36] border-2 border-gray-200 dark:border-[#2b3d45] rounded-2xl flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-xs text-gray-800 dark:text-gray-100">{note.title}</span>
                        <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500">{note.createdAt}</span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-300 font-medium mt-1 leading-relaxed">{note.content}</p>
                    </div>
                    <button
                      onClick={() => deleteNote(note.id)}
                      className="text-gray-400 hover:text-red-500 p-1 transition-colors"
                      title="Notu Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

          </div>

        </div>

        {/* Right Column (1 Col): Pomodoro Focus Timer & Quick Cheat Sheets */}
        <div className="space-y-6">
          
          {/* Pomodoro Timer */}
          <div className="bg-white dark:bg-[#1a2c35] rounded-3xl p-5 shadow-sm border-2 border-gray-200 dark:border-[#2b3d45] text-center transition-colors duration-300">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-red-500" />
              <h3 className="font-black text-gray-800 dark:text-gray-100 text-base">Pomodoro Odak Sayacı</h3>
            </div>

            {/* Preset Modes */}
            <div className="flex justify-center gap-2 mb-6">
              {[
                { label: '25 dk Odak', value: 25 },
                { label: '5 dk Mola', value: 5 },
                { label: '50 dk Derin', value: 50 }
              ].map(mode => (
                <button
                  key={mode.value}
                  onClick={() => handleSetTimer(mode.value as 25 | 5 | 50)}
                  className={`px-3 py-1 rounded-xl text-xs font-black transition-all ${
                    timerMode === mode.value
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>

            {/* Big Countdown Display */}
            <div className="text-5xl font-black text-gray-800 font-mono tracking-tight my-4">
              {formatTime(timeLeft)}
            </div>

            {/* Timer Controls */}
            <div className="flex justify-center gap-3 mt-6">
              <button
                onClick={toggleTimer}
                className={`flex-1 py-3 px-4 rounded-2xl font-black text-xs uppercase tracking-wider text-white border-b-4 transition-all flex items-center justify-center gap-2 ${
                  isRunning
                    ? 'bg-amber-500 hover:bg-amber-600 border-amber-700'
                    : 'bg-[#58cc02] hover:bg-[#46a302] border-[#46a302]'
                } active:border-b-0 active:translate-y-1`}
              >
                {isRunning ? (
                  <>
                    <Pause className="w-4 h-4 fill-white" /> Duraklat
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" /> Başlat
                  </>
                )}
              </button>

              <button
                onClick={resetTimer}
                className="p-3 rounded-2xl bg-gray-100 hover:bg-gray-200 border-b-4 border-gray-300 text-gray-600 active:border-b-0 active:translate-y-1 transition-all"
                title="Sıfırla"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Hızlı Formül & Sınav Taktikleri Kartı */}
          <div className="bg-amber-50 border-2 border-amber-200 rounded-3xl p-5">
            <h4 className="font-black text-amber-900 text-sm mb-3 flex items-center gap-2">
              ⚡ Sınav Kazandıran Taktikler
            </h4>
            <div className="space-y-3 text-xs text-amber-800 font-semibold leading-relaxed">
              <div className="bg-white/70 p-3 rounded-xl border border-amber-200">
                <span className="font-black text-amber-900 block mb-0.5">Turlama Tekniği:</span>
                Zorlandığın soruyla inatlaşma! Yanına işaret koyup ilk turda yapabildiğin tüm soruları çöz.
              </div>
              <div className="bg-white/70 p-3 rounded-xl border border-amber-200">
                <span className="font-black text-amber-900 block mb-0.5">Soru Kökünü Çiz:</span>
                "Değildir", "Olamaz", "Kesinlikle" gibi olumsuz kelimeleri mutlaka yuvarlak içine al.
              </div>
              <div className="bg-white/70 p-3 rounded-xl border border-amber-200">
                <span className="font-black text-amber-900 block mb-0.5">Kodlamada Küçük Adımlar:</span>
                Büyük algoritmayı önce kağıt üzerinde küçük fonksiyonlara ve parçalara ayır.
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
