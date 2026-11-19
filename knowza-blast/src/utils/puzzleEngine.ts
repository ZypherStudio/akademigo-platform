import { CellData, CubeColor, Grid, LevelConfig, PolyominoShape, SpecialType, TargetKey } from '../types/game';

export const TOON_GRID_SIZE = 7; // 7x7 authentic Toon Blast board (Reference Image 2)
export const BLOCK_GRID_SIZE = 8; // 8x8 authentic Block Blast board

let uidCounter = 1;
export function nextUid(): string {
  uidCounter += 1;
  return `c_${Date.now().toString(36)}_${uidCounter}`;
}

export function createEmptyGrid(size = BLOCK_GRID_SIZE): Grid {
  return Array.from({ length: size }, () => Array<CellData | null>(size).fill(null));
}

export function cloneGrid(grid: Grid): Grid {
  return grid.map((row) => row.map((cell) => (cell ? { ...cell } : null)));
}

function randomColor(colors: CubeColor[]): CubeColor {
  return colors[Math.floor(Math.random() * colors.length)];
}

export function createCubeCell(color: CubeColor, extra?: Partial<CellData>): CellData {
  return {
    uid: nextUid(),
    color,
    special: null,
    obstacle: null,
    obstacleHp: 0,
    isNew: true,
    ...extra
  };
}

export function createCrateCell(): CellData {
  return {
    uid: nextUid(),
    color: null,
    special: null,
    obstacle: 'crate',
    obstacleHp: 1,
    isNew: true
  };
}

/** Creates a full 7x7 Toon Blast board matching Reference Image 2 */
export function createToonBoard(level: LevelConfig): Grid {
  const N = TOON_GRID_SIZE;
  const grid = createEmptyGrid(N);

  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      grid[r][c] = createCubeCell(randomColor(level.colors));
    }
  }

  const preset = level.obstaclePreset || 'none';
  if (preset === 'crates_side') {
    [
      [2, 0],
      [4, 0],
      [2, N - 1],
      [4, N - 1]
    ].forEach(([r, c]) => {
      grid[r][c] = createCrateCell();
    });
  } else if (preset === 'crates_mid') {
    [
      [2, 2],
      [2, 4],
      [3, 3],
      [4, 2],
      [4, 4]
    ].forEach(([r, c]) => {
      grid[r][c] = createCrateCell();
    });
  } else if (preset === 'ice_center') {
    for (let r = 2; r <= 4; r++) {
      for (let c = 2; c <= 4; c++) {
        if ((r + c) % 2 === 0 && grid[r][c]) {
          grid[r][c] = { ...grid[r][c]!, obstacle: 'ice', obstacleHp: 1 };
        }
      }
    }
  } else if (preset === 'ice_checker') {
    for (let r = 1; r <= 5; r++) {
      for (let c = 1; c <= 5; c++) {
        if ((r + c) % 2 === 1 && grid[r][c]) {
          grid[r][c] = { ...grid[r][c]!, obstacle: 'ice', obstacleHp: 1 };
        }
      }
    }
  } else if (preset === 'castle_fort') {
    [
      [2, 1],
      [2, 5],
      [4, 1],
      [4, 5]
    ].forEach(([r, c]) => {
      grid[r][c] = createCrateCell();
    });
    for (let r = 2; r <= 4; r++) {
      for (let c = 2; c <= 4; c++) {
        if (grid[r][c] && !grid[r][c]!.obstacle) {
          grid[r][c] = { ...grid[r][c]!, obstacle: 'ice', obstacleHp: 1 };
        }
      }
    }
  }

  // Guarantee healthy playable clusters at level start
  if (findAllClusters(grid).length < 4) {
    const col = level.colors[0];
    if (grid[3][2] && !grid[3][2]!.obstacle) grid[3][2] = createCubeCell(col);
    if (grid[3][3] && !grid[3][3]!.obstacle) grid[3][3] = createCubeCell(col);
    if (grid[4][3] && !grid[4][3]!.obstacle) grid[4][3] = createCubeCell(col);
  }

  return grid;
}

/** Creates an 8x8 Block Blast Adventure board with strategic starter blocks & obstacles (never pre-filling any 8/8 line) */
export function createBlockAdventureBoard(level: LevelConfig): Grid {
  const N = BLOCK_GRID_SIZE;
  const grid = createEmptyGrid(N);
  const preset = level.obstaclePreset || 'none';

  // Seed 2 symmetric starter clusters so board feels alive yet roomy for Block Blast
  const starterCoords: [number, number][] = [
    [2, 2], [2, 3], [3, 2],
    [4, 5], [5, 4], [5, 5],
    [1, 5], [1, 6],
    [6, 1], [6, 2]
  ];
  starterCoords.forEach(([r, c], idx) => {
    grid[r][c] = createCubeCell(level.colors[(idx + level.id) % level.colors.length]);
  });

  if (preset === 'crates_side') {
    [[1, 0], [6, 0], [1, 7], [6, 7]].slice(0, level.targets.crate || 4).forEach(([r, c]) => {
      grid[r][c] = createCrateCell();
    });
  } else if (preset === 'crates_mid') {
    [[3, 3], [3, 4], [4, 3], [4, 4], [2, 5]].slice(0, level.targets.crate || 4).forEach(([r, c]) => {
      grid[r][c] = createCrateCell();
    });
  } else if (preset === 'ice_center') {
    [[2, 4], [3, 3], [4, 4], [5, 3], [3, 5]].slice(0, level.targets.ice || 4).forEach(([r, c], i) => {
      grid[r][c] = createCubeCell(level.colors[i % level.colors.length], { obstacle: 'ice', obstacleHp: 1 });
    });
  } else if (preset === 'ice_checker') {
    [[1, 2], [2, 5], [4, 2], [5, 5], [6, 3], [3, 6]].slice(0, level.targets.ice || 5).forEach(([r, c], i) => {
      grid[r][c] = createCubeCell(level.colors[i % level.colors.length], { obstacle: 'ice', obstacleHp: 1 });
    });
  } else if (preset === 'castle_fort') {
    [[1, 1], [1, 6], [6, 1], [6, 6]].forEach(([r, c]) => {
      grid[r][c] = createCrateCell();
    });
    [[3, 3], [3, 4], [4, 3], [4, 4]].forEach(([r, c], i) => {
      grid[r][c] = createCubeCell(level.colors[i % level.colors.length], { obstacle: 'ice', obstacleHp: 1 });
    });
  }

  return grid;
}

export function hasAnyValidTrayMove(grid: Grid, tray: (PolyominoShape | null)[]): boolean {
  const remaining = tray.filter((s): s is PolyominoShape => s !== null);
  if (remaining.length === 0) return true;
  return remaining.some((shape) => canShapeFitAnywhere(grid, shape));
}

export function findCluster(grid: Grid, startR: number, startC: number): [number, number][] {
  const N = grid.length;
  const start = grid[startR]?.[startC];
  if (!start || !start.color || start.special || start.obstacle) return [];

  const targetColor = start.color;
  const visited = new Set<string>();
  const queue: [number, number][] = [[startR, startC]];
  const result: [number, number][] = [];

  while (queue.length > 0) {
    const [r, c] = queue.shift()!;
    const key = `${r},${c}`;
    if (visited.has(key)) continue;
    visited.add(key);

    const cell = grid[r]?.[c];
    if (!cell || cell.color !== targetColor || cell.special || cell.obstacle) continue;

    result.push([r, c]);

    const dirs: [number, number][] = [
      [r - 1, c],
      [r + 1, c],
      [r, c - 1],
      [r, c + 1]
    ];
    for (const [nr, nc] of dirs) {
      if (nr >= 0 && nr < N && nc >= 0 && nc < N && !visited.has(`${nr},${nc}`)) {
        queue.push([nr, nc]);
      }
    }
  }

  return result;
}

export function findAllClusters(grid: Grid): [number, number][][] {
  const N = grid.length;
  const seen = new Set<string>();
  const clusters: [number, number][][] = [];

  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      const key = `${r},${c}`;
      if (seen.has(key)) continue;
      const cluster = findCluster(grid, r, c);
      cluster.forEach(([cr, cc]) => seen.add(`${cr},${cc}`));
      if (cluster.length >= 2) {
        clusters.push(cluster);
      }
    }
  }
  return clusters;
}

export function getClusterHintMap(grid: Grid): Record<string, SpecialType> {
  const map: Record<string, SpecialType> = {};
  const clusters = findAllClusters(grid);
  for (const cluster of clusters) {
    let hint: SpecialType | null = null;
    if (cluster.length >= 9) hint = 'disco';
    else if (cluster.length >= 7) hint = 'bomb';
    else if (cluster.length >= 5) hint = 'rocket_h';
    if (hint) {
      for (const [r, c] of cluster) {
        map[`${r},${c}`] = hint;
      }
    }
  }
  return map;
}

/** Drops existing cells down and fills empty top cells with fresh cubes from colors (if refillColors given) */
export function applyGravityAndRefill(
  grid: Grid,
  refillColors?: CubeColor[]
): { grid: Grid; spawnedOffsets: Record<string, number> } {
  const N = grid.length;
  const next = createEmptyGrid(N);
  const spawnedOffsets: Record<string, number> = {};

  for (let c = 0; c < N; c++) {
    let writeRow = N - 1;
    for (let r = N - 1; r >= 0; r--) {
      const cell = grid[r][c];
      if (cell) {
        next[writeRow][c] = { ...cell, isNew: false };
        writeRow -= 1;
      }
    }

    if (refillColors && writeRow >= 0) {
      const emptyCount = writeRow + 1;
      for (let r = writeRow; r >= 0; r--) {
        const fresh = createCubeCell(randomColor(refillColors));
        next[r][c] = fresh;
        // Start above the top of the board by `emptyCount` rows so all new cubes waterfall down cleanly
        spawnedOffsets[fresh.uid] = r - emptyCount;
      }
    }
  }

  return { grid: next, spawnedOffsets };
}

export function applyGravity(grid: Grid): Grid {
  return applyGravityAndRefill(grid).grid;
}

/** Reshuffles normal colored cubes if zero playable moves remain on the 7x7 board */
export function ensurePlayableBoard(grid: Grid, colors: CubeColor[]): { grid: Grid; shuffled: boolean } {
  const hasCluster = findAllClusters(grid).length > 0;
  const hasSpecial = grid.some((row) => row.some((c) => c?.special));
  if (hasCluster || hasSpecial) return { grid, shuffled: false };

  const N = grid.length;
  const next = cloneGrid(grid);
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      const cell = next[r][c];
      if (cell && !cell.obstacle && !cell.special) {
        next[r][c] = createCubeCell(randomColor(colors));
      }
    }
  }
  if (findAllClusters(next).length === 0 && next[0][0] && next[0][1] && !next[0][0]!.obstacle && !next[0][1]!.obstacle) {
    next[0][1] = { ...next[0][1]!, color: next[0][0]!.color };
  }
  return { grid: next, shuffled: true };
}

export interface BlastOutcome {
  grid: Grid;
  spawnedOffsets: Record<string, number>;
  collected: Partial<Record<TargetKey, number>>;
  blastedCoords: [number, number][];
  cubesPopped: number;
  createdSpecial?: SpecialType | null;
  comboLabel?: string;
  soundType: 'pop' | 'rocket' | 'bomb' | 'disco';
  rocketBeams?: { r: number; c: number; dir: 'h' | 'v' | 'both' }[];
  bombRings?: [number, number][];
  discoTargetCoords?: [number, number][];
}

function addCollect(collected: Partial<Record<TargetKey, number>>, key: TargetKey, amount = 1) {
  collected[key] = (collected[key] || 0) + amount;
}

function detonateCoords(
  grid: Grid,
  initialCoords: [number, number][],
  collected: Partial<Record<TargetKey, number>>
): {
  blastedCoords: [number, number][];
  usedSound: 'pop' | 'rocket' | 'bomb' | 'disco';
  rocketBeams: { r: number; c: number; dir: 'h' | 'v' | 'both' }[];
  bombRings: [number, number][];
  discoTargetCoords: [number, number][];
} {
  const N = grid.length;
  const visited = new Set<string>();
  const queue: [number, number][] = [...initialCoords];
  const blasted: [number, number][] = [];
  const rocketBeams: { r: number; c: number; dir: 'h' | 'v' | 'both' }[] = [];
  const bombRings: [number, number][] = [];
  const discoTargetCoords: [number, number][] = [];
  let usedSound: 'pop' | 'rocket' | 'bomb' | 'disco' = 'pop';

  const pushCoord = (r: number, c: number) => {
    if (r >= 0 && r < N && c >= 0 && c < N && !visited.has(`${r},${c}`)) {
      queue.push([r, c]);
    }
  };

  while (queue.length > 0) {
    const [r, c] = queue.shift()!;
    const key = `${r},${c}`;
    if (visited.has(key)) continue;
    visited.add(key);

    const cell = grid[r]?.[c];
    if (!cell) continue;

    if (cell.obstacle === 'ice') {
      addCollect(collected, 'ice', 1);
      if (cell.color) addCollect(collected, cell.color, 1);
      grid[r][c] = null;
      blasted.push([r, c]);
      continue;
    }

    if (cell.obstacle === 'crate') {
      addCollect(collected, 'crate', 1);
      grid[r][c] = null;
      blasted.push([r, c]);
      continue;
    }

    if (cell.color) {
      addCollect(collected, cell.color, 1);
    }
    const spec = cell.special;
    grid[r][c] = null;
    blasted.push([r, c]);

    if (spec === 'rocket_h') {
      usedSound = 'rocket';
      rocketBeams.push({ r, c, dir: 'h' });
      for (let cc = 0; cc < N; cc++) pushCoord(r, cc);
    } else if (spec === 'rocket_v') {
      usedSound = 'rocket';
      rocketBeams.push({ r, c, dir: 'v' });
      for (let rr = 0; rr < N; rr++) pushCoord(rr, c);
    } else if (spec === 'bomb') {
      if (usedSound !== 'disco') usedSound = 'bomb';
      bombRings.push([r, c]);
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          pushCoord(r + dr, c + dc);
        }
      }
    } else if (spec === 'disco') {
      usedSound = 'disco';
      const counts: Partial<Record<CubeColor, number>> = {};
      for (let rr = 0; rr < N; rr++) {
        for (let cc = 0; cc < N; cc++) {
          const col = grid[rr][cc]?.color;
          if (col) counts[col] = (counts[col] || 0) + 1;
        }
      }
      const bestColor = (Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] as CubeColor | undefined) || 'blue';
      for (let rr = 0; rr < N; rr++) {
        for (let cc = 0; cc < N; cc++) {
          if (grid[rr][cc]?.color === bestColor) {
            discoTargetCoords.push([rr, cc]);
            pushCoord(rr, cc);
          }
        }
      }
    }
  }

  return { blastedCoords: blasted, usedSound, rocketBeams, bombRings, discoTargetCoords };
}

export function executeTapBlast(
  grid: Grid,
  r: number,
  c: number,
  refillColors?: CubeColor[]
): BlastOutcome | null {
  const N = grid.length;
  const cell = grid[r]?.[c];
  if (!cell || cell.obstacle) return null;

  const next = cloneGrid(grid);
  const collected: Partial<Record<TargetKey, number>> = {};

  // Case 1: Tapped a special booster on the board
  if (cell.special) {
    const dirs: [number, number][] = [
      [r - 1, c],
      [r + 1, c],
      [r, c - 1],
      [r, c + 1]
    ];
    const adjSpecial = dirs
      .map(([nr, nc]) => ({ nr, nc, c: next[nr]?.[nc] }))
      .find((item) => item.c && item.c.special);

    const coords: [number, number][] = [[r, c]];
    let comboLabel: string | undefined;
    let soundType: BlastOutcome['soundType'] =
      cell.special === 'disco' ? 'disco' : cell.special === 'bomb' ? 'bomb' : 'rocket';
    const extraBeams: { r: number; c: number; dir: 'h' | 'v' | 'both' }[] = [];
    const extraRings: [number, number][] = [];

    if (adjSpecial && adjSpecial.c?.special) {
      const s1 = cell.special;
      const s2 = adjSpecial.c.special;
      const { nr, nc } = adjSpecial;
      next[r][c] = null;
      next[nr][nc] = null;
      coords.length = 0;

      if (s1 === 'disco' && s2 === 'disco') {
        comboLabel = 'SÜPER GÖKKUŞAĞI!';
        soundType = 'disco';
        for (let rr = 0; rr < N; rr++) {
          for (let cc = 0; cc < N; cc++) coords.push([rr, cc]);
        }
      } else if (s1 === 'disco' || s2 === 'disco') {
        comboLabel = 'GÖKKUŞAĞI KOMBOSU!';
        soundType = 'disco';
        const otherSpec = s1 === 'disco' ? s2 : s1;
        const counts: Partial<Record<CubeColor, number>> = {};
        for (let rr = 0; rr < N; rr++) {
          for (let cc = 0; cc < N; cc++) {
            const col = next[rr][cc]?.color;
            if (col) counts[col] = (counts[col] || 0) + 1;
          }
        }
        const bestColor = (Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] as CubeColor | undefined) || 'blue';
        for (let rr = 0; rr < N; rr++) {
          for (let cc = 0; cc < N; cc++) {
            if (next[rr][cc]?.color === bestColor) {
              next[rr][cc] = {
                ...next[rr][cc]!,
                special: otherSpec === 'bomb' ? 'bomb' : Math.random() > 0.5 ? 'rocket_h' : 'rocket_v'
              };
              coords.push([rr, cc]);
            }
          }
        }
      } else if (s1 === 'bomb' && s2 === 'bomb') {
        comboLabel = 'MEGA BOMBA!';
        soundType = 'bomb';
        extraRings.push([r, c]);
        for (let dr = -2; dr <= 2; dr++) {
          for (let dc = -2; dc <= 2; dc++) coords.push([r + dr, c + dc]);
        }
      } else if (s1 === 'bomb' || s2 === 'bomb') {
        comboLabel = 'ROKET + BOMBA!';
        soundType = 'bomb';
        extraBeams.push({ r, c, dir: 'both' });
        extraRings.push([r, c]);
        for (let d = -1; d <= 1; d++) {
          for (let cc = 0; cc < N; cc++) coords.push([r + d, cc]);
          for (let rr = 0; rr < N; rr++) coords.push([rr, c + d]);
        }
      } else {
        comboLabel = 'ÇAPRAZ ROKET!';
        soundType = 'rocket';
        extraBeams.push({ r, c, dir: 'both' });
        for (let cc = 0; cc < N; cc++) coords.push([r, cc]);
        for (let rr = 0; rr < N; rr++) coords.push([rr, c]);
      }
    }

    const res = detonateCoords(next, coords, collected);
    const { grid: settled, spawnedOffsets } = applyGravityAndRefill(next, refillColors);
    return {
      grid: settled,
      spawnedOffsets,
      collected,
      blastedCoords: res.blastedCoords,
      cubesPopped: res.blastedCoords.length,
      comboLabel,
      soundType: comboLabel ? soundType : res.usedSound,
      rocketBeams: [...extraBeams, ...res.rocketBeams],
      bombRings: [...extraRings, ...res.bombRings],
      discoTargetCoords: res.discoTargetCoords
    };
  }

  // Case 2: Tapped a regular colored cluster
  const cluster = findCluster(next, r, c);
  if (cluster.length < 2) return null;

  let createdSpecial: SpecialType | null = null;
  if (cluster.length >= 9) createdSpecial = 'disco';
  else if (cluster.length >= 7) createdSpecial = 'bomb';
  else if (cluster.length >= 5) createdSpecial = Math.random() > 0.5 ? 'rocket_h' : 'rocket_v';

  const clusterSet = new Set(cluster.map(([cr, cc]) => `${cr},${cc}`));
  const blastedCoords: [number, number][] = [];

  for (const [cr, cc] of cluster) {
    const targetCell = next[cr][cc];
    if (targetCell?.color) {
      addCollect(collected, targetCell.color, 1);
    }
    next[cr][cc] = null;
    blastedCoords.push([cr, cc]);
  }

  const damagedObs = new Set<string>();
  for (const [cr, cc] of cluster) {
    const neighbors: [number, number][] = [
      [cr - 1, cc],
      [cr + 1, cc],
      [cr, cc - 1],
      [cr, cc + 1]
    ];
    for (const [nr, nc] of neighbors) {
      const nKey = `${nr},${nc}`;
      if (clusterSet.has(nKey) || damagedObs.has(nKey)) continue;
      const nCell = next[nr]?.[nc];
      if (!nCell || !nCell.obstacle) continue;
      damagedObs.add(nKey);
      if (nCell.obstacle === 'crate') {
        addCollect(collected, 'crate', 1);
        next[nr][nc] = null;
        blastedCoords.push([nr, nc]);
      } else if (nCell.obstacle === 'ice') {
        addCollect(collected, 'ice', 1);
        next[nr][nc] = { ...nCell, obstacle: null, obstacleHp: 0 };
        blastedCoords.push([nr, nc]);
      }
    }
  }

  if (createdSpecial) {
    next[r][c] = {
      uid: nextUid(),
      color: createdSpecial === 'disco' ? null : cell.color,
      special: createdSpecial,
      obstacle: null,
      isNew: true
    };
  }

  const { grid: settled, spawnedOffsets } = applyGravityAndRefill(next, refillColors);
  return {
    grid: settled,
    spawnedOffsets,
    collected,
    blastedCoords,
    cubesPopped: blastedCoords.length,
    createdSpecial,
    comboLabel:
      cluster.length >= 9
        ? 'GÖKKUŞAĞI!'
        : cluster.length >= 7
        ? 'BOMBA HAZIR!'
        : cluster.length >= 5
        ? 'ROKET HAZIR!'
        : undefined,
    soundType: 'pop'
  };
}

// ============================================================================
// BLOCK BLAST POLYOMINO ENGINE (8x8 Endless & Hybrid Blok Modu)
// ============================================================================

const SHAPE_DEFS: { name: string; cells: [number, number][] }[] = [
  { name: 'Tekli', cells: [[0, 0]] },
  { name: 'İkili Yatay', cells: [[0, 0], [0, 1]] },
  { name: 'İkili Dikey', cells: [[0, 0], [1, 0]] },
  { name: 'Üçlü Yatay', cells: [[0, 0], [0, 1], [0, 2]] },
  { name: 'Üçlü Dikey', cells: [[0, 0], [1, 0], [2, 0]] },
  { name: 'Köşe-3', cells: [[0, 0], [1, 0], [1, 1]] },
  { name: 'Ters Köşe-3', cells: [[0, 1], [1, 0], [1, 1]] },
  { name: 'Kare 2x2', cells: [[0, 0], [0, 1], [1, 0], [1, 1]] },
  { name: 'L-4', cells: [[0, 0], [1, 0], [2, 0], [2, 1]] },
  { name: 'T-4', cells: [[0, 0], [0, 1], [0, 2], [1, 1]] },
  { name: 'Z-4', cells: [[0, 0], [0, 1], [1, 1], [1, 2]] },
  { name: 'Dörtlü Yatay', cells: [[0, 0], [0, 1], [0, 2], [0, 3]] },
  { name: 'Dörtlü Dikey', cells: [[0, 0], [1, 0], [2, 0], [3, 0]] }
];

export function canPlaceShape(grid: Grid, shape: PolyominoShape, baseR: number, baseC: number): boolean {
  const N = grid.length;
  for (const [dr, dc] of shape.cells) {
    const r = baseR + dr;
    const c = baseC + dc;
    if (r < 0 || r >= N || c < 0 || c >= N) return false;
    if (grid[r][c] !== null) return false;
  }
  return true;
}

export function canShapeFitAnywhere(grid: Grid, shape: PolyominoShape): boolean {
  const N = grid.length;
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      if (canPlaceShape(grid, shape, r, c)) return true;
    }
  }
  return false;
}

export function generateBlockTray(colors: CubeColor[], grid?: Grid): PolyominoShape[] {
  const result: PolyominoShape[] = [];
  for (let i = 0; i < 3; i++) {
    const pool = i === 0 ? SHAPE_DEFS.slice(0, 8) : SHAPE_DEFS;
    const def = pool[Math.floor(Math.random() * pool.length)];
    result.push({
      id: `shape_${nextUid()}_${i}`,
      name: def.name,
      cells: def.cells,
      color: randomColor(colors)
    });
  }

  if (grid && !result.some((s) => canShapeFitAnywhere(grid, s))) {
    const smallFits = SHAPE_DEFS.slice(0, 5)
      .map((def, idx) => ({
        id: `shape_safe_${nextUid()}_${idx}`,
        name: def.name,
        cells: def.cells,
        color: randomColor(colors)
      }))
      .find((s) => canShapeFitAnywhere(grid, s));
    if (smallFits) {
      result[0] = smallFits;
    }
  }

  return result;
}

export function previewLineClears(
  grid: Grid,
  shape: PolyominoShape,
  baseR: number,
  baseC: number
): { rows: number[]; cols: number[] } {
  const N = grid.length;
  if (!canPlaceShape(grid, shape, baseR, baseC)) return { rows: [], cols: [] };
  const placedSet = new Set<string>();
  const touchedRows = new Set<number>();
  const touchedCols = new Set<number>();
  for (const [dr, dc] of shape.cells) {
    const rr = baseR + dr;
    const cc = baseC + dc;
    placedSet.add(`${rr},${cc}`);
    touchedRows.add(rr);
    touchedCols.add(cc);
  }
  const rows: number[] = [];
  const cols: number[] = [];

  for (let r = 0; r < N; r++) {
    if (!touchedRows.has(r)) continue;
    let full = true;
    for (let c = 0; c < N; c++) {
      if (!grid[r][c] && !placedSet.has(`${r},${c}`)) {
        full = false;
        break;
      }
    }
    if (full) rows.push(r);
  }

  for (let c = 0; c < N; c++) {
    if (!touchedCols.has(c)) continue;
    let full = true;
    for (let r = 0; r < N; r++) {
      if (!grid[r][c] && !placedSet.has(`${r},${c}`)) {
        full = false;
        break;
      }
    }
    if (full) cols.push(c);
  }

  return { rows, cols };
}

export interface PlaceShapeOutcome {
  grid: Grid;
  clearedRows: number[];
  clearedCols: number[];
  linesCleared: number;
  collected: Partial<Record<TargetKey, number>>;
  blastedCoords: [number, number][];
}

export function placeShapeAndClearLines(
  grid: Grid,
  shape: PolyominoShape,
  baseR: number,
  baseC: number,
  applyDropAfterClear = false
): PlaceShapeOutcome | null {
  const N = grid.length;
  if (!canPlaceShape(grid, shape, baseR, baseC)) return null;

  const next = cloneGrid(grid);
  const touchedRows = new Set<number>();
  const touchedCols = new Set<number>();
  for (const [dr, dc] of shape.cells) {
    const rr = baseR + dr;
    const cc = baseC + dc;
    next[rr][cc] = createCubeCell(shape.color);
    touchedRows.add(rr);
    touchedCols.add(cc);
  }

  const clearedRows: number[] = [];
  const clearedCols: number[] = [];

  for (let r = 0; r < N; r++) {
    if (touchedRows.has(r) && next[r].every((cell) => cell !== null)) clearedRows.push(r);
  }
  for (let c = 0; c < N; c++) {
    if (touchedCols.has(c) && next.every((row) => row[c] !== null)) clearedCols.push(c);
  }

  const collected: Partial<Record<TargetKey, number>> = {};
  const toDetonate: [number, number][] = [];

  for (const r of clearedRows) {
    for (let c = 0; c < N; c++) toDetonate.push([r, c]);
  }
  for (const c of clearedCols) {
    for (let r = 0; r < N; r++) toDetonate.push([r, c]);
  }

  let blastedCoords: [number, number][] = [];
  if (toDetonate.length > 0) {
    const res = detonateCoords(next, toDetonate, collected);
    blastedCoords = res.blastedCoords;
  }

  const finalGrid = applyDropAfterClear && toDetonate.length > 0 ? applyGravity(next) : next;

  return {
    grid: finalGrid,
    clearedRows,
    clearedCols,
    linesCleared: clearedRows.length + clearedCols.length,
    collected,
    blastedCoords
  };
}

export function applyInventoryBooster(
  grid: Grid,
  booster: 'hammer' | 'rocket' | 'bomb' | 'disco',
  r: number,
  c: number,
  refillColors?: CubeColor[]
): BlastOutcome | null {
  const N = grid.length;
  const cell = grid[r]?.[c];
  if (!cell && booster !== 'rocket' && booster !== 'bomb') return null;

  const next = cloneGrid(grid);
  const collected: Partial<Record<TargetKey, number>> = {};
  const coords: [number, number][] = [];
  let soundType: BlastOutcome['soundType'] = 'pop';
  const rocketBeams: { r: number; c: number; dir: 'h' | 'v' | 'both' }[] = [];
  const bombRings: [number, number][] = [];

  if (booster === 'hammer') {
    if (!cell) return null;
    coords.push([r, c]);
    soundType = 'pop';
  } else if (booster === 'rocket') {
    rocketBeams.push({ r, c, dir: 'both' });
    for (let cc = 0; cc < N; cc++) coords.push([r, cc]);
    for (let rr = 0; rr < N; rr++) coords.push([rr, c]);
    soundType = 'rocket';
  } else if (booster === 'bomb') {
    bombRings.push([r, c]);
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) coords.push([r + dr, c + dc]);
    }
    soundType = 'bomb';
  } else if (booster === 'disco') {
    if (!cell?.color) return null;
    const targetColor = cell.color;
    for (let rr = 0; rr < N; rr++) {
      for (let cc = 0; cc < N; cc++) {
        if (next[rr][cc]?.color === targetColor) coords.push([rr, cc]);
      }
    }
    soundType = 'disco';
  }

  const res = detonateCoords(next, coords, collected);
  if (res.blastedCoords.length === 0) return null;

  const { grid: settled, spawnedOffsets } = applyGravityAndRefill(next, refillColors);
  return {
    grid: settled,
    spawnedOffsets,
    collected,
    blastedCoords: res.blastedCoords,
    cubesPopped: res.blastedCoords.length,
    comboLabel:
      booster === 'disco'
        ? 'GÖKKUŞAĞI!'
        : booster === 'bomb'
        ? 'BOMBA!'
        : booster === 'rocket'
        ? 'ÇAPRAZ ROKET!'
        : 'ÇEKİÇ!',
    soundType,
    rocketBeams: [...rocketBeams, ...res.rocketBeams],
    bombRings: [...bombRings, ...res.bombRings],
    discoTargetCoords: res.discoTargetCoords
  };
}
