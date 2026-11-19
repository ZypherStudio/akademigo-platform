/** Triggers lightweight mobile vibration feedback when haptics are enabled and supported. */
export function triggerHaptic(enabled: boolean, pattern: number | number[]): void {
  if (!enabled || typeof navigator === 'undefined' || typeof navigator.vibrate !== 'function') {
    return;
  }
  try {
    navigator.vibrate(pattern);
  } catch {
    // Ignore on browsers/webviews that disallow vibration
  }
}
