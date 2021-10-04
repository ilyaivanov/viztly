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
  const width = `calc(100vw - ${left}px)`;
  input.setAttribute(
    "style",
    `position:fixed;top:${top}px;left:${left}px;font-size:${fontSize}px;color:${c.selectedItem};width:${width}`
  );

  input.addEventListener("keydown", (e) => {
    const keyToStopEdit = [
      "Escape",
      "ArrowDown",
      "ArrowUp",
      "Enter",
      "NumpadEnter",
    ];

    if (keyToStopEdit.indexOf(e.code) >= 0) {
      item.title = input.value;
      input.remove();
      itemBeingEdited = undefined;
      onFinish();
    }
  });
  input.value = item.title;
  document.body.appendChild(input);
  input.focus();
  input.setSelectionRange(0, 0);
};
