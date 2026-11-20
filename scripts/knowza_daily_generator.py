#!/usr/bin/env python3
"""
Knowza Günlük Tanıtım Animasyonu Üreticisi
Her çalıştırıldığında sıradaki Knowza tanıtım bölümünü ElevenLabs Türkçe seslendirme,
müzik/efekt miksajı ve 1080x1920 3D maskot animasyonu olarak MP4'e dönüştürür.
"""

import argparse
import base64
import datetime
import json
import os
import subprocess
import sys
from pathlib import Path
import requests

WORKSPACE = Path("/Users/erdalalp/başla")
OUT_DIR = WORKSPACE / "playstore-assets" / "daily"
ASSET_CACHE = WORKSPACE / "scripts" / "knowza_anim_assets"
FFMPEG = "/Users/erdalalp/.local/bin/ffmpeg"
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

ELEVENLABS_API_KEY = os.environ.get(
    "ELEVENLABS_API_KEY",
    "sk_9c264ac8268693c6a4120e09088c832d64108a623122fae8",
)
VOICE_ID = "TX3LPaxmHKxFdv7VOQHJ"  # Liam - Energetic Social Media Creator
TEST_GROUP_URL = "https://groups.google.com/g/knowza-test?pli=1"

MASCOT_SERIES = [
    {
        "slug": "erteleme-sendromu",
        "title": "Yarın Başlarım Diye Diye Hafta Bitti Mi? 😂🐻 #Shorts",
        "caption": (
            "\"Yarın kesin başlıyorum\" deyip yine erteleyenler burada mı? 😂🐻\n"
            "Knowza ayıcığınla günde sadece 5 dakika ayır, öğrenmeyi oyuna çevir! 🚀\n"
            f"Test kulübümüz: {TEST_GROUP_URL}\n\n"
            "#Knowza #Shorts #Reels #Animasyon #Maskot #Öğrenci #Motivasyon #Eğitim"
        ),
        "scenes": [
            {"headline": "Yarın Başlarım...", "sub": "Diye Diye Hafta Bitti Mi? 😂", "vo": "Yarın kesin başlarım diye diye yine bütün hafta bitti mi?"},
            {"headline": "Tanıdık Geldi!", "sub": "Erteleme Canavarı İş Başında 👀", "vo": "Merak etme, yalnız değilsin! Ama bu döngüyü kırmanın çok eğlenceli bir yolu var."},
            {"headline": "Sadece 5 Dakika!", "sub": "Kahve Molası Kadar Kısa ☕", "vo": "Saatlerce sıkıcı kitaplara bakmak yok! Günde sadece beş dakikanı ayırıyorsun."},
            {"headline": "Oyun Gibi Öğren!", "sub": "XP Kazan • Rozet Topla 🏆", "vo": "Her mini görevde puan topluyor, rozet kazanıyor ve farkında olmadan ilerliyorsun!"},
            {"headline": "Seri Başlasın!", "sub": "1. Gün -> 13. Seviye 🔥", "vo": "Bir bakmışsın on üçüncü seviyeye uçmuşsun bile!"},
            {"headline": "Knowza Kullan!", "sub": "Daha Fazlası İçin Hemen Katıl 🚀", "vo": "Daha fazlasını görmek ve eğlenerek öğrenmek istiyorsan Knowza kullan! Profildeki linkten test kulübümüze katıl!"},
        ],
    },
    {
        "slug": "altyazisiz-an",
        "title": "Altyazısız İzlerken Yaşanan O An 😅🎬 #Shorts",
        "caption": (
            "Altyazıyı kapatıp tek kelime anlamayınca yaşanan o minik şok 😅🎬\n"
            "Knowza ile günde 5 dakikada İngilizce pratiği yap! 🇬🇧🐻\n"
            f"Test kulübümüz: {TEST_GROUP_URL}\n\n"
            "#Knowza #Shorts #Reels #İngilizce #DilÖğren #Animasyon #Komik"
        ),
        "scenes": [
            {"headline": "O Büyük An!", "sub": "Altyazıyı Kapattığın An 😅", "vo": "Hani yabancı dizide altyazıyı kapatıp tek kelime anlamadığın o an var ya..."},
            {"headline": "Panik Yok!", "sub": "Knowza Ayıcığın Yanında 🐻", "vo": "İşte tam o anda panik yapmana hiç gerek yok!"},
            {"headline": "Mini Pratikler", "sub": "İngilizce • Seviye 1 • Ders 3 🇬🇧", "vo": "Knowza ile her gün üç dakikalık mini pratiklerle kelimeleri oyun gibi kapıyorsun."},
            {"headline": "Kulak Aşinalığı!", "sub": "Dinle • Eşleştir • Kazan 🧠", "vo": "Hem eğleniyor hem de günlük serini koruyarak kulak aşinalığı kazanıyorsun!"},
            {"headline": "Seviye Atla!", "sub": "+100 XP ile Hızlan ⚡", "vo": "Birkaç hafta sonra altyazıya bakmadan anladığını fark edeceksin!"},
            {"headline": "Aramıza Katıl!", "sub": "Knowza Özel Test Kulübü ✨", "vo": "Sen de ilk on iki test kullanıcımızdan biri ol, profildeki linkten hemen başvur!"},
        ],
    },
    {
        "slug": "dopamin-hilesi",
        "title": "Oyun Oynarken Saatler Geçiyor Da Ders Neden Bitmiyor? 🧠🎮 #Shorts",
        "caption": (
            "Oyun oynarken zaman su gibi akıyor ama ders başında 5 dakika geçmiyor mu? 🧠🎮\n"
            "Çünkü beynin ödül istiyor! Knowza ile öğrenmeye oyun mekaniği ekledik! 🏆🐻\n"
            f"Test kulübümüz: {TEST_GROUP_URL}\n\n"
            "#Knowza #Shorts #Reels #Animasyon #Oyunlaştırma #Eğitim #Bilgi"
        ),
        "scenes": [
            {"headline": "Garip Değil Mi?", "sub": "Oyunda 3 Saat = 5 Dakika 🎮", "vo": "Oyun oynarken üç saat beş dakika gibi geçiyor ama ders başında beş dakika bitmiyor, değil mi?"},
            {"headline": "Sırrı Ne?", "sub": "Beynin Ödül Sistemi 🧠", "vo": "Çünkü beynin anında ödül, seviye ve ilerleme görmek istiyor!"},
            {"headline": "Knowza Farkı!", "sub": "Her Doğru Cevapta Ödül ✨", "vo": "Biz de Knowza'yı tam olarak bu mantıkla tasarladık!"},
            {"headline": "Rozet & Seri!", "sub": "Dil • Beceri • Rozet • Seri 🔥", "vo": "Her derste XP kazanıyor, rozet topluyor ve günlük serini canlı tutuyorsun."},
            {"headline": "Seviye 13!", "sub": "+100 XP Kazandın! 🏆", "vo": "Öğrenmek artık zorunluluk değil, her gün açmak isteyeceğin bir oyuna dönüşüyor!"},
            {"headline": "Test Kulübü Açık!", "sub": "Sadece 12 Kişilik Kontenjan 🚀", "vo": "Hemen profildeki grup linkinden Knowza test kulübüne katıl!"},
        ],
    },
    {
        "slug": "sinav-gecesi-panik",
        "title": "Sınavdan Bir Gece Önce Konu Yetiştirmeye Çalışırken 😅📚 #Shorts",
        "caption": (
            "Sınavdan bir gece önce 300 sayfa notu 2 saatte bitirmeye çalışanlar burada mı? 😅📚\n"
            "Knowza yapay zeka koçunla son gece paniğine son! 🚀🐻\n"
            f"Test kulübümüz: {TEST_GROUP_URL}\n\n"
            "#Knowza #Shorts #YKS #LGS #KPSS #Sınav #Öğrenci #YapayZeka"
        ),
        "scenes": [
            {"headline": "Son Gece Paniği!", "sub": "Sabaha Kadar Kahve + Notlar ☕", "vo": "Sınavdan bir gece önce sabaha kadar kahve içip konu yetiştirmeye çalıştığın o an var ya..."},
            {"headline": "Artık Gerek Yok!", "sub": "Knowza Yapay Zeka Koçu 🤖", "vo": "Knowza'nın yapay zeka koçu senin hızına göre günlük mini planı zaten hazırlıyor!"},
            {"headline": "Hedef Sınavını Seç!", "sub": "YKS • LGS • KPSS • Ehliyet", "vo": "İster YKS, ister LGS, ister KPSS ya da ehliyet... Hepsi tek yerde!"},
            {"headline": "Kısa ve Net!", "sub": "Günde Sadece 10 Dakika ⚡", "vo": "Uzun sıkıcı tekrarlar yerine nokta atışı sorularla eksiklerini anında kapatıyorsun."},
            {"headline": "Sınav Hazır!", "sub": "+150 XP & Tam Özgüven 🏆", "vo": "Sınav sabahı stres değil, tam özgüvenle masaya oturuyorsun!"},
            {"headline": "Knowza Kullan!", "sub": "Yorumlara LİNK Yaz veya Bio'ya Bak 🚀", "vo": "Daha fazlası için Knowza kullan! Açıklamadaki test grubu linkinden hemen katıl!"},
        ],
    },
    {
        "slug": "ehliyet-stresi",
        "theme": "crimson",
        "visual": "comparison",
        "cards": [
            {"icon": "🚦", "title": "Trafik İşaretleri"},
            {"icon": "🚑", "title": "İlk Yardım"},
            {"icon": "🔧", "title": "Motor Bilgisi"},
            {"icon": "📝", "title": "Çıkmış Sorular"},
        ],
        "title": "Ehliyet Sınavında Herkesin Takıldığı O Sorular 🚗💨 #Shorts",
        "caption": (
            "Ehliyet sınavında 'kesin doğru' deyip şaşırtan o trafik soruları! 🚗💨\n"
            "Knowza ile ehliyet konularını oyun oynar gibi çöz, tek seferde geç! 🏆🐻\n"
            f"Test kulübümüz: {TEST_GROUP_URL}\n\n"
            "#Knowza #Shorts #Ehliyet #EhliyetSınavı #Trafik #Eğitim"
        ),
        "scenes": [
            {"headline": "Ehliyet Sınavı!", "sub": "İlk Yardım & Trafik Tuzakları 🚗", "vo": "Ehliyet sınavında tam eminim deyip şıklarda kaldığın o tuzak sorulara hazır mısın?"},
            {"headline": "Knowza Yanında!", "sub": "Sıkıcı PDF'lere Son ✨", "vo": "Sıkıcı soru bankalarını unut! Knowza ile ehliyete oyun gibi hazırlan."},
            {"headline": "Gerçek Denemeler", "sub": "Trafik • Motor • İlk Yardım 🚦", "vo": "Çıkmış sorular, anlık açıklamalar ve yapay zeka desteği cebinde!"},
            {"headline": "Hata Yok!", "sub": "Yanlışlarını Anında Öğren 🧠", "vo": "Yanlış yaptığın her soruyu ayıcığın senin için sade bir dille özetliyor."},
            {"headline": "Tek Seferde Geç!", "sub": "Serini Bozma, Puanı Kap 🔥", "vo": "Günlük serini koru, sınava tam hazır gir!"},
            {"headline": "Knowza Kullan!", "sub": "Test Grubu Linki Açıklamada 🚀", "vo": "Sen de ilk test kullanıcılarımızdan ol, açıklamadaki linkten hemen katıl!"},
        ],
    },
    {
        "slug": "feynman-teknigi",
        "theme": "ocean",
        "visual": "comparison",
        "cards": [
            {"icon": "📖", "title": "Konuyu Seç"},
            {"icon": "🧒", "title": "Basitçe Anlat"},
            {"icon": "🔍", "title": "Eksiğini Bul"},
            {"icon": "🤖", "title": "Knowza ile Pekiştir"},
        ],
        "title": "Bir Konuyu 5 Dakikada Anlamanın Sırrı: Feynman Tekniği 🧠✨ #Shorts",
        "caption": (
            "Okuduğun halde anlamıyorsan sorun sende değil, yöntemde! 🧠✨\n"
            "Feynman Tekniği ile konuyu çocuğa anlatır gibi sadeleştir — Knowza yapay zeka koçunla hemen uygula! 🚀\n"
            f"Test kulübümüz: {TEST_GROUP_URL}\n\n"
            "#Knowza #Shorts #FeynmanTekniği #DersÇalışma #YKS #LGS #VerimliÇalışma"
        ),
        "scenes": [
            {"headline": "Feynman Tekniği", "sub": "Nobel Ödüllü Öğrenme Sırrı 🧠", "vo": "Okuduğun konuyu bir türlü anlamıyorsan, Nobel ödüllü fizikçi Feynman'ın tekniğini dene!"},
            {"headline": "Kural Çok Basit!", "sub": "Bir Çocuğa Anlatır Gibi Özetle 🐻", "vo": "Bir konuyu en basit kelimelerle anlatamıyorsan, henüz tam anlamamışsın demektir."},
            {"headline": "Takıldığın Yeri Bul!", "sub": "Eksik Noktayı Anında Gör ⚡", "vo": "Anlatırken nerede takılırsan, geri dönüp sadece o boşluğu dolduruyorsun!"},
            {"headline": "Knowza Koçun!", "sub": "Konuyu Senin İçin Sadeleştirir 🤖", "vo": "Knowza yapay zeka koçu karmaşık konuları senin seviyene göre basitleştirip test ediyor!"},
            {"headline": "Kalıcı Öğrenme!", "sub": "+100 XP & Tam Hakimiyet 🏆", "vo": "Ezber yok, mantığını kavrayarak ilerleme var!"},
            {"headline": "Knowza Çok Yakında!", "sub": "Test Grubuna Katıl (Açıklamada) 🚀", "vo": "Daha fazlası için Knowza yakında Google Play'de! Açıklamadaki linkten test ekibimize katıl!"},
        ],
    },
    {
        "slug": "pomodoro-odak",
        "theme": "emerald",
        "visual": "timer",
        "cards": [
            {"icon": "⏱️", "title": "25 Dk Tam Odak"},
            {"icon": "☕", "title": "5 Dk Kısa Mola"},
            {"icon": "🔁", "title": "4 Tur = Büyük Ödül"},
            {"icon": "🔥", "title": "Knowza Günlük Seri"},
        ],
        "title": "Beynin Maksimum Odak Süresi Kaç Dakika? ⏱️🧠 #Shorts",
        "caption": (
            "3 saat aralıksız masa başında oturup hiçbir şey anlamadığın oldu mu? ⏱️🧠\n"
            "25 dakika tam odak + 5 dakika mola ile verimini ikiye katla! Knowza ile günlük serini kur! 🔥\n"
            f"Test kulübümüz: {TEST_GROUP_URL}\n\n"
            "#Knowza #Shorts #Pomodoro #Odaklanma #DersÇalışma #Motivasyon #Eğitim"
        ),
        "scenes": [
            {"headline": "3 Saat Masa Başı?", "sub": "Verim Neden Düşüyor? ⏱️", "vo": "Üç saat aralıksız ders çalışıp sonunda neredeyse hiçbir şey hatırlamadığın oldu mu?"},
            {"headline": "25 Dakika Kuralı!", "sub": "Pomodoro Odak Tekniği 🔥", "vo": "Araştırmalara göre beynin kesintisiz odaklanma süresi ortalama yirmi beş dakika!"},
            {"headline": "25 Çalış • 5 Dinlen", "sub": "Kısa Molalarla Hafızayı Kilitle ⚡", "vo": "Yirmi beş dakika tam odaklanıp beş dakika mola verdiğinde bilgi kalıcı hale geliyor!"},
            {"headline": "Knowza'da 5 Dk!", "sub": "Mola Saatinde Bile Öğren 🐻", "vo": "Knowza'nın beş dakikalık mini dersleriyle hem mola ver hem de serini koru!"},
            {"headline": "Rekorunu Kır!", "sub": "Günlük Seri + Rozetler 🏆", "vo": "Her gün küçük adımlarla dev fark yarat!"},
            {"headline": "Knowza'yı Dene!", "sub": "Test Grubu Linki Açıklamada 🚀", "vo": "Test kullanıcılarımız arasına katılmak için açıklamadaki linke hemen tıkla!"},
        ],
    },
    {
        "slug": "ingilizce-kelime-hilesi",
        "theme": "crimson",
        "visual": "chart",
        "cards": [
            {"icon": "👀", "title": "Cümlede Gör"},
            {"icon": "🎧", "title": "Sesli Dinle"},
            {"icon": "⚡", "title": "Mini Quiz Çöz"},
            {"icon": "🇬🇧", "title": "Knowza İngilizce"},
        ],
        "title": "İngilizce Kelimeleri Unutmadan Ezberlemenin 3 Altın Kuralı 🇬🇧✨ #Shorts",
        "caption": (
            "100 kelime ezberleyip ertesi gün 90'ını unutuyor musun? 🇬🇧😅\n"
            "Bağlam içinde öğren + sesli duy + 24 saatte tekrar et! Knowza ile günde 5 dakika yeter! 🚀\n"
            f"Test kulübümüz: {TEST_GROUP_URL}\n\n"
            "#Knowza #Shorts #İngilizce #KelimeEzber #DilÖğren #Eğitim"
        ),
        "scenes": [
            {"headline": "100 Kelime Ezber?", "sub": "Ertesi Gün Hepsi Gitti Mi? 😅", "vo": "Listeden yüz İngilizce kelime ezberleyip ertesi gün çoğunu unuttuğun oldu mu?"},
            {"headline": "Liste Ezberleme!", "sub": "Cümle İçinde Gör & Dinle 🎧", "vo": "Beyin tek başına kelimeyi değil, hikaye ve cümle içindeki anlamı hatırlar!"},
            {"headline": "3 Altın Adım!", "sub": "Gör • Duy • Mini Quiz Çöz ⚡", "vo": "Kelimeyi gör, telaffuzunu dinle ve hemen ardından üç saniyelik mini quizde kullan!"},
            {"headline": "Knowza İngilizce!", "sub": "Seviyene Göre Akıllı Pratik 🇬🇧", "vo": "Knowza tam da bu üç adımı eğlenceli bir oyuna dönüştürüyor!"},
            {"headline": "Serini Bozma!", "sub": "12 Gün Üst Üste 🔥", "vo": "Her gün beş dakikayla kelime dağarcığını katla!"},
            {"headline": "Knowza Çok Yakında!", "sub": "Açıklamadaki Linkten Katıl 🚀", "vo": "Daha fazlası için Knowza yakında Play Store'da! Açıklamadaki linkten test grubuna katıl!"},
        ],
    },
    {
        "slug": "yks-paragraf-hizi",
        "theme": "indigo",
        "visual": "comparison",
        "cards": [
            {"icon": "🎯", "title": "Önce Soru Kökü"},
            {"icon": "⚡", "title": "Bağlaçları Yakala"},
            {"icon": "⏱️", "title": "Süre Kazan"},
            {"icon": "🤖", "title": "Knowza YKS Koçu"},
        ],
        "title": "YKS Paragraf Sorularını Yarı Sürede Çözme Taktiği 📖⚡ #Shorts",
        "caption": (
            "Paragraf sorularında zaman yetiştiremeyenler için 3 pratik taktik! 📖⚡\n"
            "Önce soru kökünü oku, anahtar kelimeleri yakala! Knowza YKS koçunla hızlan! 🚀\n"
            f"Test kulübümüz: {TEST_GROUP_URL}\n\n"
            "#Knowza #Shorts #YKS #TYT #Paragraf #SınavTaktiği #Eğitim"
        ),
        "scenes": [
            {"headline": "Paragraf Yetişmiyor!", "sub": "Süreyi Nasıl Kazanırsın? 📖", "vo": "Paragraf sorularını iki kere okuyup sınavda zaman kaybediyor musun?"},
            {"headline": "Önce Soru Kökü!", "sub": "Ne Aradığını Bilerek Oku 🎯", "vo": "İlk kural: Metne geçmeden önce mutlaka soru kökünü oku!"},
            {"headline": "Bağlaçlara Dikkat!", "sub": "Ama • Fakat • Ancak • Oysa ⚡", "vo": "Cevapların yüzde sekseni 'ama', 'ancak', 'oysa' gibi zıtlık bağlaçlarından hemen sonra gelir!"},
            {"headline": "Knowza İle Pratik!", "sub": "Günlük 5 Dk Hız Denemesi 🤖", "vo": "Knowza yapay zeka koçuyla her gün beş dakikalık hız pratiği yap!"},
            {"headline": "Netlerin Artsın!", "sub": "+100 XP & Rozetler 🏆", "vo": "Doğru hız tekniğiyle netlerini hızla yukarı taşı!"},
            {"headline": "Knowza'ya Katıl!", "sub": "Test Linki Açıklamada 👇", "vo": "İlk test kullanıcılarımızdan biri olmak için açıklamadaki grup linkinden hemen başvur!"},
        ],
    },
    {
        "slug": "uyku-ve-hafiza",
        "theme": "ocean",
        "visual": "chart",
        "cards": [
            {"icon": "😴", "title": "Derin Uyku = Kayıt"},
            {"icon": "📉", "title": "Uykusuzluk = -%40"},
            {"icon": "☀️", "title": "Gündüz 10 Dk Tekrar"},
            {"icon": "🏆", "title": "Zinde Zihinle Geç"},
        ],
        "title": "Gece Uykusuz Ders Çalışmak Neden Zararlı? 😴🧠 #Shorts",
        "caption": (
            "Sabaha kadar uyumayıp ders çalışmak hafızayı güçlendirir mi, yoksa siler mi? 😴🧠\n"
            "Bilgi uyurken kalıcı hafızaya yazılır! Knowza ile gündüz 10 dakika çalış, rahat uyu! 🐻✨\n"
            f"Test kulübümüz: {TEST_GROUP_URL}\n\n"
            "#Knowza #Shorts #Uyku #Hafıza #Bilim #Öğrenci #Eğitim"
        ),
        "scenes": [
            {"headline": "Sabaha Kadar Ders?", "sub": "Hafızaya Etkisi Ne? 😴", "vo": "Sınava hazırlanırken sabaha kadar uykusuz kalmanın aslında hafızanı sildiğini biliyor muydun?"},
            {"headline": "Bilimsel Gerçek!", "sub": "Kayıt Uyurken Yapılır 🧠", "vo": "Gün içinde öğrendiğin tüm bilgiler sadece derin uyku sırasında kalıcı hafızaya aktarılır!"},
            {"headline": "Uykusuzluk = Kayıp!", "sub": "Odak %40 Düşer 📉", "vo": "Uykusuz beyin yeni bilgiyi kaydedemez ve ertesi gün bildiğini de unutur!"},
            {"headline": "Akıllı Çözüm!", "sub": "Gündüz 10 Dk Knowza 🔥", "vo": "Son gece sabahlamak yerine gündüz on dakika Knowza ile düzenli tekrar yap!"},
            {"headline": "Zinde Zihin!", "sub": "Hem Uyu Hem Kazan 🏆", "vo": "Az zamanda yüksek verim al, sınavda fark yarat!"},
            {"headline": "Knowza Yakında!", "sub": "Test Grubu Açıklamada 🚀", "vo": "Knowza çok yakında Google Play'de! Test grubu linki açıklamada seni bekliyor!"},
        ],
    },
]

EPISODES = [
    {
        "slug": "gunluk-seri",
        "title": "Knowza ile Günlük Serini Bozma! 🔥🐻 #Shorts",
        "caption": (
            "Her gün sadece 5 dakika ayır, günlük serini koru ve öğrenmeyi oyuna çevir! 🚀\n"
            f"Test kulübümüze katıl (ilk 12 kişi): {TEST_GROUP_URL}\n\n"
            "#Knowza #Shorts #Reels #Eğitim #DilÖğren #MobilUygulama #GünlükSeri"
        ),
        "scenes": [
            {"headline": "Selam!", "sub": "Bugün serini korudun mu? 🔥", "vo": "Selam! Bugün günlük serini korumaya hazır mısın?"},
            {"headline": "Knowza", "sub": "5 dakikada eğlenerek öğren!", "vo": "Knowza ile günde sadece beş dakika ayırarak yeni bilgiler öğrenmek artık çok keyifli!"},
            {"headline": "Günlük Seri", "sub": "12 gün üst üste! 🚀", "vo": "Bak, günlük serini sürdürdükçe hem hızlanıyor hem de yeni derslerin kilidini açıyorsun!"},
            {"headline": "Öğrenirken Kazan!", "sub": "Dil • Beceri • Rozet • Seri", "vo": "Yeni diller keşfet, beceriler kazan ve rozetlerini biriktir!"},
            {"headline": "Seviye Atladın!", "sub": "+100 XP Bonus", "vo": "Her tamamladığın derste seviye atla ve XP puanlarını topla!"},
            {"headline": "Test Kulübüne Katıl!", "sub": "Sadece 12 test kullanıcısı!", "vo": "Knowza test kulübümüze katıl, profildeki grup linkinden hemen başvur!"},
        ],
    },
    {
        "slug": "rozet-avcisi",
        "title": "Knowza'da Rozetleri Topla, Zirveye Çık! 🏆🐻 #Shorts",
        "caption": (
            "Öğrenirken rozet toplamak hiç bu kadar eğlenceli olmamıştı! 🏆✨\n"
            f"Test kulübümüze katıl: {TEST_GROUP_URL}\n\n"
            "#Knowza #Shorts #Reels #Rozet #Oyunlaştırma #Eğitim #MobilUygulama"
        ),
        "scenes": [
            {"headline": "Merhaba!", "sub": "Rozet avına var mısın? 🏆", "vo": "Merhaba! Bugün seninle rozet avına çıkmaya hazır mısın?"},
            {"headline": "Knowza", "sub": "Sıkıcı derslere veda et!", "vo": "Knowza, klasik ve sıkıcı dersleri eğlenceli bir maceraya dönüştürüyor!"},
            {"headline": "Bugünün Dersi", "sub": "İngilizce • Seviye 1", "vo": "Kısa ve akıllı dersleri tamamla, her doğru cevapla puanını katla!"},
            {"headline": "Hedefini Seç!", "sub": "Dil • Beceri • Rozet • Seri", "vo": "İster dil öğren, ister yeni beceriler kazan, tüm rozetleri koleksiyonuna ekle!"},
            {"headline": "Yeni Rozet & Seviye!", "sub": "+100 XP Kazandın", "vo": "Seviye atladıkça özel rozetler kazan ve arkadaşlarına meydan oku!"},
            {"headline": "Test Ekibine Katıl!", "sub": "İlk 12 test kullanıcısı arıyoruz!", "vo": "İlk on iki test kullanıcımızdan biri ol, profildeki linkten hemen aramıza katıl!"},
        ],
    },
    {
        "slug": "dil-ogrenme",
        "title": "Yeni Bir Dil Öğrenmenin En Eğlenceli Yolu: Knowza! 🌍✨ #Shorts",
        "caption": (
            "İngilizce ve yeni beceriler artık cebinde! Knowza ile her gün bir adım öne geç! 🌍🚀\n"
            f"Test kulübümüze katıl: {TEST_GROUP_URL}\n\n"
            "#Knowza #Shorts #Reels #DilÖğren #İngilizce #Eğitim #Uygulama"
        ),
        "scenes": [
            {"headline": "Selam!", "sub": "Yeni bir dil öğrenmeye ne dersin? 🌍", "vo": "Selam! Yeni bir dil öğrenmeye en eğlenceli yerden başlamaya ne dersin?"},
            {"headline": "Knowza", "sub": "Yeni nesil öğrenme deneyimi!", "vo": "Knowza ile kelimeler, pratikler ve mini quizler artık bir oyun kadar akıcı!"},
            {"headline": "Hemen Başla", "sub": "İngilizce • Seviye 1 • Ders 3", "vo": "Günün dersini seç, sadece birkaç dakikada pratik yap ve ilerlemeni gör!"},
            {"headline": "Hepsi Tek Yerde!", "sub": "Dil • Beceri • Rozet • Seri", "vo": "Hem dil öğren hem becerilerini geliştir, serini hiç bozma!"},
            {"headline": "Seviye 13!", "sub": "+100 XP ile devam et!", "vo": "Her gün biraz daha ilerle, seviye atla ve öğrenmenin tadını çıkar!"},
            {"headline": "Seni Bekliyoruz!", "sub": "12 test kullanıcısı arıyoruz!", "vo": "Sen de Knowza test kulübüne katıl, profildeki grup linkinden yerini al!"},
        ],
    },
]


def tts_elevenlabs(text: str, out_mp3: Path):
    r = requests.post(
        f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}",
        headers={
            "xi-api-key": ELEVENLABS_API_KEY,
            "Content-Type": "application/json",
            "Accept": "audio/mpeg",
        },
        json={
            "text": text,
            "model_id": "eleven_multilingual_v2",
            "voice_settings": {
                "stability": 0.36,
                "similarity_boost": 0.80,
                "style": 0.62,
                "use_speaker_boost": True,
            },
        },
        timeout=60,
    )
    r.raise_for_status()
    out_mp3.write_bytes(r.content)


def get_duration(path: Path) -> float:
    res = subprocess.run(
        [FFMPEG, "-i", str(path)],
        capture_output=True,
        text=True,
    )
    for line in res.stderr.splitlines():
        if "Duration:" in line:
            t = line.split("Duration:")[1].split(",")[0].strip()
            h, m, s = t.split(":")
            return int(h) * 3600 + int(m) * 60 + float(s)
    return 4.5


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--episode", type=int, default=None, help="Episode index (0..N-1)")
    parser.add_argument("--mode", choices=["mascot", "promo"], default="promo", help="mascot=Maskot Seri, promo=Uygulama Tanıtım")
    parser.add_argument("--out-dir", type=Path, default=OUT_DIR, help="Output directory (can be /tmp/...)")
    args = parser.parse_args()

    out_dir = args.out_dir
    out_dir.mkdir(parents=True, exist_ok=True)
    today = datetime.date.today()
    pool = MASCOT_SERIES if args.mode == "mascot" else EPISODES
    history_file = Path.home() / ".knowza-posted-history.json"
    posted = []
    if history_file.exists():
        try:
            posted = json.loads(history_file.read_text(encoding="utf-8"))
        except Exception:
            posted = []

    if args.episode is not None and args.episode >= 0:
        unposted = [e for e in pool if e["slug"] not in posted]
        if not unposted:
            posted = [s for s in posted if s not in {e["slug"] for e in pool}]
            unposted = pool
        ep = unposted[args.episode % len(unposted)]
    else:
        unposted = [e for e in pool if e["slug"] not in posted] or pool
        ep = unposted[0]

    if ep["slug"] not in posted:
        posted.append(ep["slug"])
        history_file.write_text(json.dumps(posted, ensure_ascii=False, indent=2), encoding="utf-8")

    work_dir = out_dir / f"work_{today.isoformat()}_{ep['slug']}"
    work_dir.mkdir(parents=True, exist_ok=True)

    # 1. Generate ElevenLabs voiceovers
    vo_paths = []
    durations = []
    for i, sc in enumerate(ep["scenes"]):
        mp3 = work_dir / f"vo_{i}.mp3"
        if not mp3.exists():
            print(f"[TTS] Generating scene {i+1}...")
            tts_elevenlabs(sc["vo"], mp3)
        vo_paths.append(mp3)
        durations.append(max(3.6, get_duration(mp3) + 0.65))

    # Compute scene start/end timestamps
    starts = []
    cur = 0.0
    for d in durations:
        starts.append(cur)
        cur += d
    total_dur = cur + 0.5

    # 2. Mix audio with bgm + sfx
    bgm = ASSET_CACHE / "bgm.mp3"
    sfx_whoosh = ASSET_CACHE / "sfx_whoosh.mp3"
    sfx_lvl = ASSET_CACHE / "sfx_levelup.mp3"
    sfx_click = ASSET_CACHE / "sfx_click.mp3"
    master_audio = work_dir / "master_audio.m4a"

    cmd = [FFMPEG, "-y", "-stream_loop", "-1", "-i", str(bgm)]
    for vp in vo_paths:
        cmd += ["-i", str(vp)]
    cmd += ["-i", str(sfx_whoosh), "-i", str(sfx_lvl), "-i", str(sfx_click)]

    fc = [f"[0:a]atrim=0:{total_dur:.2f},afade=t=in:st=0:d=0.5,afade=t=out:st={total_dur-1.5:.2f}:d=1.5,volume=0.14[bgm]"]
    mix_inputs = ["[bgm]"]
    for i, st in enumerate(starts):
        ms = int((st + 0.15) * 1000)
        fc.append(f"[{i+1}:a]adelay={ms}|{ms},volume=1.18[v{i}]")
        mix_inputs.append(f"[v{i}]")

    w_idx = 1 + len(vo_paths)
    fc.append(f"[{w_idx}:a]asplit=5[w1][w2][w3][w4][w5]")
    for j in range(5):
        ms = int(max(0, starts[j+1] - 0.15) * 1000)
        fc.append(f"[w{j+1}]adelay={ms}|{ms},volume=0.28[sw{j}]")
        mix_inputs.append(f"[sw{j}]")

    lvl_ms = int((starts[4] + 1.3) * 1000)
    clk_ms = int((starts[5] + 3.0) * 1000)
    fc.append(f"[{w_idx+1}:a]adelay={lvl_ms}|{lvl_ms},volume=0.55[slvl]")
    fc.append(f"[{w_idx+2}:a]adelay={clk_ms}|{clk_ms},volume=0.65[sclk]")
    mix_inputs += ["[slvl]", "[sclk]"]

    fc.append(f"{''.join(mix_inputs)}amix=inputs={len(mix_inputs)}:duration=first:normalize=0,acompressor=threshold=-14dB:ratio=3:attack=5:release=100[out]")
    cmd += ["-filter_complex", ";".join(fc), "-map", "[out]", "-t", f"{total_dur:.2f}", "-c:a", "aac", "-ar", "48000", "-ac", "2", "-b:a", "128k", str(master_audio)]
    subprocess.run(cmd, check=True)

    # 3. Render video via Node/Playwright using shared renderer
    out_mp4 = out_dir / f"knowza-{today.isoformat()}-{ep['slug']}.mp4"
    meta_json = work_dir / "meta.json"
    meta_json.write_text(json.dumps({
        "episode": ep,
        "starts": starts,
        "durations": durations,
        "total_dur": total_dur,
        "audio_path": str(master_audio),
        "output_mp4": str(out_mp4),
        "title": ep["title"],
        "caption": ep["caption"],
        "test_group_url": TEST_GROUP_URL,
    }, ensure_ascii=False, indent=2), encoding="utf-8")

    subprocess.run(
        ["/usr/local/bin/node", str(WORKSPACE / "scripts" / "render_daily_video.mjs"), str(meta_json)],
        env={**os.environ, "NODE_PATH": str(WORKSPACE / "node_modules")},
        check=True,
    )
    print(f"READY_MP4={out_mp4}")
    print(f"READY_META={meta_json}")


if __name__ == "__main__":
    main()
