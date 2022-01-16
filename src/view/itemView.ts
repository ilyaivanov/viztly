import { isRoot } from "../tree/tree.traversal";
import { canvas } from "../infra";
import { sp } from "../design";
import { isFocused } from "../tree";
import { getMinimapWidth } from "./minimap";
import { drawPauseButton, drawPlayButton } from "../infra/icons";
import * as player from "./player";
import {
  drawPlaylistIcon,
  drawProfileIcon,
  drawYoutubeIcon,
} from "./playerIcons";

export type ItemView2 = {
  opacity: number;

  x: number;
  y: number;

  //targetY is used to determine destinational position of item during animation
  targetY: number;

  isTextHidden?: boolean;
  item: Item;
};

export const draw = (
  { item, x, y, opacity, isTextHidden }: ItemView2,
  isSelected: boolean,
  lastChild?: ItemView2
) => {
  const c = canvas;

  c.canvas.ctx.globalAlpha = opacity;

  if (item.parent && !isRoot(item.parent) && !isFocused(item))
    c.drawLine(x, y, x - sp.xStep, y, sp.line, 2);

  if (lastChild) c.drawLine(x, y, x, lastChild.y + 1, sp.line, 2);

  drawItemCircle(x, y, item, isSelected);

  if (!isTextHidden) {
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
  if (item.videoId) {
    if (player.isVideoPlayed(item)) drawPauseButton(x, y, color);
    else drawPlayButton(x, y, color);
  } else if (item.remoteSource === "youtube") drawYoutubeIcon(x, y, color);
  else if (item.type === "YTchannel") drawProfileIcon(x, y, color);
  else if (item.type === "YTplaylist") drawPlaylistIcon(x, y, color);
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
