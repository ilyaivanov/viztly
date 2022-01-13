import { sp } from "../design";
import { canvas } from "../infra";
import { engine, springKeyed } from "../infra/animations";
import { getSelected } from "../tree";
import * as icons from "./playerIcons";
import * as youtube from "./player.youtube";
import { getItemAbove, getItemBelow } from "../tree/tree.traversal";

const state = {
  isShown: false,
  isVideoShown: true,
  isPlaying: false,
  height: 0,
  itemInVideo: undefined as Item | undefined,
};

export const init = () => {
  youtube.addEventListener("videoEnd", playNextItem);
};

export const isVideoPlayed = (item: Item) =>
  state.itemInVideo == item && state.isPlaying;

export const show = () => {
  state.isShown = true;
  springKeyed(state, 0, 50, (val) => {
    state.height = val;
  });
};

export const playSelectedItem = () => {
  const selected = getSelected();
  if (selected && selected.videoId) {
    if (!state.isShown) show();

    if (state.isPlaying && state.itemInVideo == selected) pause();
    else play(selected, selected.videoId);
  }
};
export const playNextItem = () => {
  let item = state.itemInVideo;
  while (item) {
    //this doesn't go inside closed items, but should
    item = getItemBelow(item);

    if (!item) break;
    if (item.videoId) {
      play(item, item.videoId);
      break;
    }
  }
  engine.onTick && engine.onTick();
};
export const playPreviousItem = () => {
  let item = state.itemInVideo;
  while (item) {
    item = getItemAbove(item);

    if (!item) break;
    if (item.videoId) {
      play(item, item.videoId);
      break;
    }
  }
  engine.onTick && engine.onTick();
};

const pause = () => {
  state.isPlaying = false;
  youtube.pause();
};

const resume = () => {
  state.isPlaying = true;
  youtube.resume();
};

export const toggleVideoState = () => {
  if (state.isPlaying) pause();
  else resume();
};

const play = (item: Item, videoId: string) => {
  state.itemInVideo = item;
  state.isPlaying = true;
  youtube.play(videoId);
};

export const render = () => {
  if (!state.isShown) return;
  const { height } = state;
  const c = canvas.canvas;
  const { ctx } = c;

  ctx.filter = "drop-shadow(0px -2px 2px black)";
  ctx.fillStyle = sp.footer;
  ctx.fillRect(0, c.height - height, c.width, height);
  ctx.filter = "none";

  const x = 30;
  const y = c.height - height / 2;
  icons.drawAt(x, y, 17, icons.playNext, sp.selectedCircle, true);

  const playIcon =
    state.itemInVideo && state.isPlaying ? icons.pause : icons.play;

  icons.drawAt(x + 30, y, 20, playIcon, sp.selectedCircle);
  icons.drawAt(x + 60, y, 17, icons.playNext, sp.selectedCircle);

  const label = `press M to ${state.isVideoShown ? "hide" : "show"} video`;
  ctx.font = `12px Segoe UI`;
  ctx.fillStyle = "#aaaaaa";

  const textWidth = ctx.measureText(label).width;
  ctx.fillText(label, c.width - textWidth - 10, y + 0.32 * 12);
};

export const toggleYoutubeVisibility = () => {
  const frame = document.getElementById(youtube.iframeId);
  state.isVideoShown = !state.isVideoShown;
  if (frame) frame.classList.toggle("youtube-hidden", !state.isVideoShown);
};
