export const clamp = (val: number, min: number, max: number) =>
  Math.min(Math.max(val, min), max);

//this is used for pixel-perfect small lines in canvas
export const roundToHalf = (val: number) => Math.round(val) + 0.5;
