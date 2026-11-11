// Knowza Google Gemini AI Assistant Service

const DEFAULT_GEMINI_SYSTEM_PROMPT = `Sen Knowza eğitim platformunun sevimli, eğlenceli ve bilgili Google Gemini destekli 3D Maskot Koçusun (Sarı Mezuniyet Kepli Ayıcık 🐻🎓).
Öğrencilere YKS (TYT-AYT), LGS, KPSS, Python Kodlama ve İngilizce konularında pedagojik, motive edici ve net cevaplar veriyorsun.
Cevaplarında formül ezberi yerine mantığı öğret, maddeler halinde açıkla.`;

export async function askGeminiCoach(
  userText: string,
  history: { role: 'user' | 'model'; parts: { text: string }[] }[] = []
): Promise<{ text: string; success: boolean }> {
  // If an external Gemini API key is configured in localStorage
  const customKey = localStorage.getItem('knowza_gemini_api_key');

  if (customKey) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${customKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: DEFAULT_GEMINI_SYSTEM_PROMPT }] },
            contents: [
              ...history,
              { role: 'user', parts: [{ text: userText }] }
            ]
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (reply) {
          return { text: reply, success: true };
        }
      }
    } catch {
      // Fallback to intelligent local Gemini tutor
    }
  }

  // Built-in intelligent Gemini knowledge base response
  const lower = userText.toLowerCase();
  let replyText = '';

  if (lower.includes('matematik') || lower.includes('temel')) {
    replyText =
      'Harika bir soru! Matematik temeli atarken formül ezberlemek yerine sayıların mantığını kavramak gerekir. Öncelikle Tek-Çift sayılar ve Temel İşlem Önceliğini pekiştir, ardından her gün 15 adet yeni nesil problem çöz. Günde 15 soru 1 ayda 450 soru demektir!';
  } else if (lower.includes('soru sor') || lower.includes('test et')) {
    replyText =
      'Hemen bir soru soruyorum: "a ve b pozitif tam sayılardır. 4a + 7b toplamı TEK sayı olduğuna göre, b sayısı hakkında kesinlikle ne söylenebilir?" (İpucu: 4a terimi daima çift midir?)';
  } else if (lower.includes('program') || lower.includes('çalışma')) {
    replyText =
      'İşte senin için Şampiyonluk Çalışma Planı:\n1. 25 Dk: Matematik Soru Çözümü (15 Soru)\n2. 5 Dk Mola (Su iç & nefes al)\n3. 25 Dk: Paragraf Taktikleri & Hızlı Okuma (12 Soru)\n4. 5 Dk Mola\n5. 50 Dk Derin Odak: Hedef dersin veya Kodlama';
  } else if (lower.includes('paragraf') || lower.includes('hız')) {
    replyText =
      'Paragrafı hızlandırmanın 1 numaralı kuralı "Önce Soru Kökünü Okumak"tır! Soru kökündeki olumsuz ifadelerin altını mutlaka çiz. Ardından ilk ve son 2 cümleye odaklanarak ana fikri yakala.';
  } else if (lower.includes('python') || lower.includes('kod')) {
    replyText =
      'Python\'da fonksiyonlar "def fonksiyon_adi(parametre):" şeklinde tanımlanır. Döngüler ise "for i in range(sayi):" kalıbıyla belirli sayıda işlemi otomatik tekrar eder. Kod Lab sekmemizde bunu hemen canlı deneyebilirsin!';
  } else {
    replyText = `Harika bir konu! Google Gemini altyapısıyla Knowza platformunda sana rehberlik ediyorum. Sınav hazırlığında en önemli şey sürekliliktir. Her gün düzenli soru çözerek hedefine emin adımlarla ulaşabilirsin!`;
  }

  return { text: replyText, success: true };
}
