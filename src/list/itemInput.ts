import { c, fontSizes, spacings } from "../designSystem";
import { ItemRow } from "./list";

let input: HTMLInputElement | undefined;
let itemBeingEdited: ItemRow | undefined;
let onDone: () => void | undefined;

export const drawInputFor = (itemView: ItemRow, done: () => void) => {
  input = document.createElement("input");
  onDone = done;
  const font = itemView.level == 0 ? fontSizes.big : fontSizes.regular;

  itemBeingEdited = itemView;
  input.classList.add("title-input");
  input.style.top = itemView.position.y - font * 0.32 * 2.5 + "px";

  const x =
    itemView.position.x +
    (itemView.level == 0
      ? spacings.zeroLevelCircleToTextDistance
      : spacings.circleToTextDistance);
  input.style.left = x + "px";

  input.style.fontSize = font + "px";
  input.style.color = c.selectedItem;
  input.style.width = window.innerWidth - x + "px";
  input.value = itemView.item.title;
  itemView.item.title = "";

  input.addEventListener("keydown", (e) => {
    if (e.code === "ArrowUp" || e.code === "ArrowDown" || e.code === "Enter") {
      input?.removeEventListener("blur", onBlur);
      finishEdit();
      onDone();
    }

    if (
      e.code === "ArrowLeft" ||
      e.code === "ArrowRight" ||
      e.code === "KeyE"
    ) {
      // do not handle this keys on root key handler
      e.stopPropagation();
    }
  });

  input.addEventListener("blur", onBlur);
  document.body.appendChild(input);
  input.focus();
  input.setSelectionRange(0, 0);
};

const onBlur = () => {
  finishEdit();
  onDone();
};

const finishEdit = () => {
  if (input && itemBeingEdited) {
    itemBeingEdited.item.title = input.value;
    input.remove();

    input = undefined;
    itemBeingEdited = undefined;
  }
};
