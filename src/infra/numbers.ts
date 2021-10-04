export const clamp = (val: number, min: number, max: number) => {
  if (val < min) return min;
  else if (val > max) return max;
  else return val;
};
