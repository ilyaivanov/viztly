import { AnimatedColor } from "./animations/animatedColor";

//only hex values are supported
const darkTheme = {
  background: "#1e1e1e",
  circleColor: "#D1D2D3",
  textColor: "#FFFFFF",
  selectedColor: "#ACE854",
};

const lightTheme: typeof darkTheme = {
  background: "#F5F7FA",
  circleColor: "#636E7D",
  textColor: "#636E7D",
  selectedColor: "#009EF7",
};

const themeValues = {
  outlineCircleR: 5.5,
  outlineCircleLineWidth: 3,
  textToCircleDistance: 8,
  yStart: 50,
  xStart: 50,
  yStep: 32,
  xStep: 30,

  //colors
  selectedColor: new AnimatedColor(lightTheme.selectedColor),
  circleColor: new AnimatedColor(lightTheme.circleColor),
  textColor: new AnimatedColor(lightTheme.textColor),
  backgroundColor: new AnimatedColor(lightTheme.background),
};

type Theme = "light" | "dark";
let theme: Theme = "light";

export default themeValues;

export const toggleTheme = () => {
  if (theme === "light") {
    theme = "dark";
    animateToTheme(darkTheme);
  } else {
    theme = "light";
    animateToTheme(lightTheme);
  }
};

const animateToTheme = (theme: typeof darkTheme) => {
  themeValues.backgroundColor.animateTo(theme.background);
  themeValues.circleColor.animateTo(theme.circleColor);
  themeValues.textColor.animateTo(theme.textColor);
  themeValues.selectedColor.animateTo(theme.selectedColor);
};
