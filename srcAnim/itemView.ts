import { sp } from "../src/view/design";

export const createItemView = (
  item: Item,
  isSelected: boolean,
  x: number,
  y: number
): ItemView => {
  const view: ItemView = {
    circle: {
      type: "circle",
      y: 0,
      x: 0,
      color: isSelected ? sp.selectedCircle : "white",
      filled: item.children.length > 0,
      r: 3.2,
    },
    text: {
      type: "text",
      x: 0,
      y: 0,
      color: isSelected ? sp.selectedCircle : "white",
      fontSize: sp.fontSize,
      text: item.title,
    },
  };
  setItemViewPosition(view, x, y);
  return view;
};

export const setItemViewPosition = (
  itemView: ItemView,
  x: number,
  y: number
) => {
  itemView.circle.x = x;
  itemView.circle.y = y;
  itemView.text.x = x + sp.circleToTextDistance;
  itemView.text.y = y + 0.32 * sp.fontSize;
};
