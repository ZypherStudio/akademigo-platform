const BASE = import.meta.env.BASE_URL || '/';

/** Resolves a public asset path cleanly under both root `/` and subpath `/blast/` deployments. */
export function assetUrl(path: string): string {
  const clean = path.replace(/^\/+/, '');
  return `${BASE.endsWith('/') ? BASE : `${BASE}/`}${clean}`;
}
