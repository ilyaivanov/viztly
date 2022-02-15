import { sp } from "../design";
import { canvas } from "./";

const pause = new Path2D(
  `M144 479H48c-26.5 0-48-21.5-48-48V79c0-26.5 21.5-48 48-48h96c26.5 0 48 21.5 48 48v352c0 26.5-21.5 48-48 48zm304-48V79c0-26.5-21.5-48-48-48h-96c-26.5 0-48 21.5-48 48v352c0 26.5 21.5 48 48 48h96c26.5 0 48-21.5 48-48z`
);
const play = new Path2D(
  `M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z`
);
const playNext = new Path2D(
  `M384 44v424c0 6.6-5.4 12-12 12h-48c-6.6 0-12-5.4-12-12V291.6l-195.5 181C95.9 489.7 64 475.4 64 448V64c0-27.4 31.9-41.7 52.5-24.6L312 219.3V44c0-6.6 5.4-12 12-12h48c6.6 0 12 5.4 12 12z`
);
const profile = new Path2D(
  `M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z`
);
const list = new Path2D(
  `M80 368H16a16 16 0 0 0-16 16v64a16 16 0 0 0 16 16h64a16 16 0 0 0 16-16v-64a16 16 0 0 0-16-16zm0-320H16A16 16 0 0 0 0 64v64a16 16 0 0 0 16 16h64a16 16 0 0 0 16-16V64a16 16 0 0 0-16-16zm0 160H16a16 16 0 0 0-16 16v64a16 16 0 0 0 16 16h64a16 16 0 0 0 16-16v-64a16 16 0 0 0-16-16zm416 176H176a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h320a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm0-320H176a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h320a16 16 0 0 0 16-16V80a16 16 0 0 0-16-16zm0 160H176a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h320a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16z`
);
const search = new Path2D(
  `M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z`
);
const breadcrumps = new Path2D(
  `M16 132h416c8.837 0 16-7.163 16-16V76c0-8.837-7.163-16-16-16H16C7.163 60 0 67.163 0 76v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16z`
);
const youtubeIcon = new Path2D(
  `M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z`
);
const carretIcon = new Path2D(
  `M0 384.662V127.338c0-17.818 21.543-26.741 34.142-14.142l128.662 128.662c7.81 7.81 7.81 20.474 0 28.284L34.142 398.804C21.543 411.404 0 402.48 0 384.662z`
);

export const drawSearchIcon = (x: number, y: number, color: string) =>
  drawAt(x, y, 512, 12, search, color);

export const drawPlayIcon = (
  x: number,
  y: number,
  color: string,
  targetWidth = 20
) => drawAt(x, y, regularWidth, targetWidth, play, color);

export const drawPauseIcon = (
  x: number,
  y: number,
  color: string,
  targetWidth = 20
) => drawAt(x, y, regularWidth, targetWidth, pause, color);

export const drawCarretIcon = (x: number, y: number, color: string) =>
  drawAt(x, y, 192, 4, carretIcon, color);

export const drawPlayNextIcon = (x: number, y: number) =>
  drawAt(x, y, regularWidth, 17, playNext, sp.selectedCircle);

export const drawProfileIcon = (x: number, y: number, color: string) =>
  drawAt(x, y, regularWidth, 12, profile, color);

export const drawPlaylistIcon = (x: number, y: number, color: string) =>
  drawAt(x, y, regularWidth, 13, breadcrumps, color);

export const drawPlayPreviousIcon = (x: number, y: number) =>
  drawAt(x, y, regularWidth, 17, playNext, sp.selectedCircle, true);

const regularWidth = 448;
//They all share the same height
const height = 512;

//drawing an icon at the center of x,y
//I'm not happy with isRotated option, maybe rethink this in the future
const drawAt = (
  x: number,
  y: number,
  sourceWidth: number,
  iconWidth: number,
  icon: Path2D,
  color: string,
  isRotated: boolean = false
) => {
  const ctx = canvas.canvas.ctx;

  const scale = iconWidth / sourceWidth;
  ctx.save();

  const xTra = x - (sourceWidth / 2) * scale * (isRotated ? -1 : 1);
  const yTra = y - (height / 2) * scale * (isRotated ? -1 : 1);
  ctx.translate(xTra, yTra);

  if (isRotated) ctx.rotate(Math.PI);

  ctx.scale(scale, scale);

  ctx.fillStyle = color;
  ctx.fill(icon);
  ctx.restore();
};
