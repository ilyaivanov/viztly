import { c, fontSizes, spacings } from "./designSystem";
import { FlatItemView } from "./flatlist/FlatednedList";

let itemBeingEdited: FlatItemView | undefined;

export const isItemRenaming = (itemView: FlatItemView) => {
  return itemBeingEdited === itemView;
};

export const inRenamingAnything = () => !!itemBeingEdited;

export const showRenamingInput = (
  itemView: FlatItemView,
  onFinish: () => void
) => {
  const { item, position, level } = itemView;
  itemBeingEdited = itemView;
  const input = document.createElement("input");
  input.classList.add("title-input");
  const fontSize = level === 0 ? fontSizes.big : fontSizes.regular;
  const top = position.y - fontSize * (0.5 + 0.32);
  const left = position.x + spacings.textToCircleCenter;
  const { style } = input;
  style.position = "fixed";
  style.top = top + "px";
  style.left = left + "px";
  style.fontSize = fontSize + "px";
  style.color = c.selectedItem;
  style.width = `calc(100vw - ${left}px)`;

  input.addEventListener("keydown", (e) => {
    const keyToStopEdit = [
      "Escape",
      "Enter",
      "ArrowDown",
      "ArrowUp",
      "Enter",
      "NumpadEnter",
    ];

    const keysToStopPropagation = ["ArrowLeft", "ArrowRight"];

    if (keyToStopEdit.indexOf(e.code) >= 0) {
      item.title = input.value;
      input.remove();
      itemBeingEdited = undefined;
      onFinish();
      e.stopPropagation();
    }

    if (keysToStopPropagation.indexOf(e.code) >= 0) {
      e.stopPropagation();
    }
  });
  input.value = item.title;
  document.body.appendChild(input);
  input.focus();
  input.setSelectionRange(0, 0);
};
