import { canvas } from "./";

export const drawChevron = (x: number, y: number) => {
  const scaleBy = 512 / 11;
  const originalWidth = 448;
  const originalHeight = 512;
  const width = Math.round(originalWidth / scaleBy);
  const height = Math.round(originalHeight / scaleBy);

  const left = x - width / 2;
  const top = y - height / 2;

  const context = canvas.canvas.ctx;

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

const playPath = new Path2D(
  "M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z"
);
export const drawPlayButton = (x: number, y: number, color: string) =>
  drawStandartIcon(x, y, color, playPath);

const pausePath = new Path2D(
  `M144 479H48c-26.5 0-48-21.5-48-48V79c0-26.5 21.5-48 48-48h96c26.5 0 48 21.5 48 48v352c0 26.5-21.5 48-48 48zm304-48V79c0-26.5-21.5-48-48-48h-96c-26.5 0-48 21.5-48 48v352c0 26.5 21.5 48 48 48h96c26.5 0 48-21.5 48-48z`
);
export const drawPauseButton = (x: number, y: number, color: string) =>
  drawStandartIcon(x, y, color, pausePath);

const drawStandartIcon = (
  x: number,
  y: number,
  color: string,
  path: Path2D
) => {
  const ctx = canvas.canvas.ctx;
  ctx.save();

  const width = 448;
  const height = 512;
  const desiredWidth = 8;

  const scaleFactor = desiredWidth / width;

  //I'm moving icon to the right a bit, that's why I'm not diving by 2
  ctx.translate(x - desiredWidth / 2.4, y - (height * scaleFactor) / 2);
  ctx.scale(scaleFactor, scaleFactor);

  ctx.fillStyle = color;
  ctx.fill(path);

  ctx.restore();
};

//this is used to make pixel-perfect lines

const roundToHalf = (val: number) => {
  const remainder = val % 1;
  if (remainder > 0.5) return Math.floor(val) + 0.5;
  else return Math.ceil(val) - 0.5;
};
