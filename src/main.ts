import { engine } from "./infra/animations";
import { Canvas } from "./infra/canvas";
import { TreeView } from "./controllers/treeView";
import Scrollbar from "./controllers/scrollbar";

import * as stateReader from "./controllers/stateReader";
import KeyboardHandler from "./controllers/keyboard";
import Tree from "./itemTree/tree";
import Footer from "./views/footer";
import * as modal from "./views/modal";
import { updateInputCoordinates } from "./views/itemInput";

const canvas = new Canvas();

const root = stateReader.loadLocally();

const onKeyHandled = () => {
  stateReader.saveLocally(root);
  treeView.updateRows();
  render();
};

const tree = new Tree(root);
const treeView = new TreeView(tree);
const scrollbar = new Scrollbar(canvas, treeView);
const footer = new Footer(canvas, tree);

const input = new KeyboardHandler(
  tree,
  treeView,
  footer,
  scrollbar,
  onKeyHandled
);

canvas.onResize = () => render();

const render = () => {
  canvas.clear();
  canvas.setTranslation(0, -scrollbar.transformY);

  const { ctx } = canvas;
  ctx.font = `${16}px Segoe UI`;

  ctx.save();

  // drawLines(
  //   ctx,
  //   100,
  //   100,
  //   16,
  //   "Hello my dear and long and some other long-long-line new times friend",
  //   50
  // );

  // ctx.fillStyle = "rgba(125,125,125,0.2)";
  // ctx.fillRect(100, 100 - 16 * 1.32, 50, 200);

  treeView.draw(canvas);
  modal.view(canvas);
  const item = treeView.itemToRows.get(tree.selectedNode);
  if (item) updateInputCoordinates(item, scrollbar);
};

document.addEventListener("wheel", (e) => {
  scrollbar.translateBy(e.deltaY);
  render();
});

document.body.appendChild(canvas.el);

engine.onTick = render;

const drawLines = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  fontSize: number,
  str: string,
  maxWidth: number
) => {
  ctx.font = `${fontSize}px Segoe UI`;
  ctx.fillStyle = "white";
  const lines = getLines(ctx, str, maxWidth);
  let offsetY = y;
  for (var i = 0; i < lines.length; i += 1) {
    ctx.fillText(lines[i], x, offsetY);
    offsetY += 20;
  }
};

function getLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  var words = text.split(" ");
  var lines = [];
  var currentLine = words[0];

  for (var i = 1; i < words.length; i++) {
    var word = words[i];
    var width = ctx.measureText(currentLine + " " + word).width;
    if (width < maxWidth) {
      currentLine += " " + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);
  return lines;
}

render();
