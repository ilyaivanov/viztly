import { youtubeIframeId } from "../controllers/youtubePlayer";
import { c } from "../designSystem";
import { spring } from "../infra/animations";
import { Canvas } from "../infra/canvas";
import Tree from "../itemTree/tree";
import * as icons from "./icons";

class Footer {
  isShown = false;
  isVideoShown = true;
  private height = 0;
  constructor(private canvas: Canvas, private tree: Tree) {}

  show() {
    this.isShown = true;
    spring(0, 50, (val) => {
      this.height = val;
    });
  }

  draw() {
    if (!this.isShown) return;
    const { canvas, height } = this;
    const { ctx } = canvas;

    ctx.filter = "drop-shadow(0px -2px 2px black)";
    ctx.fillStyle = c.footer;
    ctx.fillRect(0, canvas.height - height, canvas.width, height);
    ctx.filter = "none";

    const x = 30;
    const y = canvas.height - height / 2;
    icons.drawAt(this.canvas, x, y, 17, icons.playNext, c.selectedItem, true);

    const playIcon =
      this.tree.itemPlayed && this.tree.itemPlayed.isPlaying
        ? icons.pause
        : icons.play;

    icons.drawAt(this.canvas, x + 30, y, 20, playIcon, c.selectedItem);
    icons.drawAt(this.canvas, x + 60, y, 17, icons.playNext, c.selectedItem);

    const label = `press M to ${this.isVideoShown ? "hide" : "show"} video`;
    ctx.font = `12px Segoe UI`;
    ctx.fillStyle = "#aaaaaa";

    const textWidth = ctx.measureText(label).width;
    ctx.fillText(label, canvas.width - textWidth - 10, y + 0.32 * 12);
  }

  toggleYoutubeVisibility = () => {
    const frame = document.getElementById(youtubeIframeId);
    this.isVideoShown = !this.isVideoShown;
    if (frame) frame.classList.toggle("youtube-hidden", !this.isVideoShown);
  };
}

export default Footer;
