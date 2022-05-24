import * as t from "./types";
import { AnimatedColor } from "./animations/animatedColor";
import { Pallete, ColorValue } from "./pallete";
import * as palletes from "./pallete";

export const colors = {
  text: new AnimatedColor("#FFFFFF"),
  selectedText: new AnimatedColor("#FFFFFF"),
  selectedCircle: new AnimatedColor("#FFFFFF"),

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

const applyAccentColors = (applier: t.Action2<AnimatedColor, ColorValue>) => {
  if (currentTheme === palletes.darkGrey) {
    applier(colors.selectedText, "200");
    applier(colors.selectedCircle, "300");
  } else {
    applier(colors.selectedText, "600");
    applier(colors.selectedCircle, "400");
  }
};

const initColors = (pallete: Pallete, accent: Pallete) => {
  applyTheme((color, value) => color.setValue(pallete[value]));
  applyAccentColors((color, value) => color.setValue(accent[value]));
};

const switchTo = (pallete: Pallete, accent: Pallete) => {
  applyTheme((color, value) => color.animateTo(pallete[value]));
  applyAccentColors((color, value) => color.animateTo(accent[value]));
};
const switchAccentTo = (pallete: Pallete) => {
  applyAccentColors((color, value) => color.animateTo(pallete[value]));
};

export const rotateTheme = () => {
  currentTheme = getNextItem(themes, currentTheme);

  switchTo(currentTheme, currentAccentTheme);
};
export const rotateAccentTheme = () => {
  currentAccentTheme = getNextItem(accentThemes, currentAccentTheme);

  switchAccentTo(currentAccentTheme);
};

const themes = [
  palletes.darkGrey,
  palletes.warmGrey,
  // palletes.grey,
  //   palletes.coolGrey,
  //   palletes.blueGrey,
];

const accentThemes = [
  palletes.blueVivid,

  palletes.greenVivid,
  palletes.limeGreenVivid,
  // palletes.green,
  // palletes.blue,
  // palletes.indigo,
  palletes.indigoVivid,
];

let currentTheme = themes[0];
let currentAccentTheme = accentThemes[0];
initColors(currentTheme, currentAccentTheme);

const getNextItem = <T>(items: T[], item: T): T => {
  let index = items.indexOf(item);
  if (index === items.length - 1) index = 0;
  else index += 1;

  return items[index];
};
