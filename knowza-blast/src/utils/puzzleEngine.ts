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

export function createStoneCell(): CellData {
  return {
    uid: nextUid(),
    color: null,
    special: null,
    obstacle: 'stone',
    obstacleHp: 2,
    isNew: true
  };
}

export function createSparkCell(color: CubeColor): CellData {
  return {
    uid: nextUid(),
    color,
    special: null,
    obstacle: 'spark',
    obstacleHp: 1,
    isNew: true
  };
}

export function createEmberCell(color: CubeColor, movesLeft = 4): CellData {
  return {
    uid: nextUid(),
    color,
    special: null,
    obstacle: 'ember',
    obstacleHp: 1,
    emberMovesLeft: movesLeft,
    isNew: true
  };
}

export function createPrismCell(color: CubeColor): CellData {
  return {
    uid: nextUid(),
    color,
    special: null,
    obstacle: 'prism',
    obstacleHp: 1,
    isNew: true
  };
}

export function stampBossBlock(grid: Grid, topR = 3, leftC = 3, bossHp = 4) {
  const bossId = `boss_${topR}_${leftC}`;
  const corners: { dr: number; dc: number; corner: 'tl' | 'tr' | 'bl' | 'br' }[] = [
    { dr: 0, dc: 0, corner: 'tl' },
    { dr: 0, dc: 1, corner: 'tr' },
    { dr: 1, dc: 0, corner: 'bl' },
    { dr: 1, dc: 1, corner: 'br' }
  ];
  for (const { dr, dc, corner } of corners) {
    const r = topR + dr;
    const c = leftC + dc;
    if (grid[r]?.[c] !== undefined) {
      grid[r][c] = {
        uid: `${bossId}_${corner}`,
        color: null,
        special: null,
        obstacle: 'boss',
        obstacleHp: bossHp,
        bossMaxHp: bossHp,
        bossId,
        bossCorner: corner,
        isNew: true
      };
    }
  }
}

/** Decrements countdown timers on remaining `ember` obstacles; returns any that reached 0 and reset. */
export function tickBoardEmbers(grid: Grid): { grid: Grid; eruptedCoords: [number, number][] } {
  const N = grid.length;
  const next = cloneGrid(grid);
  const eruptedCoords: [number, number][] = [];
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      const cell = next[r][c];
      if (!cell || cell.obstacle !== 'ember') continue;
      const rem = (cell.emberMovesLeft ?? 4) - 1;
      if (rem <= 0) {
        eruptedCoords.push([r, c]);
        next[r][c] = { ...cell, emberMovesLeft: 3, isNew: true };
      } else {
        next[r][c] = { ...cell, emberMovesLeft: rem };
      }
    }
  }
  return { grid: next, eruptedCoords };
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
  } else if (preset === 'stone_guard') {
    [[2, 3], [2, 4], [5, 3], [5, 4], [3, 1], [4, 6]]
      .slice(0, level.targets.stone || 4)
      .forEach(([r, c]) => {
        grid[r][c] = createStoneCell();
      });
  } else if (preset === 'spark_grid') {
    [[1, 3], [3, 6], [6, 4], [4, 1], [2, 5], [5, 2]]
      .slice(0, level.targets.spark || 4)
      .forEach(([r, c], i) => {
        grid[r][c] = createSparkCell(level.colors[i % level.colors.length]);
      });
  } else if (preset === 'ember_forge') {
    [[2, 1], [2, 6], [5, 1], [5, 6], [3, 4]]
      .slice(0, level.targets.ember || 3)
      .forEach(([r, c], i) => {
        grid[r][c] = createEmberCell(level.colors[i % level.colors.length], 4 + (i % 2));
      });
    [[1, 3], [6, 4]].slice(0, level.targets.stone || 0).forEach(([r, c]) => {
      grid[r][c] = createStoneCell();
    });
  } else if (preset === 'prism_vault') {
    [[1, 2], [2, 5], [5, 2], [6, 5], [3, 6]]
      .slice(0, level.targets.prism || 4)
      .forEach(([r, c], i) => {
        grid[r][c] = createPrismCell(level.colors[i % level.colors.length]);
      });
  } else if (preset === 'boss_arena') {
    [[1, 1], [1, 6], [6, 1], [6, 6]].forEach(([r, c], i) => {
      grid[r][c] =
        i % 2 === 0
          ? createCrateCell()
          : createPrismCell(level.colors[i % level.colors.length]);
    });
  } else if (preset === 'cosmos_mix') {
    [[2, 2], [5, 5], [2, 5]].slice(0, level.targets.stone || 3).forEach(([r, c]) => {
      grid[r][c] = createStoneCell();
    });
    [[1, 4], [4, 1], [6, 3], [3, 6]].slice(0, level.targets.spark || 3).forEach(([r, c], i) => {
      grid[r][c] = createSparkCell(level.colors[i % level.colors.length]);
    });
    if (level.targets.prism) {
      grid[1][1] = createPrismCell(level.colors[0]);
      grid[6][6] = createPrismCell(level.colors[1]);
    }
    if (level.targets.ember) {
      grid[1][6] = createEmberCell(level.colors[2], 4);
    }
  }

  // Every 5th milestone Boss level spawns a unified 2x2 armored Boss cube at center (3,3)-(4,4)
  if (level.targets.boss && level.targets.boss > 0) {
    const bossHp = Math.min(8, 4 + Math.floor(level.id / 60));
    stampBossBlock(grid, 3, 3, bossHp);
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
  crackedCount: number;
  usedSound: 'pop' | 'rocket' | 'bomb' | 'disco';
  rocketBeams: { r: number; c: number; dir: 'h' | 'v' | 'both' }[];
  bombRings: [number, number][];
  discoTargetCoords: [number, number][];
  superFusionTriggered: boolean;
} {
  const N = grid.length;
  const visited = new Set<string>();
  const queued = new Set<string>(initialCoords.map(([r, c]) => `${r},${c}`));
  const queue: [number, number][] = [...initialCoords];
  const blasted: [number, number][] = [];
  const rocketBeams: { r: number; c: number; dir: 'h' | 'v' | 'both' }[] = [];
  const bombRings: [number, number][] = [];
  const discoTargetCoords: [number, number][] = [];
  const bossGroupsDamaged = new Set<string>();
  let specialsCount = 0;
  let superFusionTriggered = false;
  let usedSound: 'pop' | 'rocket' | 'bomb' | 'disco' = 'pop';
  let crackedCount = 0;

  const pushCoord = (r: number, c: number) => {
    const k = `${r},${c}`;
    if (r >= 0 && r < N && c >= 0 && c < N && !visited.has(k) && !queued.has(k)) {
      queued.add(k);
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

    if (cell.obstacle === 'boss') {
      const bId = cell.bossId || 'boss_center';
      if (bossGroupsDamaged.has(bId)) continue;
      bossGroupsDamaged.add(bId);
      const curHp = cell.obstacleHp ?? 4;
      const nextHp = curHp - 1;
      if (nextHp <= 0) {
        addCollect(collected, 'boss', 1);
        usedSound = 'bomb';
        bombRings.push([r, c]);
        for (let rr = 0; rr < N; rr++) {
          for (let cc = 0; cc < N; cc++) {
            const targetCell = grid[rr][cc];
            if (targetCell?.obstacle === 'boss' && (targetCell.bossId || 'boss_center') === bId) {
              grid[rr][cc] = null;
              blasted.push([rr, cc]);
              visited.add(`${rr},${cc}`);
            }
          }
        }
      } else {
        crackedCount += 1;
        for (let rr = 0; rr < N; rr++) {
          for (let cc = 0; cc < N; cc++) {
            const targetCell = grid[rr][cc];
            if (targetCell?.obstacle === 'boss' && (targetCell.bossId || 'boss_center') === bId) {
              grid[rr][cc] = { ...targetCell, obstacleHp: nextHp, isNew: true };
            }
          }
        }
      }
      continue;
    }

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

    if (cell.obstacle === 'stone') {
      const hp = cell.obstacleHp ?? 2;
      if (hp > 1) {
        grid[r][c] = { ...cell, obstacleHp: hp - 1, isNew: true };
        crackedCount += 1;
      } else {
        addCollect(collected, 'stone', 1);
        grid[r][c] = null;
        blasted.push([r, c]);
      }
      continue;
    }

    if (cell.obstacle === 'spark') {
      addCollect(collected, 'spark', 1);
      if (cell.color) addCollect(collected, cell.color, 1);
      grid[r][c] = null;
      blasted.push([r, c]);
      if (usedSound === 'pop') usedSound = 'rocket';
      // Chain zap the 4 orthogonal neighbors
      pushCoord(r - 1, c);
      pushCoord(r + 1, c);
      pushCoord(r, c - 1);
      pushCoord(r, c + 1);
      continue;
    }

    if (cell.obstacle === 'ember') {
      addCollect(collected, 'ember', 1);
      if (cell.color) addCollect(collected, cell.color, 1);
      grid[r][c] = null;
      blasted.push([r, c]);
      if (usedSound !== 'disco') usedSound = 'bomb';
      bombRings.push([r, c]);
      // Clearing an ember unleashes a 3x3 thermal ring around it
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          pushCoord(r + dr, c + dc);
        }
      }
      continue;
    }

    if (cell.obstacle === 'prism') {
      addCollect(collected, 'prism', 1);
      if (cell.color) addCollect(collected, cell.color, 1);
      grid[r][c] = null;
      blasted.push([r, c]);
      if (usedSound === 'pop') usedSound = 'rocket';
      // Refract crystal laser beams onto up to 2 surviving board tiles (prioritizing remaining obstacles)
      const prismTargets: [number, number][] = [];
      for (let pass = 0; pass < 2 && prismTargets.length < 2; pass++) {
        for (let rr = 0; rr < N && prismTargets.length < 2; rr++) {
          for (let cc = 0; cc < N && prismTargets.length < 2; cc++) {
            const k = `${rr},${cc}`;
            const cand = grid[rr][cc];
            if (!cand || visited.has(k) || queued.has(k)) continue;
            if (pass === 0 ? Boolean(cand.obstacle) : Boolean(cand.color || cand.special)) {
              prismTargets.push([rr, cc]);
              pushCoord(rr, cc);
            }
          }
        }
      }
      prismTargets.forEach((pt) => discoTargetCoords.push(pt));
      continue;
    }

    if (cell.color) {
      addCollect(collected, cell.color, 1);
    }
    const spec = cell.special;
    grid[r][c] = null;
    blasted.push([r, c]);

    if (spec) {
      specialsCount += 1;
      if (specialsCount >= 2 && !superFusionTriggered) {
        superFusionTriggered = true;
        usedSound = 'disco';
        // Super Power Fusion: combining 2+ specials unleashes a 3-row + 3-col mega cross storm!
        for (let offset = -1; offset <= 1; offset++) {
          const sr = r + offset;
          const sc = c + offset;
          if (sr >= 0 && sr < N) {
            rocketBeams.push({ r: sr, c, dir: 'h' });
            for (let cc = 0; cc < N; cc++) pushCoord(sr, cc);
          }
          if (sc >= 0 && sc < N) {
            rocketBeams.push({ r, c: sc, dir: 'v' });
            for (let rr = 0; rr < N; rr++) pushCoord(rr, sc);
          }
        }
      }
    }

    if (spec === 'rocket_h') {
      if (usedSound !== 'disco') usedSound = 'rocket';
      rocketBeams.push({ r, c, dir: 'h' });
      for (let cc = 0; cc < N; cc++) pushCoord(r, cc);
    } else if (spec === 'rocket_v') {
      if (usedSound !== 'disco') usedSound = 'rocket';
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

  return {
    blastedCoords: blasted,
    crackedCount,
    usedSound,
    rocketBeams,
    bombRings,
    discoTargetCoords,
    superFusionTriggered
  };
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
  { name: 'Dörtlü Dikey', cells: [[0, 0], [1, 0], [2, 0], [3, 0]] },
  // Advanced shapes (index 13+) for deeper tactical variety
  { name: 'J-4', cells: [[0, 1], [1, 1], [2, 1], [2, 0]] },
  { name: 'S-4', cells: [[0, 1], [0, 2], [1, 0], [1, 1]] },
  { name: 'Blok 2x3', cells: [[0, 0], [0, 1], [0, 2], [1, 0], [1, 1], [1, 2]] },
  { name: 'Blok 3x2', cells: [[0, 0], [0, 1], [1, 0], [1, 1], [2, 0], [2, 1]] },
  { name: 'Dev Kare 3x3', cells: [[0, 0], [0, 1], [0, 2], [1, 0], [1, 1], [1, 2], [2, 0], [2, 1], [2, 2]] },
  { name: 'Artı-5', cells: [[0, 1], [1, 0], [1, 1], [1, 2], [2, 1]] },
  { name: 'U-5', cells: [[0, 0], [0, 2], [1, 0], [1, 1], [1, 2]] },
  { name: 'Beşli Yatay', cells: [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]] },
  { name: 'Beşli Dikey', cells: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0]] }
];

/** Rotates a polyomino shape 90 degrees clockwise normalized to (0,0) top-left. */
export function rotatePolyomino(shape: PolyominoShape): PolyominoShape {
  const rotated = shape.cells.map(([r, c]) => [c, -r] as [number, number]);
  let minR = Infinity;
  let minC = Infinity;
  for (const [r, c] of rotated) {
    if (r < minR) minR = r;
    if (c < minC) minC = c;
  }
  const normalized = rotated.map(([r, c]) => [r - minR, c - minC] as [number, number]);

  let nextSpecial = shape.specialCell;
  if (nextSpecial) {
    const flipped: SpecialType =
      nextSpecial.special === 'rocket_h'
        ? 'rocket_v'
        : nextSpecial.special === 'rocket_v'
        ? 'rocket_h'
        : nextSpecial.special;
    nextSpecial = { ...nextSpecial, special: flipped };
  }

  return {
    ...shape,
    id: `${shape.id}_r`,
    cells: normalized,
    specialCell: nextSpecial
  };
}

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

export interface TrayOptions {
  allowAdvanced?: boolean;
  forceSpecial?: boolean;
  specialChance?: number;
  hardMode?: boolean;
  guaranteeFit?: boolean;
  rng?: () => number;
}

export function hashSeedString(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function createSeededRng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Generates the exact same 8x8 starter board worldwide for a given YYYY-MM-DD calendar date. */
export function createDailyChallengeBoard(
  dateStr: string,
  colors: CubeColor[] = ['blue', 'yellow', 'red', 'green', 'purple']
): Grid {
  const rng = createSeededRng(hashSeedString(`daily_board_${dateStr}`));
  const grid = createEmptyGrid(BLOCK_GRID_SIZE);

  // Symmetric center + corner islands (~14 starter cubes) so lines are exciting from turn 1
  const candidateCoords: [number, number][] = [
    [2, 2],
    [2, 5],
    [5, 2],
    [5, 5],
    [3, 3],
    [3, 4],
    [4, 3],
    [4, 4],
    [1, 3],
    [1, 4],
    [6, 3],
    [6, 4]
  ];
  for (const [r, c] of candidateCoords) {
    if (rng() < 0.72) {
      const col = colors[Math.floor(rng() * colors.length)];
      grid[r][c] = {
        uid: `d_${dateStr}_${r}_${c}`,
        color: col,
        special: null,
        obstacle: rng() < 0.2 ? 'ice' : null,
        obstacleHp: rng() < 0.2 ? 1 : 0,
        isNew: true
      };
    }
  }
  return grid;
}

/** Deterministic 3-piece daily tray shared globally per date and turn index. */
export function generateSeededBlockTray(
  dateStr: string,
  turnIdx: number,
  colors: CubeColor[],
  grid?: Grid,
  options: Omit<TrayOptions, 'rng'> = {}
): PolyominoShape[] {
  const rng = createSeededRng(hashSeedString(`daily_tray_${dateStr}_t${turnIdx}`));
  return generateBlockTray(colors, grid, { ...options, rng }).map((shape, idx) => ({
    ...shape,
    id: `daily_${dateStr}_t${turnIdx}_${idx}`
  }));
}

export function generateBlockTray(
  colors: CubeColor[],
  grid?: Grid,
  options: TrayOptions = {}
): PolyominoShape[] {
  const {
    allowAdvanced = true,
    forceSpecial = false,
    specialChance = 0.28,
    hardMode = false,
    guaranteeFit = true,
    rng = Math.random
  } = options;
  const maxPool = allowAdvanced ? SHAPE_DEFS : SHAPE_DEFS.slice(0, 13);
  const hardPool = SHAPE_DEFS.slice(7); // Larger L, T, Z, 3x3, 2x3, 5-bar shapes for real challenge
  const result: PolyominoShape[] = [];
  const specialPool: SpecialType[] = ['rocket_h', 'rocket_v', 'bomb'];

  for (let i = 0; i < 3; i++) {
    const pool = hardMode
      ? i === 0
        ? SHAPE_DEFS.slice(1)
        : hardPool
      : i === 0
      ? SHAPE_DEFS.slice(0, 8)
      : maxPool;
    const def = pool[Math.floor(rng() * pool.length)];
    result.push({
      id: `shape_${nextUid()}_${i}`,
      name: def.name,
      cells: def.cells,
      color: colors[Math.floor(rng() * colors.length)]
    });
  }

  // Embed special Rocket/Bomb/Disco power cell into one tray piece for chain-blast variety
  const attachIdx = forceSpecial ? 1 : rng() < specialChance ? 1 : -1;
  if (attachIdx >= 0 && result[attachIdx]) {
    const target = result[attachIdx];
    const cellIndex = Math.floor(rng() * target.cells.length);
    const chosenSpecial: SpecialType =
      forceSpecial && rng() < 0.35
        ? 'disco'
        : specialPool[Math.floor(rng() * specialPool.length)];
    result[attachIdx] = {
      ...target,
      specialCell: { index: cellIndex, special: chosenSpecial },
      isGoldBonus: forceSpecial
    };
  }

  if (guaranteeFit && grid && !result.some((s) => canShapeFitAnywhere(grid, s))) {
    const smallFits = SHAPE_DEFS.slice(0, 5)
      .map((def, idx) => ({
        id: `shape_safe_${nextUid()}_${idx}`,
        name: def.name,
        cells: def.cells,
        color: colors[Math.floor(rng() * colors.length)]
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
  rocketBeams: { r: number; c: number; dir: 'h' | 'v' | 'both' }[];
  bombRings: [number, number][];
  discoTargetCoords: [number, number][];
  specialsTriggered: number;
  superFusionTriggered: boolean;
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
  shape.cells.forEach(([dr, dc], idx) => {
    const rr = baseR + dr;
    const cc = baseC + dc;
    const embeddedSpecial = shape.specialCell?.index === idx ? shape.specialCell.special : null;
    next[rr][cc] = createCubeCell(shape.color, embeddedSpecial ? { special: embeddedSpecial } : undefined);
    touchedRows.add(rr);
    touchedCols.add(cc);
  });

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
  let rocketBeams: { r: number; c: number; dir: 'h' | 'v' | 'both' }[] = [];
  let bombRings: [number, number][] = [];
  let discoTargetCoords: [number, number][] = [];
  let superFusionTriggered = false;

  if (toDetonate.length > 0) {
    const res = detonateCoords(next, toDetonate, collected);
    blastedCoords = res.blastedCoords;
    rocketBeams = res.rocketBeams;
    bombRings = res.bombRings;
    discoTargetCoords = res.discoTargetCoords;
    superFusionTriggered = res.superFusionTriggered;
  }

  const finalGrid = applyDropAfterClear && toDetonate.length > 0 ? applyGravity(next) : next;

  return {
    grid: finalGrid,
    clearedRows,
    clearedCols,
    linesCleared: clearedRows.length + clearedCols.length,
    collected,
    blastedCoords,
    rocketBeams,
    bombRings,
    discoTargetCoords,
    specialsTriggered: rocketBeams.length + bombRings.length + (discoTargetCoords.length > 0 ? 1 : 0),
    superFusionTriggered
  };
}

/** Strikes up to `count` obstacles or crowded blocks when Knowza Fever activates! */
export function strikeFeverLightning(
  grid: Grid,
  count = 3
): { grid: Grid; blastedCoords: [number, number][]; collected: Partial<Record<TargetKey, number>> } {
  const N = grid.length;
  const next = cloneGrid(grid);
  const obstacleCoords: [number, number][] = [];
  const blockCoords: [number, number][] = [];

  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      const cell = next[r][c];
      if (!cell) continue;
      if (cell.obstacle) obstacleCoords.push([r, c]);
      else blockCoords.push([r, c]);
    }
  }

  const picks: [number, number][] = [...obstacleCoords.slice(0, count)];
  while (picks.length < count && blockCoords.length > 0) {
    const idx = Math.floor(Math.random() * blockCoords.length);
    picks.push(blockCoords.splice(idx, 1)[0]);
  }

  const collected: Partial<Record<TargetKey, number>> = {};
  if (picks.length === 0) {
    return { grid: next, blastedCoords: [], collected };
  }
  const res = detonateCoords(next, picks, collected);
  return { grid: next, blastedCoords: res.blastedCoords, collected };
}

export function applyInventoryBooster(
  grid: Grid,
  booster: 'hammer' | 'rocket' | 'bomb' | 'disco',
  r: number,
  c: number,
  refillColors?: CubeColor[],
  staticBoard = false
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
  if (res.blastedCoords.length === 0 && res.crackedCount === 0) return null;

  const { grid: settled, spawnedOffsets } = staticBoard
    ? { grid: next, spawnedOffsets: {} }
    : applyGravityAndRefill(next, refillColors);
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
