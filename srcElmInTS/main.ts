import { canvas } from "../src/infra";

const el = canvas.createFullscreenCanvas();
el.style.display = "block";
document.body.appendChild(el);

document.body.style.margin = 0 + "";
document.body.style.backgroundColor = "#1e1e1e";

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

const render = (s: MyState) => {
  canvas.clear();
  canvas.drawRect(s.rectX - 10, s.rectY - 10, 20, 20, "white");
};

type MyState = {
  rectX: number;
  rectY: number;
};

const state: MyState = { rectX: 200, rectY: 200 };

type MyEvents = {
  clicked: { x: number; y: number };
};

const handleEvent = <TKey extends keyof MyEvents>(
  key: TKey,
  event: MyEvents[TKey]
) => {
  state.rectX = event.x;
  state.rectY = event.y;

  render(state);
};

render(state);

canvas.addEventListener("resize", () => render(state));

document.addEventListener("click", (e) =>
  handleEvent("clicked", { x: e.clientX, y: e.clientY })
);
