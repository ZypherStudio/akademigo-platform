import { chromium } from 'playwright';
import { spawn } from 'child_process';
import fs from 'fs';

const metaPath = process.argv[2];
if (!metaPath) {
  console.error('Usage: node render_daily_video.mjs <meta.json>');
  process.exit(1);
}

const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
const ep = meta.episode;
const sc = ep.scenes;
const starts = meta.starts;
const totalDur = meta.total_dur;

const THEMES = {
  indigo: { bg: 'radial-gradient(circle at 50% 28%, #2a1e5c 0%, #11122e 58%, #090a1a 100%)', accent: '#fbbf24', accent2: '#a78bfa' },
  emerald: { bg: 'radial-gradient(circle at 50% 28%, #065f46 0%, #052e23 58%, #031510 100%)', accent: '#4ade80', accent2: '#fde047' },
  ocean: { bg: 'radial-gradient(circle at 50% 28%, #0c4a6e 0%, #092038 58%, #050d1a 100%)', accent: '#38bdf8', accent2: '#fbbf24' },
  crimson: { bg: 'radial-gradient(circle at 50% 28%, #6b112c 0%, #2b0916 58%, #12040a 100%)', accent: '#fb7185', accent2: '#fde047' },
};
const theme = THEMES[ep.theme || 'indigo'] || THEMES.indigo;
const visualType = ep.visual || 'cards';
const cards = ep.cards || [
  { icon: '🤖', title: 'Yapay Zeka Koçu' },
  { icon: '🌍', title: 'Yabancı Diller' },
  { icon: '🏆', title: 'Rozetler Topla' },
  { icon: '🔥', title: 'Günlük Seri' },
];

const bearSvg = `
<svg viewBox="0 0 320 340" width="100%" height="100%" style="overflow:visible;">
  <defs>
    <radialGradient id="furGrad" cx="45%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#fbbf24"/>
      <stop offset="70%" stop-color="#f59e0b"/>
      <stop offset="100%" stop-color="#d97706"/>
    </radialGradient>
    <linearGradient id="hoodieGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#27273f"/>
      <stop offset="100%" stop-color="#141426"/>
    </linearGradient>
  </defs>
  <g id="bear-body">
    <path d="M70,335 C70,245 100,215 160,215 C220,215 250,245 250,335 Z" fill="url(#hoodieGrad)" stroke="#3f3f60" stroke-width="4"/>
    <line x1="140" y1="225" x2="136" y2="270" stroke="#fbbf24" stroke-width="5" stroke-linecap="round"/>
    <line x1="180" y1="225" x2="184" y2="270" stroke="#fbbf24" stroke-width="5" stroke-linecap="round"/>
    <text x="160" y="298" text-anchor="middle" font-size="52" font-weight="900" fill="#fbbf24" font-family="system-ui, sans-serif">K</text>
  </g>
  <g id="bear-arm" style="transform-origin: 235px 245px;">
    <path d="M230,240 C265,220 295,180 282,155 C270,132 242,150 232,185" fill="url(#hoodieGrad)" stroke="#3f3f60" stroke-width="4" stroke-linecap="round"/>
    <circle cx="276" cy="154" r="24" fill="url(#furGrad)" stroke="#d97706" stroke-width="3"/>
  </g>
  <g id="bear-head" style="transform-origin: 160px 155px;">
    <circle cx="88" cy="84" r="30" fill="url(#furGrad)"/>
    <circle cx="88" cy="84" r="16" fill="#fde68a"/>
    <circle cx="232" cy="84" r="30" fill="url(#furGrad)"/>
    <circle cx="232" cy="84" r="16" fill="#fde68a"/>
    <ellipse cx="160" cy="145" rx="84" ry="74" fill="url(#furGrad)"/>
    <ellipse cx="160" cy="166" rx="34" ry="26" fill="#fef3c7"/>
    <ellipse cx="160" cy="154" rx="13" ry="9" fill="#1e1b2e"/>
    <path id="mouth-happy" d="M144,170 Q160,192 176,170 Z" fill="#991b1b" stroke="#1e1b2e" stroke-width="3"/>
    <ellipse id="mouth-shock" cx="160" cy="174" rx="11" ry="14" fill="#991b1b" stroke="#1e1b2e" stroke-width="3" style="opacity:0;"/>
    <g id="eyes-open">
      <circle cx="124" cy="134" r="15" fill="#1e1b2e"/>
      <circle cx="129" cy="129" r="5" fill="#ffffff"/>
      <circle cx="196" cy="134" r="15" fill="#1e1b2e"/>
      <circle cx="201" cy="129" r="5" fill="#ffffff"/>
    </g>
    <g id="eyes-happy" style="opacity:0;">
      <path d="M108,136 Q124,118 140,136" fill="none" stroke="#1e1b2e" stroke-width="6" stroke-linecap="round"/>
      <path d="M180,136 Q196,118 212,136" fill="none" stroke="#1e1b2e" stroke-width="6" stroke-linecap="round"/>
    </g>
    <g id="grad-cap">
      <rect x="114" y="54" width="92" height="24" rx="6" fill="#1f1f35"/>
      <polygon points="160,20 248,54 160,82 72,54" fill="#2c2c4a" stroke="#3f3f60" stroke-width="3"/>
      <path d="M225,62 L232,102" stroke="#fbbf24" stroke-width="4" stroke-linecap="round"/>
      <circle cx="232" cy="106" r="7" fill="#fbbf24"/>
    </g>
  </g>
</svg>`;

function buildScene3Widget() {
  if (visualType === 'timer') {
    return `
      <div class="widget-card" style="text-align:center;">
        <svg viewBox="0 0 260 260" width="320" height="320" style="margin:0 auto;display:block;">
          <circle cx="130" cy="130" r="106" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="18"/>
          <circle id="timer-ring" cx="130" cy="130" r="106" fill="none" stroke="${theme.accent}" stroke-width="18" stroke-linecap="round" stroke-dasharray="666" stroke-dashoffset="666" transform="rotate(-90 130 130)"/>
          <text id="timer-txt" x="130" y="144" text-anchor="middle" fill="#ffffff" font-size="54" font-weight="900">25:00</text>
        </svg>
        <div style="font-size:34px;font-weight:800;margin-top:20px;color:${theme.accent};">Tam Odak Modu</div>
      </div>`;
  }
  if (visualType === 'chart') {
    return `
      <div class="widget-card">
        <svg viewBox="0 0 700 320" width="100%">
          <line x1="50" y1="270" x2="660" y2="270" stroke="#64748b" stroke-width="4"/>
          <path d="M60,60 Q200,200 640,250" fill="none" stroke="rgba(248,113,113,0.4)" stroke-width="8" stroke-dasharray="10 10"/>
          <path id="chart-line" d="M60,240 Q220,180 380,120 T640,55" fill="none" stroke="${theme.accent}" stroke-width="12" stroke-linecap="round" stroke-dasharray="760" stroke-dashoffset="760"/>
        </svg>
        <div style="display:flex;justify-content:space-between;font-size:32px;font-weight:900;margin-top:14px;">
          <span>Verim Artışı</span><span id="chart-pct" style="color:${theme.accent};">%95</span>
        </div>
      </div>`;
  }
  if (visualType === 'comparison') {
    return `
      <div class="widget-card" style="display:grid;grid-template-columns:1fr 1fr;gap:22px;">
        <div style="background:rgba(239,68,68,0.16);border:2px solid #ef4444;border-radius:28px;padding:34px 20px;text-align:center;">
          <div style="font-size:64px;">❌</div>
          <div style="font-size:34px;font-weight:900;margin-top:12px;">Eski Yöntem</div>
          <div style="font-size:26px;color:#fca5a5;margin-top:8px;">Sıkıcı & Yavaş</div>
        </div>
        <div style="background:rgba(74,222,128,0.16);border:2px solid #4ade80;border-radius:28px;padding:34px 20px;text-align:center;">
          <div style="font-size:64px;">✅</div>
          <div style="font-size:34px;font-weight:900;margin-top:12px;">Knowza İle</div>
          <div style="font-size:26px;color:#86efac;margin-top:8px;">Hızlı & Eğlenceli</div>
        </div>
      </div>`;
  }
  return `
    <div class="widget-card" style="display:grid;grid-template-columns:1fr 1fr;gap:22px;">
      ${cards.map((c, idx) => `
        <div class="topic-chip" id="tc-${idx}">
          <div style="font-size:56px;">${c.icon}</div>
          <div style="font-size:32px;font-weight:900;margin-top:10px;">${c.title}</div>
        </div>`).join('')}
    </div>`;
}

const html = `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8" />
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body {
    width: 1080px; height: 1920px; overflow: hidden;
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Rounded", "Avenir Next", sans-serif;
    color: #fff; -webkit-font-smoothing: antialiased;
  }
  #stage { position: relative; width: 1080px; height: 1920px; overflow: hidden; background: ${theme.bg}; }
  #bg-canvas { position: absolute; inset: 0; z-index: 1; pointer-events: none; }
  .scene { position: absolute; inset: 0; z-index: 10; opacity: 0; overflow: hidden; padding: 110px 64px; }
  .accent { color: ${theme.accent}; }
  .eyebrow {
    display: inline-block; padding: 10px 28px; border-radius: 99px;
    background: rgba(255,255,255,0.09); border: 2px solid ${theme.accent};
    font-size: 28px; font-weight: 900; color: ${theme.accent};
  }
  .big-h { margin-top: 24px; font-size: 82px; font-weight: 900; line-height: 1.1; }
  .sub-h { margin-top: 26px; font-size: 42px; font-weight: 700; color: #e2e8f0; line-height: 1.35; }
  .widget-card {
    margin-top: 48px; background: rgba(10,12,28,0.72);
    border: 3px solid rgba(255,255,255,0.16); border-radius: 38px;
    padding: 36px; box-shadow: 0 24px 60px rgba(0,0,0,0.55);
  }
  .topic-chip {
    background: rgba(255,255,255,0.06); border: 2px solid rgba(255,255,255,0.14);
    border-radius: 26px; padding: 28px 18px; text-align: center;
  }
  .step-box {
    margin-top: 26px; display: flex; align-items: center; gap: 22px;
    background: rgba(255,255,255,0.07); border: 2px solid rgba(255,255,255,0.15);
    border-radius: 28px; padding: 26px 30px; font-size: 36px; font-weight: 800;
  }
  .step-num {
    width: 60px; height: 60px; border-radius: 50%; flex-shrink: 0;
    background: ${theme.accent}; color: #111827; font-size: 34px; font-weight: 900;
    display: flex; align-items: center; justify-content: center;
  }
  #sub-wrap { position: absolute; bottom: 120px; left: 54px; right: 54px; z-index: 40; display: flex; justify-content: center; }
  #sub-pill {
    background: rgba(10,12,28,0.9); border: 2px solid rgba(255,255,255,0.2);
    border-radius: 26px; padding: 20px 30px; font-size: 34px; font-weight: 800; line-height: 1.35; text-align: center;
  }
  #bear-slot { position: absolute; z-index: 25; pointer-events: none; }
</style>
</head>
<body>
<div id="stage">
  <canvas id="bg-canvas" width="1080" height="1920"></canvas>

  <div class="scene" id="scene1" style="text-align:center;">
    <div class="eyebrow">🐻 KNOWZA BİLGİ & TAKTİK</div>
    <div class="big-h" style="margin-top:60px;">${sc[0].headline}</div>
    <div class="sub-h">${sc[0].sub}</div>
  </div>

  <div class="scene" id="scene2" style="text-align:center;">
    <div class="eyebrow">💡 BİLİM & YÖNTEM</div>
    <div class="big-h">${sc[1].headline}</div>
    <div class="sub-h">${sc[1].sub}</div>
  </div>

  <div class="scene" id="scene3">
    <div class="eyebrow">⚡ UYGULAMALI ÖZET</div>
    <div class="big-h" style="font-size:66px;">${sc[2].headline}</div>
    ${buildScene3Widget()}
  </div>

  <div class="scene" id="scene4">
    <div class="eyebrow">🎯 ADIM ADIM</div>
    <div class="big-h" style="font-size:64px;">${sc[3].headline}</div>
    ${cards.map((c, idx) => `
      <div class="step-box" id="st-${idx}">
        <div class="step-num">${idx + 1}</div>
        <div>${c.icon} ${c.title}</div>
      </div>`).join('')}
  </div>

  <div class="scene" id="scene5" style="text-align:center;">
    <div class="eyebrow">🏆 SONUÇ</div>
    <div class="big-h">${sc[4].headline}</div>
    <div class="widget-card" style="padding:48px;">
      <div style="font-size:74px;font-weight:900;color:${theme.accent};">${sc[4].sub}</div>
    </div>
  </div>

  <div class="scene" id="scene6" style="text-align:center;">
    <div style="width:150px;height:150px;margin:20px auto;border-radius:38px;background:${theme.accent};color:#111827;font-size:96px;font-weight:900;display:flex;align-items:center;justify-content:center;">K</div>
    <div class="big-h" style="margin-top:20px;">${sc[5].headline}</div>
    <div class="sub-h">${sc[5].sub}</div>
    <div style="margin-top:46px;display:inline-block;padding:28px 66px;border-radius:99px;background:${theme.accent};color:#111827;font-size:46px;font-weight:900;">Çok Yakında Play Store'da! ›</div>
  </div>

  <div id="bear-slot">${bearSvg}</div>
  <div id="sub-wrap"><div id="sub-pill"></div></div>
</div>

<script>
const S = ${JSON.stringify(starts)};
const T = ${totalDur};
const SUBS = ${JSON.stringify(sc.map(x => x.vo))};
const clamp = (v,a=0,b=1) => Math.max(a, Math.min(b, v));
const lerp = (a,b,t) => a + (b - a) * t;
const easeInOut = t => { const x=clamp(t); return x<0.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2; };
const easeOutBack = t => { const x=clamp(t), c1=1.70158, c3=c1+1; return 1+c3*Math.pow(x-1,3)+c1*Math.pow(x-1,2); };

const bgCtx = document.getElementById('bg-canvas').getContext('2d');
const dots = Array.from({length:30}, (_,i)=>({x:(i*257)%1080, y:(i*419)%1920, r:3+(i%5)*2, s:40+(i%4)*22}));

window.renderAtTime = function(t) {
  bgCtx.clearRect(0,0,1080,1920);
  for (const d of dots) {
    const py = (d.y - t * d.s + 19200) % 1920;
    bgCtx.beginPath(); bgCtx.arc(d.x, py, d.r, 0, Math.PI*2);
    bgCtx.fillStyle = 'rgba(255,255,255,0.16)'; bgCtx.fill();
  }

  let active = 0;
  for (let i=0;i<6;i++) {
    const s = S[i], e = i<5 ? S[i+1] : T+1;
    const vis = (t >= s && t < e) ? 1 : 0;
    document.getElementById('scene' + (i+1)).style.opacity = vis;
    if (vis) active = i;
  }
  document.getElementById('sub-pill').textContent = SUBS[active];
  const lt = t - S[active];

  // Topic widget animations in scene 3
  if (active === 2) {
    const ring = document.getElementById('timer-ring');
    if (ring) {
      const p = clamp(lt / 3.5);
      ring.style.strokeDashoffset = 666 * (1 - p);
      const mins = Math.max(0, Math.round(lerp(25, 0, p)));
      document.getElementById('timer-txt').textContent = String(mins).padStart(2,'0') + ':00';
    }
    const cl = document.getElementById('chart-line');
    if (cl) {
      const p = clamp(lt / 3.2);
      cl.style.strokeDashoffset = 760 * (1 - p);
      document.getElementById('chart-pct').textContent = '%' + Math.round(lerp(30, 95, p));
    }
  }
  if (active === 3) {
    for (let k=0;k<4;k++) {
      const el = document.getElementById('st-' + k);
      if (el) {
        const d = k * 0.45;
        el.style.opacity = clamp((lt - d)/0.25);
        el.style.transform = \`translateX(\${lerp(-40, 0, easeOutBack((lt - d)/0.4))}px)\`;
      }
    }
  }

  // Varied Bear poses per scene
  const bear = document.getElementById('bear-slot');
  const arm = document.getElementById('bear-arm');
  const head = document.getElementById('bear-head');
  const eOpen = document.getElementById('eyes-open');
  const eHappy = document.getElementById('eyes-happy');
  const mHappy = document.getElementById('mouth-happy');
  const mShock = document.getElementById('mouth-shock');

  const isShock = active === 0;
  const isHappy = active === 4 || active === 5;
  mHappy.style.opacity = isShock ? 0 : 1;
  mShock.style.opacity = isShock ? 1 : 0;
  eOpen.style.opacity = isHappy ? 0 : 1;
  eHappy.style.opacity = isHappy ? 1 : 0;
  arm.style.transform = \`rotate(\${Math.sin(t * 7) * 18}deg)\`;
  head.style.transform = \`rotate(\${Math.sin(t * 3) * 5}deg)\`;

  if (active === 2 || active === 3) {
    bear.style.width = '360px'; bear.style.height = '380px';
    bear.style.left = active === 2 ? '-10px' : '730px';
    bear.style.bottom = '230px';
  } else {
    bear.style.width = '480px'; bear.style.height = '510px';
    bear.style.left = '300px'; bear.style.bottom = '230px';
  }
};
window.renderAtTime(0);
</script>
</body>
</html>`;

const htmlPath = metaPath.replace(/\.json$/, '.html');
fs.writeFileSync(htmlPath, html, 'utf8');

async function main() {
  const fps = 30;
  const totalFrames = Math.ceil(totalDur * fps);
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  await page.goto('file://' + htmlPath, { waitUntil: 'load' });

  const ffmpeg = spawn('/Users/erdalalp/.local/bin/ffmpeg', [
    '-y', '-f', 'image2pipe', '-vcodec', 'png', '-r', String(fps), '-i', '-',
    '-i', meta.audio_path,
    '-c:v', 'libx264', '-profile:v', 'main', '-level', '4.0', '-pix_fmt', 'yuv420p',
    '-preset', 'medium', '-crf', '18', '-c:a', 'copy', '-shortest', '-movflags', '+faststart',
    meta.output_mp4
  ]);
  for (let f = 0; f < totalFrames; f++) {
    await page.evaluate(t => window.renderAtTime(t), f / fps);
    const buf = await page.screenshot({ type: 'png' });
    if (!ffmpeg.stdin.write(buf)) await new Promise(r => ffmpeg.stdin.once('drain', r));
  }
  ffmpeg.stdin.end();
  await new Promise((res, rej) => ffmpeg.on('close', c => c === 0 ? res() : rej(new Error(`ffmpeg ${c}`))));
  await browser.close();
}

main().catch(e => { console.error(e); process.exit(1); });
