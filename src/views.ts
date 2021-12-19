import { sp } from "./design";

type F1<T> = (a: T) => void;

export type Shape = TextShape | Circle | Rectangle | MultiLine;
export type Views = Set<Shape>;
export type ShapeType = "text" | "circle";
export type TextShape = {
  type: "text";
  x: number;
  y: number;
  text: string;
  fontSize: number;
};

export type Circle = {
  type: "circle";
  x: number;
  y: number;
  r: number;
  color: string;
};

export type Rectangle = {
  type: "rectangle";
  x: number;
  y: number;
  height: number;
  width: number;
  rotation: number;
  color: string;
};

export type MultiLine = {
  type: "multiline";
  xs: number[];
  ys: number[];
  rotation: number;
  color: string;
};

export const renderViews = (tree: Tree, x: number, y: number): Views => {
  const s = new Set<Shape>();

  let yOffset = y;
  const renderViewsInner = (item: Item, x: number) => {
    item.children.forEach((item) => {
      s.add({
        type: "circle",
        color: "white",
        x: x,
        y: yOffset,
        r: 3,
      });
      s.add({
        type: "text",
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
