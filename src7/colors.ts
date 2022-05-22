import * as t from "./types";
import { AnimatedColor } from "./animations/animatedColor";
import { Pallete, ColorValue } from "./pallete";
import * as palletes from "./pallete";

export const colors = {
  text: new AnimatedColor("#FFFFFF"),

  circleOutline: new AnimatedColor("#FFFFFF"),
  circleFilled: new AnimatedColor("#FFFFFF"),

  lines: new AnimatedColor("#FFFFFF"),
  gridPoint: new AnimatedColor("#FFFFFF"),

  secondaryBackground: new AnimatedColor("#FFFFFF"),
  background: new AnimatedColor("#FFFFFF"),
};

const applyTheme = (applier: t.Action2<AnimatedColor, ColorValue>) => {
  applier(colors.text, "900");
  applier(colors.circleOutline, "500");
  applier(colors.circleFilled, "400");
  applier(colors.lines, "200");
  applier(colors.gridPoint, "200");
  applier(colors.background, "050");
  applier(colors.secondaryBackground, "100");
};

const initColors = (pallete: Pallete) =>
  applyTheme((color, value) => color.setValue(pallete[value]));

const switchTo = (pallete: Pallete) =>
  applyTheme((color, value) => color.animateTo(pallete[value]));

export const rotateTheme = () => {
  let index = themes.indexOf(currentTheme);
  if (index === themes.length - 1) index = 0;
  else index += 1;

  currentTheme = themes[index];

  switchTo(currentTheme);
};

const themes = [
  palletes.darkGrey,
  palletes.warmGrey,
  palletes.grey,
  //   palletes.coolGrey,
  //   palletes.blueGrey,
];

let currentTheme = themes[0];
initColors(currentTheme);
