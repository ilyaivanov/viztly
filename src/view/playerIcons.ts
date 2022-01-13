import { canvas } from "../infra";

export const pause = new Path2D(
  `M144 479H48c-26.5 0-48-21.5-48-48V79c0-26.5 21.5-48 48-48h96c26.5 0 48 21.5 48 48v352c0 26.5-21.5 48-48 48zm304-48V79c0-26.5-21.5-48-48-48h-96c-26.5 0-48 21.5-48 48v352c0 26.5 21.5 48 48 48h96c26.5 0 48-21.5 48-48z`
);
export const play = new Path2D(
  `M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z`
);
export const playNext = new Path2D(
  `M384 44v424c0 6.6-5.4 12-12 12h-48c-6.6 0-12-5.4-12-12V291.6l-195.5 181C95.9 489.7 64 475.4 64 448V64c0-27.4 31.9-41.7 52.5-24.6L312 219.3V44c0-6.6 5.4-12 12-12h48c6.6 0 12 5.4 12 12z`
);

export const width = 448;
export const height = 512;

//drawing an icon at the center of x,y
//I'm not happy with isRotated option, maybe rethink this in the future
export const drawAt = (
  x: number,
  y: number,
  iconWidth: number,
  icon: Path2D,
  color: string,
  isRotated: boolean = false
) => {
  const ctx = canvas.canvas.ctx;

  const scale = iconWidth / width;
  ctx.save();

  const xTra = x - (width / 2) * scale * (isRotated ? -1 : 1);
  const yTra = y - (height / 2) * scale * (isRotated ? -1 : 1);
  ctx.translate(xTra, yTra);

  if (isRotated) ctx.rotate(Math.PI);

  ctx.scale(scale, scale);

  ctx.fillStyle = color;
  ctx.fill(icon);
  ctx.restore();
};
