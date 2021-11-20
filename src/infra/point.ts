export class Point {
  x: number = 0;
  y: number = 0;
}

export const isEqual = (p1: Point, p2: Point) => p1.x === p2.x && p1.y === p2.y;
