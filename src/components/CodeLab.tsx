import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Terminal, Play, CheckCircle2, XCircle, RotateCcw, Lightbulb, Sparkles, Code2, Award } from 'lucide-react';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Mascot } from './Mascot';

interface CodeChallenge {
  id: string;
  title: string;
  language: 'python' | 'javascript';
  level: 'Başlangıç' | 'Orta' | 'İleri';
  description: string;
  instructions: string[];
  initialCode: string;
  solutionHint: string;
  testCases: { input: string; expected: string }[];
  expectedOutputRegex: RegExp;
  xpReward: number;
  gemReward: number;
}

const CODING_CHALLENGES: CodeChallenge[] = [
  {
    id: 'ch-1',
    title: '1. Sayının Karesini Hesaplayan Fonksiyon',
    language: 'python',
    level: 'Başlangıç',
    description: 'Python\'da bir fonksiyon tanımlayıp parametre olarak gelen sayının karesini (sayi * sayi) döndürün.',
    instructions: [
      'def kare_al(sayi): fonksiyonunu tamamlayın.',
      'return sayi * sayi veya sayi ** 2 ifadesini kullanın.',
      'print(kare_al(5)) çıktısının 25 olduğunu doğrulayın.'
    ],
    initialCode: `# Coddy.tech Tarzı İnteraktif Kodlama
def kare_al(sayi):
    # KODUNU BURAYA YAZ
    return sayi * sayi

# Test Çıktısı:
print("5'in karesi:", kare_al(5))
print("8'in karesi:", kare_al(8))
`,
    solutionHint: 'return sayi ** 2 veya return sayi * sayi yazabilirsiniz.',
    testCases: [
      { input: 'kare_al(5)', expected: '25' },
      { input: 'kare_al(8)', expected: '64' }
    ],
    expectedOutputRegex: /25[\s\S]*64/,
    xpReward: 35,
    gemReward: 15
  },
  {
    id: 'ch-2',
    title: '2. Çift Sayı Filtreleme (Algoritma)',
    language: 'python',
    level: 'Orta',
    description: 'Verilen listedeki çift sayıları yeni bir listeye ekleyen algoritmayı kurun.',
    instructions: [
      'Bir sayının çift olduğunu anlamak için % 2 == 0 kullanılır.',
      'ciftler.append(sayi) fonksiyonunu çağırın.'
    ],
    initialCode: `# Çift sayıları filtrele
sayilar = [1, 2, 3, 4, 5, 6, 7, 8]
ciftler = []

for s in sayilar:
    if s % 2 == 0:
        ciftler.append(s)

print("Çift Sayılar:", ciftler)
`,
    solutionHint: 'if s % 2 == 0 koşulunu kontrol edip ciftler.append(s) yapmalısınız.',
    testCases: [
      { input: 'sayilar = [1, 2, 3, 4, 5, 6, 7, 8]', expected: '[2, 4, 6, 8]' }
    ],
    expectedOutputRegex: /\[2,\s*4,\s*6,\s*8\]/,
    xpReward: 40,
    gemReward: 20
  },
  {
    id: 'ch-3',
    title: '3. JavaScript: Kelime Ters Çevirici',
    language: 'javascript',
    level: 'Başlangıç',
    description: 'Bir metni tersine çeviren JavaScript fonksiyonu yazın.',
    instructions: [
      'str.split("").reverse().join("") yöntemini veya bir döngü kullanın.'
    ],
    initialCode: `function tersCevir(kelime) {
    return kelime.split("").reverse().join("");
}

console.log(tersCevir("kod"));
console.log(tersCevir("akademi"));
`,
    solutionHint: 'kelime.split("").reverse().join("") ifadesi tek satırda çözer!',
    testCases: [
      { input: 'tersCevir("kod")', expected: 'dok' },
      { input: 'tersCevir("akademi")', expected: 'imedaka' }
    ],
    expectedOutputRegex: /dok[\s\S]*imedaka/,
    xpReward: 45,
    gemReward: 20
  }
];

export const CodeLab: React.FC = () => {
  const { completeLesson } = useGame();
  const [selectedChallengeIndex, setSelectedChallengeIndex] = useState(0);
  const challenge = CODING_CHALLENGES[selectedChallengeIndex];

  const [userCode, setUserCode] = useState(challenge.initialCode);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [testResults, setTestResults] = useState<{ passed: boolean; message: string }[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [challengeCompleted, setChallengeCompleted] = useState(false);

  // Switch Challenge
  const handleSelectChallenge = (index: number) => {
    sound.playClick();
    setSelectedChallengeIndex(index);
    const ch = CODING_CHALLENGES[index];
    setUserCode(ch.initialCode);
    setTerminalOutput([]);
    setTestResults([]);
    setShowHint(false);
    setChallengeCompleted(false);
  };

  // Run Code Simulation
  const handleRunCode = () => {
    sound.playClick();
    setIsRunning(true);
    setTerminalOutput(['$ Kodu çalıştırılıyor... Derleniyor...']);

    setTimeout(() => {
      setIsRunning(false);
      let simulatedLogs: string[] = [];
      let passed = false;

      // Check with regex against simulated interpreter
      if (challenge.expectedOutputRegex.test(userCode)) {
        simulatedLogs = [
          '>>> Python 3.11 Runtime Initialized',
          '>>> Çıktı:',
          challenge.id === 'ch-1' ? "5'in karesi: 25\n8'in karesi: 64" :
          challenge.id === 'ch-2' ? "Çift Sayılar: [2, 4, 6, 8]" : "dok\nimedaka",
          '>>> Kod 0 hatayla başarıyla tamamlandı. (Exit 0)'
        ];
        passed = true;
      } else {
        simulatedLogs = [
          '>>> Program Çalıştırıldı...',
          'HATA: Beklenen çıktılar tam olarak eşleşmedi.',
          'İpucu: Fonksiyon dönüş değerini (return) veya algoritmayı kontrol edin.'
        ];
        passed = false;
      }

      setTerminalOutput(simulatedLogs);

      // Evaluate Test Cases
      const tests = challenge.testCases.map((tc) => ({
        passed: passed,
        message: `${tc.input} ➔ Beklenen: ${tc.expected}`
      }));
      setTestResults(tests);

      if (passed) {
        sound.playVictory();
        confetti({ particleCount: 75, spread: 70 });
        setChallengeCompleted(true);
        completeLesson(challenge.id, challenge.xpReward, challenge.gemReward, 100);
      } else {
        sound.playWrong();
      }
    }, 600);
  };

  const handleReset = () => {
    sound.playClick();
    setUserCode(challenge.initialCode);
    setTerminalOutput([]);
    setTestResults([]);
  };

  return (
    <div className="flex-1 max-w-6xl mx-auto py-6 px-4 space-y-6 pb-24">
      
      {/* Coddy Header Banner */}
      <div className="bg-gradient-to-r from-gray-900 via-indigo-950 to-purple-950 rounded-3xl p-6 text-white shadow-xl border border-gray-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-purple-500/20 text-purple-300 border border-purple-500/30 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2">
              <Code2 className="w-3.5 h-3.5" />
              Coddy.tech Tarzı İnteraktif Kodlama
            </div>
            <h2 className="text-2xl sm:text-3xl font-black">Kodlama Laboratuvarı</h2>
            <p className="text-gray-300 text-xs sm:text-sm font-semibold mt-1">
              Canlı editörde kod yaz, testleri anında geç ve gerçek bir yazılımcı gibi düşün!
            </p>
          </div>
          <div className="text-5xl">💻</div>
        </div>

        {/* Challenge Selector Tabs */}
        <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-gray-800">
          {CODING_CHALLENGES.map((ch, idx) => (
            <button
              key={ch.id}
              onClick={() => handleSelectChallenge(idx)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                selectedChallengeIndex === idx
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              {ch.title.split('.')[0]}. Görev
            </button>
          ))}
        </div>
      </div>

      {/* Main Coding Layout: Left = Instructions & Tests, Right = Editor & Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (5 Cols): Task Instructions & Test Cases */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Instructions Card */}
          <div className="bg-white rounded-3xl p-5 border-2 border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-purple-600 bg-purple-50 px-2.5 py-1 rounded-lg">
                {challenge.level} Seviye
              </span>
              <div className="flex items-center gap-2 text-xs font-black text-amber-500">
                <span>+{challenge.xpReward} XP</span>
                <span className="text-blue-500">💎 +{challenge.gemReward}</span>
              </div>
            </div>

            <h3 className="font-black text-lg text-gray-800">{challenge.title}</h3>
            <p className="text-xs text-gray-600 font-medium leading-relaxed">{challenge.description}</p>

            <div className="bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 space-y-2">
              <h4 className="text-xs font-black uppercase text-gray-500">GÖREV ADIMLARI</h4>
              <ul className="text-xs text-gray-700 font-semibold space-y-1.5 list-disc list-inside">
                {challenge.instructions.map((ins, i) => (
                  <li key={i}>{ins}</li>
                ))}
              </ul>
            </div>

            {/* Hint Button */}
            <div>
              <button
                onClick={() => setShowHint(!showHint)}
                className="flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200"
              >
                <Lightbulb className="w-4 h-4" />
                {showHint ? 'İpucunu Kapat' : 'İpucu İste 💡'}
              </button>

              {showHint && (
                <div className="mt-2 p-3 bg-amber-50 border-2 border-amber-200 rounded-xl text-xs font-bold text-amber-900 animate-pop">
                  {challenge.solutionHint}
                </div>
              )}
            </div>
          </div>

          {/* Automated Test Cases Card */}
          <div className="bg-white rounded-3xl p-5 border-2 border-gray-200 shadow-sm space-y-3">
            <h4 className="font-black text-sm text-gray-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              Doğrulama Testleri (Test Cases)
            </h4>

            {testResults.length === 0 ? (
              <div className="text-xs text-gray-400 font-semibold py-3 text-center">
                Kodu çalıştırdığında test sonuçları burada yeşil onay alacak!
              </div>
            ) : (
              <div className="space-y-2">
                {testResults.map((tr, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-2.5 rounded-xl border-2 text-xs font-bold ${
                      tr.passed
                        ? 'bg-green-50 border-green-300 text-green-800'
                        : 'bg-red-50 border-red-300 text-red-800'
                    }`}
                  >
                    <span>{tr.message}</span>
                    {tr.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Mascot Cheering */}
          <Mascot
            size="sm"
            mood={challengeCompleted ? 'cheering' : 'thinking'}
            speech={challengeCompleted ? "Muhteşem! Testi başarıyla geçtin! 💻✨" : "Kod satırlarını dikkatlice oku, sen yaparsın!"}
          />
        </div>

        {/* Right Column (7 Cols): Code Editor & Virtual Terminal */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Editor Header Bar */}
          <div className="bg-[#1e1e1e] rounded-t-3xl px-4 py-3 border-b border-gray-800 flex items-center justify-between text-xs font-mono text-gray-400">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
              <span className="w-3 h-3 rounded-full bg-yellow-500 inline-block" />
              <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />
              <span className="ml-2 font-bold text-gray-300">
                main.{challenge.language === 'python' ? 'py' : 'js'}
              </span>
            </div>

            <button
              onClick={handleReset}
              className="text-gray-400 hover:text-white flex items-center gap-1 font-bold transition-colors"
              title="Kodu Sıfırla"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Sıfırla
            </button>
          </div>

          {/* Code Textarea with Dark Mode Styling */}
          <div className="relative bg-[#1e1e1e] border-x border-gray-800 font-mono text-sm">
            <textarea
              value={userCode}
              onChange={(e) => setUserCode(e.target.value)}
              rows={12}
              spellCheck={false}
              className="w-full bg-[#1e1e1e] text-green-400 p-4 focus:outline-none font-mono text-xs sm:text-sm resize-none leading-relaxed border-none"
            />
          </div>

          {/* Action Bar */}
          <div className="bg-[#252526] px-4 py-3 rounded-b-3xl border-t border-gray-800 flex items-center justify-between">
            <span className="text-[11px] font-mono text-gray-400">Ctrl/Cmd + Enter ile de çalıştır</span>
            <button
              disabled={isRunning}
              onClick={handleRunCode}
              className="bg-[#58cc02] hover:bg-[#46a302] text-white font-black text-xs px-5 py-2.5 rounded-xl border-b-4 border-[#46a302] active:border-b-0 active:translate-y-1 transition-all flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-white" />
              {isRunning ? 'Çalıştırılıyor...' : 'KODU ÇALIŞTIR & TEST ET'}
            </button>
          </div>

          {/* Virtual Terminal Output */}
          <div className="bg-[#0f172a] rounded-3xl p-4 border-2 border-gray-800 text-xs font-mono space-y-1">
            <div className="flex items-center gap-2 text-gray-400 pb-2 border-b border-gray-800 font-bold">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span>Konsol Çıktısı (Virtual Terminal)</span>
            </div>

            <div className="py-2 text-cyan-300 min-h-[90px] whitespace-pre-wrap leading-relaxed">
              {terminalOutput.length === 0 ? (
                <span className="text-gray-600">Henüz çıktı yok. 'Kodu Çalıştır' butonuna basın...</span>
              ) : (
                terminalOutput.map((line, i) => <div key={i}>{line}</div>)
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
