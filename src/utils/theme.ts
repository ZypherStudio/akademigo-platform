import { useState, useEffect } from 'react';

const THEME_STORAGE_KEY = 'knowza_dark_mode';
const THEME_EVENT = 'knowza-theme-change';

export function getStoredDarkMode(): boolean {
  try {
    return localStorage.getItem(THEME_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

export function applyDarkMode(isDark: boolean): void {
  if (typeof document !== 'undefined') {
    document.documentElement.classList.toggle('dark', isDark);
  }
  try {
    localStorage.setItem(THEME_STORAGE_KEY, String(isDark));
  } catch {
    // ignore storage errors
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(THEME_EVENT, { detail: { isDark } }));
  }
}

export function initTheme(): void {
  applyDarkMode(getStoredDarkMode());
}

export function useDarkMode(): [boolean, () => void] {
  const [isDark, setIsDark] = useState<boolean>(() => getStoredDarkMode());

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ isDark: boolean }>).detail;
      if (typeof detail?.isDark === 'boolean') {
        setIsDark(detail.isDark);
      }
    };
    window.addEventListener(THEME_EVENT, handler);
    return () => window.removeEventListener(THEME_EVENT, handler);
  }, [isDark]);

  const toggleDarkMode = () => {
    const next = !isDark;
    setIsDark(next);
    applyDarkMode(next);
  };

  return [isDark, toggleDarkMode];
}
