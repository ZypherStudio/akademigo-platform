import { CourseCategory, Lesson } from '../types';
import { RegionCode } from '../i18n/locale';

export interface OfficialSyncManifest {
  version: string;
  updatedAt: string;
  sources: Record<RegionCode, string>;
  updates: Partial<Record<RegionCode, Partial<Record<CourseCategory, Lesson[]>>>>;
}

const CACHE_KEY = 'knowza_official_manifest_v1';
const REMOTE_MANIFEST_URL =
  'https://raw.githubusercontent.com/ZypherStudio/akademigo-platform/main/public/official-tests/manifest.json';

export function loadCachedOfficialManifest(): OfficialSyncManifest | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? (JSON.parse(raw) as OfficialSyncManifest) : null;
  } catch {
    return null;
  }
}

export async function syncOfficialTests(): Promise<OfficialSyncManifest | null> {
  const urls = [REMOTE_MANIFEST_URL, '/official-tests/manifest.json'];
  for (const url of urls) {
    try {
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) continue;
      const data = (await res.json()) as OfficialSyncManifest;
      if (data && data.version) {
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(data));
        } catch {
          // ignore storage quota
        }
        return data;
      }
    } catch {
      // try next source
    }
  }
  return loadCachedOfficialManifest();
}
