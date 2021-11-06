import { c } from "../designSystem";
import { Canvas } from "../infra/canvas";
import Tree from "../itemTree/tree";
import * as icons from "./icons";

class Footer {
  constructor(private canvas: Canvas, private tree: Tree) {}

  draw() {
    const { canvas } = this;
    const { ctx } = canvas;
    const height = 50;

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
  }
}

export default Footer;
