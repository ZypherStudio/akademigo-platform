// Knowza Claude AI API Service
// Anthropic Claude 3.5 Sonnet / Haiku Integration

const DEFAULT_CLAUDE_KEY = 'sk-kGCmA6b0jCSCaYZuJJ8cKLXDEAQnSQcQr5JlsfIgcLWtuXUH';

export interface ClaudeMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const getClaudeApiKey = (): string => {
  return localStorage.getItem('knowza_claude_api_key') || DEFAULT_CLAUDE_KEY;
};

export const setClaudeApiKey = (key: string): void => {
  localStorage.setItem('knowza_claude_api_key', key.trim());
};

export const getClaudeProxyUrl = (): string => {
  return localStorage.getItem('knowza_claude_proxy_url') || 'https://api.anthropic.com/v1/messages';
};

export const setClaudeProxyUrl = (url: string): void => {
  localStorage.setItem('knowza_claude_proxy_url', url.trim());
};

const DEFAULT_SYSTEM_PROMPT = `Sen Knowza eğitim platformunun sevimli, eğlenceli ve son derece zeki 3D Maskot Koçusun (Sarı Mezuniyet Kepli Ayıcık 🐻🎓).
Öğrencilere YKS (TYT-AYT), LGS, KPSS, Python Kodlama ve İngilizce konularında yardımcı oluyorsun.
Cevapların daima samimi, motive edici, net ve pedagojik olmalı.
Gerektiğinde maddeler, kısa örnekler ve akılda kalıcı ipuçları ver.
Türkçe konuşuyorsun.`;

export async function sendChatMessageToClaude(
  messages: ClaudeMessage[],
  systemPrompt: string = DEFAULT_SYSTEM_PROMPT
): Promise<{ text: string; success: boolean; error?: string }> {
  const apiKey = getClaudeApiKey();
  const endpoint = getClaudeProxyUrl();

  try {
    // 1. Try Anthropic direct endpoint
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        system: systemPrompt,
        messages: messages.map(m => ({
          role: m.role,
          content: m.content
        }))
      })
    });

    if (response.ok) {
      const data = await response.json();
      const content = data.content?.[0]?.text || '';
      return { text: content, success: true };
    }

    const errData = await response.json().catch(() => ({}));
    const errMsg = errData.error?.message || `HTTP ${response.status}: ${response.statusText}`;
    
    // If Anthropic returned authentication error or failed, try OpenAI-compatible format (common for Claude API relays)
    try {
      const openaiRelayResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages.map(m => ({ role: m.role, content: m.content }))
          ]
        })
      });

      if (openaiRelayResponse.ok) {
        const odata = await openaiRelayResponse.json();
        const otext = odata.choices?.[0]?.message?.content || '';
        return { text: otext, success: true };
      }
    } catch {
      // Continue to fallback
    }

    return {
      text: '',
      success: false,
      error: errMsg
    };
  } catch (err: any) {
    return {
      text: '',
      success: false,
      error: err.message || 'Bağlantı hatası oluştu.'
    };
  }
}
