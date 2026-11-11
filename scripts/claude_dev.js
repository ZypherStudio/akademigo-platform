#!/usr/bin/env node
/**
 * Knowza Claude AI Code Generator Tool
 * Usage: node scripts/claude_dev.js "prompt" [--file output.tsx] [--url proxy_url]
 */

const fs = require('fs');
const path = require('path');

const API_KEY = process.env.CLAUDE_API_KEY || 'sk-kGCmA6b0jCSCaYZuJJ8cKLXDEAQnSQcQr5JlsfIgcLWtuXUH';
const DEFAULT_URL = process.env.CLAUDE_BASE_URL || 'https://api.anthropic.com/v1/messages';

async function generateCode() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.log('Kullanım: node scripts/claude_dev.js "<kod_isteği>" [--file <hedef_dosya>] [--url <proxy_adresi>]');
    return;
  }

  const prompt = args[0];
  let targetFile = null;
  let customUrl = DEFAULT_URL;

  for (let i = 1; i < args.length; i++) {
    if (args[i] === '--file' && args[i + 1]) {
      targetFile = args[i + 1];
    }
    if (args[i] === '--url' && args[i + 1]) {
      customUrl = args[i + 1];
    }
  }

  console.log(`🤖 Claude AI Kod Üretici Çalışıyor...`);
  console.log(`🎯 İstek: "${prompt}"`);

  const systemPrompt = `Sen Knowza platformu için kıdemli bir React + TypeScript + Tailwind CSS yazılım uzmanısın.
Kullanıcının istediği bileşenleri veya fonksiyonları eksiksiz, modern ve hatasız kod olarak üret.`;

  try {
    // 1. Try Anthropic direct format
    let response = await fetch(customUrl, {
      method: 'POST',
      headers: {
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4096,
        system: systemPrompt,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (response.ok) {
      const data = await response.json();
      const code = data.content?.[0]?.text || '';
      handleOutput(code, targetFile);
      return;
    }

    // 2. Try OpenAI-compatible Claude Relay format
    const relayUrl = customUrl.includes('anthropic.com') ? 'https://api.openai.com/v1/chat/completions' : customUrl;
    response = await fetch(relayUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ]
      })
    });

    if (response.ok) {
      const data = await response.json();
      const code = data.choices?.[0]?.message?.content || '';
      handleOutput(code, targetFile);
      return;
    }

    const err = await response.text();
    console.error(`❌ Claude API Hatası: ${response.status}`, err);
    console.log(`\n💡 İpucu: Bu API anahtarı özel bir proxy/relay adresine bağlıysa, komuta --url <proxy_adresi> ekleyebilirsiniz.`);
  } catch (e) {
    console.error('❌ Bağlantı hatası:', e.message);
  }
}

function handleOutput(code, targetFile) {
  if (targetFile) {
    const dest = path.resolve(process.cwd(), targetFile);
    fs.writeFileSync(dest, code, 'utf-8');
    console.log(`✅ Kod başarıyla ${targetFile} dosyasına yazıldı!`);
  } else {
    console.log('\n--- ÜRETİLEN KOD ---');
    console.log(code);
    console.log('--------------------\n');
  }
}

generateCode();
