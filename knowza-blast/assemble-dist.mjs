import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const blastDir = __dirname;
const distDir = path.join(rootDir, 'dist');
const blastDistDir = path.join(blastDir, 'dist');

const run = (cmd, cwd, extraEnv = {}) => {
  execSync(cmd, {
    cwd,
    stdio: 'inherit',
    env: { ...process.env, ...extraEnv }
  });
};

// 1. Ensure knowza-blast devDependencies (vite, tsc) are installed even if NODE_ENV=production
run('npm install --include=dev --no-audit --no-fund', blastDir);

// 2. Clear root dist cleanly and typecheck/build AkademiGO into dist/akademi/
fs.rmSync(distDir, { recursive: true, force: true });
run('npx tsc && npx vite build --outDir dist/akademi --base /akademi/', rootDir);

// 3. Build Knowza Blast for root `/` and copy to dist/
run('npm run build', blastDir, { VITE_BASE_PATH: '/' });
fs.cpSync(blastDistDir, distDir, { recursive: true, force: true });

// 4. Preserve AkademiGO public/assets at /assets/* without clobbering Knowza Blast files
const rootAssetsDir = path.join(rootDir, 'public', 'assets');
const distAssetsDir = path.join(distDir, 'assets');
if (fs.existsSync(rootAssetsDir)) {
  fs.cpSync(rootAssetsDir, distAssetsDir, { recursive: true, force: false });
}

// 5. Build Knowza Blast subpath alias at dist/blast/ as well so /blast/ links keep working
run('npm run build', blastDir, { VITE_BASE_PATH: '/blast/' });
fs.cpSync(blastDistDir, path.join(distDir, 'blast'), { recursive: true, force: true });

console.log('[Build] Root `/` -> Knowza Blast, `/blast/` -> Knowza Blast, `/akademi/` -> AkademiGO');
