#!/usr/bin/env python3
"""
Knowza Çoklu Platform Otomatik Yükleyici (YouTube Shorts, TikTok, Instagram Reels)
- İlk seferde `--login` ile kalıcı Chrome profilinde hesaplara giriş yapılır.
- Sonraki günlerde `--upload --meta <meta.json>` ile tamamen otomatik yükler.
"""

import argparse
import json
import subprocess
import sys
from pathlib import Path

WORKSPACE = Path("/Users/erdalalp/başla")
PROFILE_DIR = Path.home() / ".knowza-autopost-profile"
TEST_GROUP_URL = "https://groups.google.com/g/knowza-test?pli=1"


def ensure_playwright():
    try:
        import playwright  # noqa: F401
    except ImportError:
        print("Playwright Python paketi kuruluyor...")
        subprocess.run([sys.executable, "-m", "pip", "install", "playwright"], check=True)


def launch_chrome(p, headless=False):
    # 1. Önce açık olan gerçek Chrome'a CDP üzerinden bağlanmayı dene
    for port in (9222, 9223):
        try:
            browser = p.chromium.connect_over_cdp(f"http://127.0.0.1:{port}")
            if browser.contexts:
                return browser.contexts[0], browser
        except Exception:
            pass

    # 2. Değilse gerçek Google Chrome'u otomasyon bayrakları olmadan başlat
    PROFILE_DIR.mkdir(parents=True, exist_ok=True)
    # Eski kalmış (stale) SingletonLock varsa ve aktif process yoksa temizle
    pg = subprocess.run(["pgrep", "-f", "knowza-autopost-profile"], capture_output=True)
    if pg.returncode != 0:
        for lock_name in ("SingletonLock", "SingletonSocket", "SingletonCookie"):
            lp = PROFILE_DIR / lock_name
            if lp.exists() or lp.is_symlink():
                lp.unlink(missing_ok=True)
    extra_args = ["--disable-blink-features=AutomationControlled", "--mute-audio"]
    if headless:
        extra_args.append("--headless=new")
    else:
        extra_args.append("--remote-debugging-port=9223")
    ctx = p.chromium.launch_persistent_context(
        user_data_dir=str(PROFILE_DIR),
        executable_path="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
        headless=False if headless else False,
        user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        ignore_default_args=["--enable-automation"],
        args=extra_args,
    )
    return ctx, None


def run_login():
    ensure_playwright()
    from playwright.sync_api import sync_playwright

    with sync_playwright() as p:
        ctx, browser = launch_chrome(p, headless=False)
        for url in [
            "https://studio.youtube.com",
            "https://www.tiktok.com/tiktokstudio/upload",
            "https://www.instagram.com/",
        ]:
            page = ctx.new_page()
            page.goto(url)
        print("Açılan gerçek Chrome penceresinde hesaplara giriş yapın, ardından pencereyi kapatın.")
        ctx.pages[0].wait_for_event("close", timeout=0)


def upload_all(meta_path: Path, platforms=("youtube",)):
    ensure_playwright()
    from playwright.sync_api import sync_playwright

    meta = json.loads(meta_path.read_text(encoding="utf-8"))
    video_path = meta["output_mp4"]
    title = meta["title"]
    caption = meta["caption"]

    with sync_playwright() as p:
        ctx, browser = launch_chrome(p, headless=True)

        # 1. TikTok Studio
        if "tiktok" in platforms:
            try:
                page = ctx.new_page()
                page.goto("https://www.tiktok.com/tiktokstudio/upload", wait_until="domcontentloaded")
                page.wait_for_selector('input[type="file"]', state="attached", timeout=25000)
                page.locator('input[type="file"]').first.set_input_files(video_path)
                page.wait_for_timeout(12000)
                page.evaluate('document.getElementById("react-joyride-portal")?.remove()')
                page.keyboard.press("Escape")
                editor = page.locator('[contenteditable="true"]').first
                editor.click(force=True)
                editor.fill(caption)
                post_btn = page.locator('button:has-text("Paylaş"):not([disabled]), button:has-text("Post"):not([disabled])').last
                post_btn.wait_for(state="visible", timeout=45000)
                post_btn.click(force=True)
                page.wait_for_timeout(3000)
                confirm_btn = page.locator('button:has-text("Hemen paylaş"), button:has-text("Post now")')
                if confirm_btn.count() > 0:
                    confirm_btn.first.click(force=True)
                page.wait_for_timeout(10000)
                print("[TikTok] Yüklendi!")
            except Exception as e:
                print(f"[TikTok] Hata (url={page.url}):", e)

        # 2. YouTube Studio
        if "youtube" in platforms:
            try:
                page = ctx.new_page()
                page.goto("https://www.youtube.com/upload", wait_until="domcontentloaded")
                page.wait_for_timeout(6000)
                if "accounts.google.com" in page.url:
                    raise RuntimeError("YouTube oturumu açık değil (accounts.google.com)")
                try:
                    page.wait_for_selector('input[type="file"]', state="attached", timeout=15000)
                except Exception:
                    page.locator('ytcp-button:has-text("Oluştur"), ytcp-button:has-text("Create"), #upload-icon, #create-icon').first.click(force=True)
                    page.wait_for_timeout(1500)
                    item = page.locator('tp-yt-paper-item:has-text("Video yükle"), tp-yt-paper-item:has-text("Upload videos")')
                    if item.count() > 0:
                        item.first.click(force=True)
                    page.wait_for_selector('input[type="file"]', state="attached", timeout=20000)
                page.locator('input[type="file"]').first.set_input_files(video_path)
                page.wait_for_timeout(8000)
                boxes = page.locator('#textbox[contenteditable="true"]')
                boxes.nth(0).fill(title[:100])
                boxes.nth(1).fill(caption)
                page.locator('tp-yt-paper-radio-button[name="VIDEO_MADE_FOR_KIDS_NOT_MFK"]').click(force=True)
                for _ in range(3):
                    page.locator('#next-button').click(force=True)
                    page.wait_for_timeout(1500)
                page.locator('tp-yt-paper-radio-button[name="PUBLIC"]').click(force=True)
                page.wait_for_timeout(1000)
                page.locator('#done-button').click(force=True)
                page.wait_for_timeout(10000)
                print("[YouTube Shorts] Yüklendi!")
            except Exception as e:
                print(f"[YouTube Shorts] Hata (url={page.url}):", e)

        # 3. Instagram Reels
        if "instagram" in platforms:
            try:
                page = ctx.new_page()
                page.goto("https://www.instagram.com/", wait_until="domcontentloaded")
                page.wait_for_timeout(4000)
                if "accounts/login" in page.url:
                    raise RuntimeError("Instagram oturumu açık değil (login)")
                page.locator('a:has-text("Oluştur"), a:has-text("Create"), svg[aria-label*="Yeni gönderi"], svg[aria-label*="New post"]').first.click()
                page.wait_for_selector('input[type="file"]', state="attached", timeout=20000)
                page.locator('input[type="file"]').first.set_input_files(video_path)
                page.wait_for_timeout(8000)
                ok_btn = page.locator('button:has-text("Tamam"), button:has-text("OK")')
                if ok_btn.count() > 0:
                    ok_btn.first.click(force=True)
                    page.wait_for_timeout(1500)
                for _ in range(2):
                    page.locator('[role="dialog"] button:text-is("İleri"), [role="dialog"] div[role="button"]:text-is("İleri"), [role="dialog"] button:text-is("Next")').first.click(force=True)
                    page.wait_for_timeout(2000)
                cap_box = page.locator('[role="dialog"] div[role="textbox"][contenteditable="true"], [role="dialog"] div[aria-label*="Açıklama"], [role="dialog"] div[aria-label*="caption"]').first
                cap_box.click(force=True)
                cap_box.fill(caption)
                page.wait_for_timeout(1000)
                page.locator('[role="dialog"] button:text-is("Paylaş"), [role="dialog"] div[role="button"]:text-is("Paylaş"), [role="dialog"] button:text-is("Share")').first.click(force=True)
                try:
                    page.wait_for_selector('text=/Gönderiniz paylaşıldı|Reels videonuz paylaşıldı|Paylaşıldı|Your reel has been shared|Reel shared/i', timeout=60000)
                except Exception:
                    page.wait_for_timeout(25000)
                print("[Instagram Reels] Yüklendi!")
            except Exception as e:
                print(f"[Instagram Reels] Hata (url={page.url}):", e)

        if not browser:
            ctx.close()


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--login", action="store_true", help="İlk kurulum: hesaplara giriş yap")
    ap.add_argument("--upload", action="store_true", help="Videoyu seçilen platformlara yükle")
    ap.add_argument("--platforms", default="youtube", help="Virgülle ayrılmış platformlar: youtube,tiktok,instagram")
    ap.add_argument("--meta", type=Path, help="knowza_daily_generator.py meta.json yolu")
    args = ap.parse_args()

    if args.login:
        run_login()
    elif args.upload and args.meta:
        plats = [x.strip().lower() for x in args.platforms.split(",") if x.strip()]
        upload_all(args.meta, platforms=plats)
    else:
        ap.print_help()
