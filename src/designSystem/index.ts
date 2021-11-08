export const fontSizes = {
  regular: 14,
  big: 20,
};

export const c = {
  //light theme
  // circle: "#2A3135",
  // circle: "black",

  //dark theme
  circle: "white",
  text: "white",
  // selectedItem: "#ACE854",
  selectedItem: "#9ccc65",
  line: "#3C413D",
  lineSelected: "#638038",

  scrollbar: "#424242",

  header: "rgba(60,60,60,1)",

  //UI

  //dark
  footer: "#252526",
};

const header = 48;
export const spacings = {
  header,
  xBase: 40,
  yBase: 40,
  xStep: 20,

  circleRadius: 3,
  circleToTextDistance: 8,
  zeroLevelCircleToTextDistance: 10,

  itemHeight: 22,
  zeroLevelItemHeight: 28,

  scrollWidth: 10,

  textToCircleCenter: 10,
};

export type Spacings = typeof spacings;
