import { EducationalVideo } from '../types';

export const VIDEO_RESOURCES: EducationalVideo[] = [
  // YKS / TYT
  {
    id: 'vid-yks-1',
    category: 'yks',
    title: 'TYT Matematik: Temel Kavramlar & Hızlı Soru Çözümü',
    channel: 'Akademi Açık Ders (MEB Destekli & Khan Academy TR)',
    duration: '18:45',
    youtubeId: 'videoseries?list=PL2_mG35E_U1Lw0Q4R0Xw5v_q43',
    description: 'Sayı kümeleri, tek-çift sayılar ve pozitif-negatif sayıların püf noktaları ile pratik çözümler.',
    tags: ['TYT', 'Matematik', 'Temel Kavramlar', 'Hızlı Net']
  },
  {
    id: 'vid-yks-2',
    category: 'yks',
    title: 'TYT Türkçe: Paragrafta 40/40 Yapma Taktikleri',
    channel: 'Açık Öğrenim & Rehberlik',
    duration: '22:10',
    youtubeId: 'videoseries?list=PLparagraf_taktikleri_tr',
    description: 'Paragrafı baştan sona okumadan anahtar kelimeleri tespit ederek doğru şıkkı saniyeler içinde bulma.',
    tags: ['Paragraf', 'Türkçe', 'TYT 2025', 'Zaman Yönetimi']
  },

  // KODLAMA
  {
    id: 'vid-kod-1',
    category: 'kodlama',
    title: 'Sıfırdan Python Dersleri (30 Dakikada Temeller)',
    channel: 'Açık Kaynak Kod Dünyası',
    duration: '32:15',
    youtubeId: 'videoseries?list=PLpython_temelleri_tr',
    description: 'Değişkenler, döngüler, fonksiyonlar ve mini proje geliştirme adımları.',
    tags: ['Python', 'Yazılım', 'Sıfırdan Kodlama', 'Algoritma']
  },
  {
    id: 'vid-kod-2',
    category: 'kodlama',
    title: 'Algoritmik Düşünme & Problem Çözme Becerisi',
    channel: 'Bilgisayar Bilimleri Platformu',
    duration: '15:20',
    youtubeId: 'videoseries?list=PLalgoritmalar_giris',
    description: 'Bir yazılımcı gibi düşünmek: Akış şemaları, mantık hatalarını çözme ve Big O gösterimi.',
    tags: ['Algoritma', 'Big O', 'Yazılımcı Kafası']
  },

  // KPSS
  {
    id: 'vid-kpss-1',
    category: 'kpss',
    title: 'KPSS Tarih: Kurtuluş Savaşı ve İnkılap Tarihi Özet',
    channel: 'Kamu Akademisi Açık Kaynak',
    duration: '25:40',
    youtubeId: 'videoseries?list=PLkpss_tarih_ozet',
    description: 'Milli Mücadele kongreleri, cepheler ve sınavda en çok soru getiren kilit maddeler.',
    tags: ['KPSS', 'Tarih', 'Genel Kültür', 'Milli Mücadele']
  },
  {
    id: 'vid-kpss-2',
    category: 'kpss',
    title: 'KPSS Anayasa: Temel Hukuk Kavramları Hafıza Teknikleri',
    channel: 'Hukuk Rehberi TR',
    duration: '19:50',
    youtubeId: 'videoseries?list=PLanayasa_hukuk_tr',
    description: 'Yasama, yürütme, yargı organları ve hak arama hürriyeti şemaları.',
    tags: ['Anayasa', 'Vatandaşlık', 'KPSS GYGK']
  },

  // LGS
  {
    id: 'vid-lgs-1',
    category: 'lgs',
    title: 'LGS Matematik: Yeni Nesil EBOB-EKOK Soru Avcısı',
    channel: 'Ortaokul Matematik Atölyesi',
    duration: '21:05',
    youtubeId: 'videoseries?list=PLlgs_ebob_ekok',
    description: 'Şekilli ve hikayeli yeni nesil LGS matematik sorularını adım adım deşifre etme.',
    tags: ['LGS', 'EBOB-EKOK', 'Yeni Nesil', '8. Sınıf']
  },

  // DİL (İNGİLİZCE)
  {
    id: 'vid-dil-1',
    category: 'dil',
    title: 'Günlük İngilizce: En Çok Kullanılan 100 Kalıp & Telaffuz',
    channel: 'Global English Free Lab',
    duration: '28:10',
    youtubeId: 'videoseries?list=PLingilizce_konusma_a1',
    description: 'Yurt dışında veya günlük hayatta anında işinize yarayacak akıcı konuşma kalıpları.',
    tags: ['İngilizce', 'A1-A2', 'Speaking', 'Pratik']
  }
];
