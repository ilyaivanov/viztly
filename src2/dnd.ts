import { Point } from "../src/infra/point";

type ListenerOptions = {
  point: Point;
  onEnter: () => void;
  onLeave: () => void;
  onDrag: (x: number, y: number) => void;
};
export function addMouseListener(options: ListenerOptions) {
  listneres.push({
    options,
    isMouseDown: false,
    isMouseOver: false,
  });
}

type Listener = {
  //this might be a bug - I might re-assign point in future
  options: ListenerOptions;
  isMouseOver: boolean;
  isMouseDown: boolean;
};
const listneres: Listener[] = [];

document.addEventListener("mousemove", (e) => {
  listneres.forEach((l) => handleMouseMove(e, l));
});

const handleMouseMove = (e: MouseEvent, listener: Listener) => {
  if (listener.isMouseDown && listener.isMouseOver) {
    listener.options.onDrag(e.clientX, e.clientY);
  } else {
    const { point } = listener.options;
    // RADIUS IS HARDCODED
    const isInsideCircle =
      Math.abs(e.clientX - point.x) < 4 && Math.abs(e.clientY - point.y) < 4;
    if (isInsideCircle) {
      if (!listener.isMouseOver) {
        listener.isMouseOver = true;
        listener.options.onEnter();
      }
    } else {
      if (listener.isMouseOver) {
        listener.isMouseOver = false;
        listener.options.onLeave();
      }
    }
  }
};

document.addEventListener("mousedown", () => {
  listneres.forEach((l) => {
    if (l.isMouseOver) {
      l.isMouseDown = true;
    }
  });
});
document.addEventListener("mouseup", () => {
  listneres.forEach((l) => {
    l.isMouseDown = false;
  });
});
