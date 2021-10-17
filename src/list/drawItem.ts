import { c, fontSizes, spacings as sp } from "../designSystem";
import { add } from "../infra/vector";
import { Canvas } from "../infra/canvas";
import { ItemRow } from "./list";

// this is called 60FPS,
// thus making this code faster will improve animation perfomance
const drawItemRow = (itemRow: ItemRow, canvas: Canvas) => {
  canvas.drawCircle(itemRow.position, sp.circleRadius, itemRow.color);

  const fontSize = itemRow.level === 0 ? fontSizes.big : fontSizes.regular;

  canvas.drawText(
    add(itemRow.position, {
      x:
        itemRow.level == 0
          ? sp.zeroLevelCircleToTextDistance
          : sp.circleToTextDistance,
      y: fontSize * 0.32,
    }),
    itemRow.item.title,
    fontSize,
    itemRow.color
  );

  if (itemRow.childrenHeight) {
    const itemHeight =
      itemRow.level === 0 ? sp.zeroLevelItemHeight : sp.itemHeight;
    const start = add(itemRow.position, { x: 0, y: itemHeight / 2 });
    const end = add(start, { x: 0, y: itemRow.childrenHeight });
    canvas.drawLine(start, end, 2, itemRow.childrenColor);
  }
};

export default drawItemRow;
