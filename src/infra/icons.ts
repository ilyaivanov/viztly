import { Canvas } from "./canvas";

export const drawChevron = (canvas: Canvas, x: number, y: number) => {
  const scaleBy = 512 / 11;
  const originalWidth = 448;
  const originalHeight = 512;
  const width = Math.round(originalWidth / scaleBy);
  const height = Math.round(originalHeight / scaleBy);

  const left = x - width / 2;
  const top = y - height / 2;

  const context = canvas.ctx;

  const xAt = (x: number) => left + x;
  const yAt = (y: number) => top + y;

  const points = [
    { x: 98.5, y: 101.25 },
    { x: 98.5, y: 67.3 },
    { x: 121.19, y: 44.69 },
    { x: 155.13, y: 44.69 },

    { x: 349.48, y: 239.03 },
    { x: 349.48, y: 272.97 },

    { x: 155.13, y: 467.31 },
    { x: 121.19, y: 467.31 },
    { x: 98.5, y: 444.65 },
    { x: 98.5, y: 410.75 },

    { x: 252.51, y: 256 },
  ];

  const positions = points.map((p) => ({
    x: xAt(p.x / scaleBy),
    y: yAt(p.y / scaleBy),
  }));

  context.moveTo(positions[0].x, positions[0].y);
  context.beginPath();
  for (var i = 1; i < positions.length; i++) {
    const p = positions[i];
    context.lineTo(p.x, p.y);
  }
  context.lineTo(positions[0].x, positions[0].y);
  context.fill();
};

const roundToHalf = (val: number) => {
  const remainder = val % 1;
  if (remainder > 0.5) return Math.floor(val) + 0.5;
  else return Math.ceil(val) - 0.5;
};
