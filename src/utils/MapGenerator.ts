class MapGenerator {
  static generateMap(width: number, height: number, steps: number): boolean[][] {
    let map = this.initializeMap(width, height);
    for (let i = 0; i < steps; i++) {
      map = this.iterateMap(map);
    }
    return map;
  }

  private static initializeMap(width: number, height: number): boolean[][] {
    const map: boolean[][] = [];
    for (let y = 0; y < height; y++) {
      const row: boolean[] = [];
      for (let x = 0; x < width; x++) {
        row.push(Math.random() < 0.5);
      }
      map.push(row);
    }
    return map;
  }

  private static iterateMap(map: boolean[][]): boolean[][] {
    const newMap: boolean[][] = [];
    for (let y = 0; y < map.length; y++) {
      const newRow: boolean[] = [];
      for (let x = 0; x < map[y].length; x++) {
        const filledNeighbors = this.countFilledNeighbors(map, x, y);
        newRow.push(this.applyRules(map[y][x], filledNeighbors));
      }
      newMap.push(newRow);
    }
    return newMap;
  }

  private static countFilledNeighbors(map: boolean[][], x: number, y: number): number {
    let count = 0;
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;
        const nx = x + dx;
        const ny = y + dy;
        if (nx >= 0 && nx < map[0].length && ny >= 0 && ny < map.length) {
          if (map[ny][nx]) count++;
        }
      }
    }
    return count;
  }

  private static applyRules(currentState: boolean, filledNeighbors: number): boolean {
    if (currentState) {
      return filledNeighbors >= 4;
    } else {
      return filledNeighbors >= 5;
    }
  }

  public static addBorder(mapData: boolean[][]): boolean[][] {
    const width = mapData[0].length;
    const height = mapData.length;
    const newMapData = mapData.map(row => row.slice());

    for (let x = 0; x < width; x++) {
      newMapData[0][x] = true;
      newMapData[height - 1][x] = true;
    }

    for (let y = 0; y < height; y++) {
      newMapData[y][0] = true;
      newMapData[y][width - 1] = true;
    }

    return newMapData;
  }

  public static generateFilledBoxesMap(width: number, height: number, boxCount: number): boolean[][] {
    const map: boolean[][] = Array.from({ length: height }, () => Array(width).fill(false));
    for (let i = 0; i < boxCount; i++) {
      const boxWidth = Math.floor(Math.random() * 5) + 1;
      const boxHeight = Math.floor(Math.random() * 5) + 1;
      const startX = Math.floor(Math.random() * (width - boxWidth));
      const startY = Math.floor(Math.random() * (height - boxHeight));
      for (let y = startY; y < startY + boxHeight; y++) {
        for (let x = startX; x < startX + boxWidth; x++) {
          map[y][x] = true;
        }
      }
    }
    return map;
  }

  public static generateVoronoiMap(width: number, height: number, seedCount: number): boolean[][] {
    const map: boolean[][] = Array.from({ length: height }, () => Array(width).fill(false));
    const seeds: { x: number; y: number }[] = [];
    for (let i = 0; i < seedCount; i++) {
      seeds.push({ x: Math.floor(Math.random() * width), y: Math.floor(Math.random() * height) });
    }
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let closestSeed = seeds[0];
        let minDistance = this.calculateDistance(x, y, seeds[0].x, seeds[0].y);
        for (const seed of seeds) {
          const distance = this.calculateDistance(x, y, seed.x, seed.y);
          if (distance < minDistance) {
            closestSeed = seed;
            minDistance = distance;
          }
        }
        map[y][x] = closestSeed.x % 2 === 0; // Example condition to fill the cell
      }
    }
    return map;
  }

  private static calculateDistance(x1: number, y1: number, x2: number, y2: number): number {
    return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
  }

  public static generatePerlinNoiseMap(width: number, height: number, threshold: number): boolean[][] {
    const map: boolean[][] = Array.from({ length: height }, () => Array(width).fill(false));
    const perlin = new PerlinNoise();
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const value = perlin.noise(x / 10, y / 10);
        map[y][x] = value > threshold;
      }
    }
    return map;
  }
}

class PerlinNoise {
  private permutation: number[] = [];

  constructor() {
    this.permutation = Array.from({ length: 256 }, () => Math.floor(Math.random() * 256));
    this.permutation = this.permutation.concat(this.permutation);
  }

  public noise(x: number, y: number): number {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    x -= Math.floor(x);
    y -= Math.floor(y);
    const u = this.fade(x);
    const v = this.fade(y);
    const a = this.permutation[X] + Y;
    const aa = this.permutation[a];
    const ab = this.permutation[a + 1];
    const b = this.permutation[X + 1] + Y;
    const ba = this.permutation[b];
    const bb = this.permutation[b + 1];
    return this.lerp(v, this.lerp(u, this.grad(this.permutation[aa], x, y), this.grad(this.permutation[ba], x - 1, y)), this.lerp(u, this.grad(this.permutation[ab], x, y - 1), this.grad(this.permutation[bb], x - 1, y - 1)));
  }

  private fade(t: number): number {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  private lerp(t: number, a: number, b: number): number {
    return a + t * (b - a);
  }

  private grad(hash: number, x: number, y: number): number {
    const h = hash & 15;
    const u = h < 8 ? x : y;
    const v = h < 4 ? y : h === 12 || h === 14 ? x : 0;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  }
}

export default MapGenerator;
