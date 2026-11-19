import { describe, expect, it } from 'vitest';
import { LEVELS } from '../../data/levels';
import { PolyominoShape } from '../../types/game';
import {
  BLOCK_GRID_SIZE,
  TOON_GRID_SIZE,
  applyGravity,
  applyGravityAndRefill,
  applyInventoryBooster,
  canPlaceShape,
  createBlockAdventureBoard,
  createCrateCell,
  createCubeCell,
  createEmptyGrid,
  createToonBoard,
  ensurePlayableBoard,
  executeTapBlast,
  findCluster,
  generateBlockTray,
  getClusterHintMap,
  hasAnyValidTrayMove,
  placeShapeAndClearLines,
  previewLineClears
} from '../puzzleEngine';
import { assetUrl } from '../assets';
import { TOUCH_LIFT_PX, computeBlockDropCell, getShapeBounds } from '../blockDrag';

describe('Knowza Blast Engine (7x7 Toon Blast + 8x8 Block & Patlat)', () => {
  it('createToonBoard spawns a full 7x7 board with playable 2+ clusters', () => {
    for (const lvl of LEVELS.slice(0, 10)) {
      const grid = createToonBoard(lvl);
      expect(grid).toHaveLength(TOON_GRID_SIZE);
      for (let r = 0; r < TOON_GRID_SIZE; r++) {
        expect(grid[r]).toHaveLength(TOON_GRID_SIZE);
        expect(grid[r].every((cell) => cell !== null)).toBe(true);
      }
      let foundCluster = false;
      for (let r = 0; r < TOON_GRID_SIZE && !foundCluster; r++) {
        for (let c = 0; c < TOON_GRID_SIZE && !foundCluster; c++) {
          if (findCluster(grid, r, c).length >= 2) foundCluster = true;
        }
      }
      expect(foundCluster).toBe(true);
    }
  });

  it('findCluster finds connected matching cubes and stops at obstacles/specials', () => {
    const grid = createEmptyGrid(TOON_GRID_SIZE);
    grid[6][0] = createCubeCell('blue');
    grid[6][1] = createCubeCell('blue');
    grid[5][1] = createCubeCell('blue');
    grid[5][2] = createCubeCell('blue', { obstacle: 'ice', obstacleHp: 1 });
    grid[6][2] = createCubeCell('red');

    const cluster = findCluster(grid, 6, 0);
    expect(cluster).toHaveLength(3);
    expect(findCluster(grid, 5, 2)).toHaveLength(0);
    expect(findCluster(grid, 6, 2)).toHaveLength(1);
  });

  it('spawns Rocket for 5+, Bomb for 7+, and Disco for 9+ clusters', () => {
    const g5 = createEmptyGrid(TOON_GRID_SIZE);
    for (let c = 0; c < 5; c++) g5[6][c] = createCubeCell('yellow');
    expect(getClusterHintMap(g5)['6,0']).toBe('rocket_h');
    const res5 = executeTapBlast(g5, 6, 2, ['yellow', 'blue']);
    expect(res5?.createdSpecial).toMatch(/^rocket_/);

    const g7 = createEmptyGrid(TOON_GRID_SIZE);
    for (let c = 0; c < 7; c++) g7[6][c] = createCubeCell('red');
    expect(getClusterHintMap(g7)['6,3']).toBe('bomb');
    const res7 = executeTapBlast(g7, 6, 3, ['red', 'blue']);
    expect(res7?.createdSpecial).toBe('bomb');

    const g9 = createEmptyGrid(TOON_GRID_SIZE);
    for (let c = 0; c < 7; c++) g9[6][c] = createCubeCell('green');
    g9[5][0] = createCubeCell('green');
    g9[5][1] = createCubeCell('green');
    expect(getClusterHintMap(g9)['5,0']).toBe('disco');
    const res9 = executeTapBlast(g9, 5, 0, ['green', 'blue']);
    expect(res9?.createdSpecial).toBe('disco');
  });

  it('executeTapBlast with refillColors refills the 7x7 board and emits negative spawnedOffsets', () => {
    const grid = createToonBoard(LEVELS[0]);
    // Guarantee a 3-cube blue cluster at top-left
    grid[2][0] = createCubeCell('blue');
    grid[3][0] = createCubeCell('blue');
    grid[4][0] = createCubeCell('blue');
    // Ensure top rows in col 0 are non-blue so only those 3 blast
    grid[0][0] = createCubeCell('red');
    grid[1][0] = createCubeCell('yellow');

    const outcome = executeTapBlast(grid, 4, 0, LEVELS[0].colors);
    expect(outcome).not.toBeNull();
    expect(Object.keys(outcome!.spawnedOffsets).length).toBeGreaterThanOrEqual(3);
    Object.values(outcome!.spawnedOffsets).forEach((offset) => {
      expect(offset).toBeLessThan(0);
    });
    // Board remains 100% full (49 cells)
    for (let r = 0; r < TOON_GRID_SIZE; r++) {
      for (let c = 0; c < TOON_GRID_SIZE; c++) {
        expect(outcome!.grid[r][c]).not.toBeNull();
      }
    }
  });

  it('damages adjacent crates and melts adjacent ice when a cluster blasts', () => {
    const grid = createEmptyGrid(TOON_GRID_SIZE);
    grid[6][0] = createCubeCell('blue');
    grid[6][1] = createCubeCell('blue');
    grid[6][2] = createCrateCell();
    grid[5][1] = createCubeCell('red', { obstacle: 'ice', obstacleHp: 1 });

    const outcome = executeTapBlast(grid, 6, 0);
    expect(outcome).not.toBeNull();
    expect(outcome!.collected.blue).toBe(2);
    expect(outcome!.collected.crate).toBe(1);
    expect(outcome!.collected.ice).toBe(1);
    expect(outcome!.grid[6][2]).toBeNull();
    expect(outcome!.grid[6][1]?.color).toBe('red');
    expect(outcome!.grid[6][1]?.obstacle).toBeNull();
  });

  it('executes Booster + Booster super combos and produces beams/rings', () => {
    const grid = createEmptyGrid(TOON_GRID_SIZE);
    for (let r = 0; r < TOON_GRID_SIZE; r++) {
      for (let c = 0; c < TOON_GRID_SIZE; c++) {
        grid[r][c] = createCubeCell('blue');
      }
    }
    grid[3][3] = createCubeCell('red', { special: 'rocket_h' });
    grid[3][4] = createCubeCell('yellow', { special: 'bomb' });

    const outcome = executeTapBlast(grid, 3, 3, ['blue', 'yellow']);
    expect(outcome).not.toBeNull();
    expect(outcome!.comboLabel).toBe('ROKET + BOMBA!');
    expect(outcome!.cubesPopped).toBeGreaterThanOrEqual(25);
    expect(outcome!.rocketBeams?.length).toBeGreaterThanOrEqual(1);
    expect(outcome!.bombRings?.length).toBeGreaterThanOrEqual(1);
  });

  it('applyGravityAndRefill preserves uid of surviving cubes for smooth animation', () => {
    const grid = createEmptyGrid(TOON_GRID_SIZE);
    const survivor = createCubeCell('green');
    grid[1][4] = survivor;
    const { grid: settled, spawnedOffsets } = applyGravityAndRefill(grid, ['red', 'blue']);
    expect(settled[6][4]?.uid).toBe(survivor.uid);
    expect(spawnedOffsets[survivor.uid]).toBeUndefined();
    expect(Object.keys(spawnedOffsets)).toHaveLength(48);
  });

  it('ensurePlayableBoard reshuffles a deadlocked board into a playable one', () => {
    const grid = createEmptyGrid(TOON_GRID_SIZE);
    const colors = ['blue', 'yellow', 'red', 'green'] as const;
    for (let r = 0; r < TOON_GRID_SIZE; r++) {
      for (let c = 0; c < TOON_GRID_SIZE; c++) {
        grid[r][c] = createCubeCell(colors[(r * 2 + c) % 4]);
      }
    }
    const { grid: fixed, shuffled } = ensurePlayableBoard(grid, [...colors]);
    expect(shuffled).toBe(true);
    let anyPair = false;
    for (let r = 0; r < TOON_GRID_SIZE && !anyPair; r++) {
      for (let c = 0; c < TOON_GRID_SIZE && !anyPair; c++) {
        if (findCluster(fixed, r, c).length >= 2) anyPair = true;
      }
    }
    expect(anyPair).toBe(true);
  });

  it('8x8 Block Blast placeShapeAndClearLines only clears touched full lines', () => {
    const grid = createEmptyGrid(BLOCK_GRID_SIZE);
    for (let c = 0; c < 7; c++) grid[7][c] = createCubeCell('blue');
    for (let c = 0; c < 8; c++) grid[0][c] = createCubeCell('green');

    const singlePiece: PolyominoShape = {
      id: 'p1',
      name: 'Tekli',
      cells: [[0, 0]],
      color: 'red'
    };

    expect(canPlaceShape(grid, singlePiece, 7, 7)).toBe(true);
    expect(previewLineClears(grid, singlePiece, 7, 7)).toEqual({ rows: [7], cols: [] });

    const placed = placeShapeAndClearLines(grid, singlePiece, 7, 7, true);
    expect(placed).not.toBeNull();
    expect(placed!.clearedRows).toEqual([7]);
    expect(placed!.linesCleared).toBe(1);
    expect(placed!.collected.blue).toBe(7);
    expect(placed!.collected.red).toBe(1);
  });

  it('generateBlockTray guarantees at least one piece fits on a tight board', () => {
    const grid = createEmptyGrid(BLOCK_GRID_SIZE);
    for (let r = 0; r < BLOCK_GRID_SIZE; r++) {
      for (let c = 0; c < BLOCK_GRID_SIZE; c++) {
        grid[r][c] = createCubeCell('blue');
      }
    }
    grid[0][0] = null;
    const tray = generateBlockTray(['blue', 'red'], grid);
    expect(tray).toHaveLength(3);
    expect(tray.some((shape) => canPlaceShape(grid, shape, 0, 0))).toBe(true);
  });

  it('applyInventoryBooster supports hammer, rocket, bomb, and disco with refill', () => {
    const grid = createEmptyGrid(TOON_GRID_SIZE);
    grid[6][0] = createCubeCell('red');
    grid[6][1] = createCubeCell('red');
    grid[5][0] = createCubeCell('blue');

    const discoRes = applyInventoryBooster(grid, 'disco', 6, 0, ['red', 'blue']);
    expect(discoRes?.collected.red).toBe(2);

    const hammerRes = applyInventoryBooster(grid, 'hammer', 5, 0, ['red', 'blue']);
    expect(hammerRes?.collected.blue).toBe(1);
    expect(applyGravity(grid)[6][0]?.color).toBe('red');
  });

  it('createBlockAdventureBoard builds an 8x8 board with no pre-completed lines and preserves obstacles', () => {
    for (const lvl of LEVELS.slice(0, 15)) {
      const grid = createBlockAdventureBoard(lvl);
      expect(grid).toHaveLength(BLOCK_GRID_SIZE);
      for (let r = 0; r < BLOCK_GRID_SIZE; r++) {
        expect(grid[r]).toHaveLength(BLOCK_GRID_SIZE);
        expect(grid[r].every((cell) => cell !== null)).toBe(false);
      }
      for (let c = 0; c < BLOCK_GRID_SIZE; c++) {
        expect(grid.every((row) => row[c] !== null)).toBe(false);
      }
      if (lvl.obstaclePreset === 'crates_side' || lvl.obstaclePreset === 'crates_mid') {
        const hasCrate = grid.some((row) => row.some((cell) => cell?.obstacle === 'crate'));
        expect(hasCrate).toBe(true);
      }
      if (lvl.obstaclePreset === 'ice_center' || lvl.obstaclePreset === 'ice_checker') {
        const hasIce = grid.some((row) => row.some((cell) => cell?.obstacle === 'ice'));
        expect(hasIce).toBe(true);
      }
      if (lvl.obstaclePreset === 'castle_fort') {
        const hasCrate = grid.some((row) => row.some((cell) => cell?.obstacle === 'crate'));
        const hasIce = grid.some((row) => row.some((cell) => cell?.obstacle === 'ice'));
        expect(hasCrate && hasIce).toBe(true);
      }
    }
  });

  it('hasAnyValidTrayMove detects deadlock vs playable tray accurately', () => {
    const grid = createEmptyGrid(BLOCK_GRID_SIZE);
    for (let r = 0; r < BLOCK_GRID_SIZE; r++) {
      for (let c = 0; c < BLOCK_GRID_SIZE; c++) {
        grid[r][c] = createCubeCell('blue');
      }
    }
    grid[0][0] = null;

    const blockedShape: PolyominoShape = {
      id: 'domino',
      name: 'İkili',
      cells: [
        [0, 0],
        [0, 1]
      ],
      color: 'red'
    };
    const singleShape: PolyominoShape = {
      id: 'single',
      name: 'Tekli',
      cells: [[0, 0]],
      color: 'yellow'
    };

    expect(hasAnyValidTrayMove(grid, [blockedShape, null, null])).toBe(false);
    expect(hasAnyValidTrayMove(grid, [blockedShape, singleShape, null])).toBe(true);
    expect(hasAnyValidTrayMove(grid, [null, null, null])).toBe(true);
  });

  it('assetUrl strips leading slashes cleanly and blockDrag computes touch-lifted drop cells accurately', () => {
    expect(assetUrl('/assets/bg_gameplay.jpg')).toMatch(/assets\/bg_gameplay\.jpg$/);
    expect(assetUrl('/assets/bg_gameplay.jpg').startsWith('//')).toBe(false);

    const rectBoard = {
      getBoundingClientRect: () => ({
        left: 0,
        top: 100,
        width: 320,
        height: 320,
        right: 320,
        bottom: 420,
        x: 0,
        y: 100,
        toJSON: () => ({})
      })
    } as unknown as HTMLElement;

    const emptyGrid = createEmptyGrid(BLOCK_GRID_SIZE);
    const barShape: PolyominoShape = {
      id: 'bar2',
      name: 'İkili',
      cells: [
        [0, 0],
        [0, 1]
      ],
      color: 'blue'
    };
    expect(getShapeBounds(barShape)).toEqual({ rows: 1, cols: 2 });

    // Cell is 40x40; row 2 center is y=200, with TOUCH_LIFT_PX lifted from finger
    const drop = computeBlockDropCell(rectBoard, emptyGrid, 40, 200 + TOUCH_LIFT_PX, 'touch', barShape);
    expect(drop).toEqual({ hoverR: 2, hoverC: 0, canDrop: true });
  });
});
