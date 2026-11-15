// Adsterra WebView & Web Ad Integration
// Set VITE_ADSTERRA_DIRECT_URL and/or VITE_ADSTERRA_BANNER_SCRIPT_URL in .env
// Example Direct Link: https://www.highperformanceformat.com/...
// Example Banner/Social Bar Script: https://plXXXXX.highperformanceformat.com/.../invoke.js

const env = ((import.meta as any).env || {}) as Record<string, string | undefined>;

export const ADSTERRA_DIRECT_URL =
  env.VITE_ADSTERRA_DIRECT_URL || '';

export const ADSTERRA_SCRIPT_URL =
  env.VITE_ADSTERRA_SCRIPT_URL || '';

export function hasAdsterraConfigured(): boolean {
  return Boolean(ADSTERRA_DIRECT_URL || ADSTERRA_SCRIPT_URL);
}

export function injectAdsterraScript(container: HTMLElement): () => void {
  if (!ADSTERRA_SCRIPT_URL) return () => {};
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.async = true;
  script.src = ADSTERRA_SCRIPT_URL;
  container.appendChild(script);
  return () => {
    try {
      if (script.parentNode === container) {
        container.removeChild(script);
      }
    } catch {
      // ignore cleanup error
    }
  };
}
