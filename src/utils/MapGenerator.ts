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
}

export default MapGenerator;
