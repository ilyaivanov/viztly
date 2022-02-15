import { isRoot } from "../../tree/tree.traversal";
import { canvas, icons } from "../../infra";
import { sp } from "../../design";
import { isFocused } from "../../tree";
import { getMinimapWidth } from "./minimap";
import * as player from "../player/player";

export type ItemView2 = {
  opacity: number;

  x: number;
  y: number;

  //targetY is used to determine destinational position of item during animation
  targetY: number;

  item: Item;
};

export const draw = (
  { item, x, y, opacity }: ItemView2,
  isSelected: boolean,
  isBeingEdited: boolean,
  lastChild?: ItemView2
) => {
  const c = canvas;

  c.canvas.ctx.globalAlpha = opacity;

  if (item.parent && !isRoot(item.parent) && !isFocused(item)) {
    if (item.parent.view === "board")
      c.drawLine(x, y - sp.yStep, x, y, sp.line, 2);
    else c.drawLine(x, y, x - sp.xStep, y, sp.line, 2);
  }

  if (lastChild) {
    if (item.view === "board") {
      const y1 = y + sp.yStep;
      c.drawLine(x, y, x, y1, sp.line, 2);
      c.drawLine(x, y1, lastChild.x + 1, y1, sp.line, 2);
    } else c.drawLine(x, y, x, lastChild.y + 1, sp.line, 2);
  }

  drawItemCircle(x, y, item, isSelected);

  if (!isBeingEdited) {
    const textX = x + sp.circleToTextDistance;
    const textY = y + 0.32 * fontSize(item);
    const color = getItemColor(isSelected);
    c.drawText(textX, textY, item.title, fontSize(item), color);
  }
};

export const drawItemCircle = (
  x: number,
  y: number,
  item: Item,
  isSelected: boolean
) => {
  const c = canvas;
  const color = getIconColor(isSelected);
  if (item.view === "board") icons.drawCarretIcon(x - 10, y, color);

  if (item.videoId) {
    if (player.isVideoPlayed(item)) icons.drawPauseIcon(x, y, color, 10);
    else icons.drawPlayIcon(x, y, color, 10);
  } else if (item.type === "YTsearch") icons.drawSearchIcon(x, y, color);
  else if (item.type === "YTchannel") icons.drawProfileIcon(x, y, color);
  else if (item.type === "YTplaylist") icons.drawPlaylistIcon(x, y, color);
  else c.drawCircle(x, y, sp.circleR, color, item.children.length > 0);
};

const getItemColor = (isSelected: boolean) =>
  isSelected ? sp.selectedCircle : sp.regularColor;
const getIconColor = (isSelected: boolean) =>
  isSelected ? sp.selectedCircle : sp.regularCicrle;

export const drawTextOnMinimap = (
  { item, x, y, opacity }: ItemView2,
  isSelected: boolean
) => {
  const c = canvas;
  c.canvas.ctx.globalAlpha = opacity;

  const color = isSelected ? sp.selectedCircle : sp.minimapColor;
  const textX = x + sp.circleToTextDistance;
  const textY = y + 0.32 * fontSize(item);
  const xOffset = canvas.canvas.width - getMinimapWidth();
  c.drawText(
    xOffset + textX / sp.minimapScale,
    textY / sp.minimapScale,
    item.title,
    fontSize(item) / sp.minimapScale,
    color
  );
};

export const createItemView = (
  x: number,
  y: number,
  item: Item
): ItemView2 => ({ opacity: 1, x, y, targetY: y, item });

const fontSize = (item: Item) =>
  isFocused(item) ? Math.round(sp.fontSize * 1.3) : sp.fontSize;
