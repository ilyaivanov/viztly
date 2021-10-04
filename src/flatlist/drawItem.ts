import { Canvas } from "../infra/canvas";
import { add } from "../infra/vector";
import { fontSizes, spacings as sp, spacings } from "../designSystem";
import { FlatItemView } from "./FlatednedList";
import { isItemRenaming } from "../titleInput";

export const drawItem = (view: FlatItemView, canvas: Canvas) => {
  const { position, item, level } = view;

  const fontSize = level === 0 ? fontSizes.big : fontSizes.regular;
  const textPosition = add(position, {
    x: sp.textToCircleCenter,
    y: fontSize * 0.32,
  });

  const color = view.textColor;
  canvas.drawCircle(position, sp.circleRadius, color);

  if (!isItemRenaming(view))
    canvas.drawText(textPosition, item.title, fontSize, color);

  if (view.childrenBorder) {
    const b = view.childrenBorder;
    const endY = position.y + b.height;
    canvas.drawLine(
      add(position, { x: 0, y: sp.circleRadius }),
      { x: position.x, y: endY },
      2,
      b.color
    );
  }
};
