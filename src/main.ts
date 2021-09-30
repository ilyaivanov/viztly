import { spacings as sp, colors, c } from "./designSystem";
import { engine } from "./infra/animationEngine";
import { Canvas } from "./infra/canvas";
import { add } from "./infra/vector";
import { FlatednedList, FlatItemView } from "./specs/itemsLayout";
import { root } from "./store";

const canvas = new Canvas();
const list = new FlatednedList(root);

const viewItem = (view: FlatItemView) => {
  const { position, item, level } = view;

  const fontSize = level === 0 ? 22 : 14;
  const textPosition = add(position, { x: 10, y: fontSize * 0.32 });

  const color = view.textColor;
  canvas.drawCircle(position, sp.circleRadius, color);

  canvas.drawText(textPosition, item.title, fontSize, color);

  if (view.childrenBorder) {
    const b = view.childrenBorder;
    canvas.drawLine(b.start, b.end, 2, b.color);
  }
};

const render = () => {
  canvas.clear();
  list.visibleItems.forEach(viewItem);
};

canvas.onResize = render;
engine.onTick = render;

document.body.appendChild(canvas.el);

let selectedItemIndex = 0;

document.addEventListener("keydown", (e) => {
  if (e.code === "ArrowDown") {
    if (selectedItemIndex < list.visibleItems.length - 1) {
      list.selectNextItem();
      render();
    }
  }
  //   if (e.code === "ArrowUp") {
  //     if (selectedItemIndex > 0) {
  //       selectItemAt(selectedItemIndex - 1);
  //       render();
  //     }
  //   }
  if (e.code === "ArrowLeft") {
    if (list.getSelectedItem().isOpen) list.closeSelected();
    //   closeItem(getSelectedItem());
    // else selectParent(getSelectedItem().item);
    render();
  }
  //   if (e.code === "ArrowRight") {
  //     const item = getSelectedItem().item;
  //     if (canBeOpen(item)) openItem(getSelectedItem());
  //     else if (hasVisibleChildren(item)) selectItem(item.children[0]);
  //     render();
  //   }
});

// const closeItem = (itemView: ItemViewModel) => {
//   const index = visibleItems.indexOf(itemView) + 1;

//   //asumes items are of level2+
//   const offset = visibleChildrenCount(itemView.item) * spacings.itemHeight;
//   visibleItems.splice(index, visibleChildrenCount(itemView.item));
//   visibleItems.slice(index).forEach((item) => (item.position.y -= offset));
//   itemView.item.isOpen = false;
// };

// const openItem = (itemView: ItemViewModel) => {
//   itemView.item.isOpen = true;
//   const index = visibleItems.indexOf(itemView) + 1;
//   const views = createItemViews(
//     itemView.item,
//     itemView.level + 1,
//     itemView.position.y + itemView.itemHeight / 2
//   );
//   visibleItems.splice(index, 0, ...views);

//   //asumes items are of level2+
//   const offsetAdded = views.length * spacings.itemHeight;
//   visibleItems
//     .slice(index + views.length)
//     .forEach((item) => (item.position.y += offsetAdded));
// };

// const selectItem = (item: Item) => {
//   const index = visibleItems.findIndex((v) => v.item === item);
//   selectItemAt(index);
// };

// const selectParent = (item: Item) => {
//   const parentIndex = getParentIndex(item);
//   selectItemAt(parentIndex);
// };

// const getParentIndex = (item: Item) =>
//   visibleItems.findIndex((i) => i.item.children.indexOf(item) >= 0);

// const getParentOfSelectedItem = () => {
//   const parentIndex = getParentIndex(visibleItems[selectedItemIndex].item);
//   return visibleItems[parentIndex];
// };

// const getSelectedItem = (): ItemViewModel => visibleItems[selectedItemIndex];

// const canBeOpen = (item: Item) => !item.isOpen && item.children.length > 0;

// const selectItemAt = (index: number) => {
//   getParentOfSelectedItem()?.lineColor.animateTo(c.line);
//   getSelectedItem().item.isSelected = false;
//   selectedItemIndex = index;
//   getParentOfSelectedItem()?.lineColor.animateTo(c.lineSelected);
//   getSelectedItem().item.isSelected = true;
// };

// selectItemAt(0);
render();
