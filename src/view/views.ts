import { sp } from "./design";

export const renderViews = (tree: Tree, x: number, y: number): Views => {
  const s = new Set<Shape>();

  let yOffset = y;
  const renderViewsInner = (item: Item, x: number) => {
    item.children.forEach((item) => {
      const color = tree.selectedItem === item ? sp.selectedCircle : "white";
      s.add({ type: "circle", color, x: x, y: yOffset, r: 3 });
      s.add({
        type: "text",
        color,
        x: x + sp.circleToTextDistance,
        y: yOffset + 0.32 * sp.fontSize,
        text: item.title,
        fontSize: sp.fontSize,
      });
      yOffset += sp.yStep;
      if (item.isOpen && item.children.length > 0) {
        renderViewsInner(item, x + sp.xStep);
      }
    });
  };
  renderViewsInner(tree.root, x);

  return s;
};

export const forEachView = (views: Views, cb: F1<Shape>) => views.forEach(cb);
