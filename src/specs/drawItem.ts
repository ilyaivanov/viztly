import { Canvas } from "../infra/canvas";
import { add } from "../infra/vector";
import { spacings as sp } from "../designSystem";
import { FlatItemView } from "./itemsLayout";

export const drawItem = (view: FlatItemView, canvas: Canvas) => {
  const { position, item, level } = view;

  const fontSize = level === 0 ? 22 : 14;
  const textPosition = add(position, { x: 10, y: fontSize * 0.32 });

  const color = view.textColor;
  canvas.drawCircle(position, sp.circleRadius, color);

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
