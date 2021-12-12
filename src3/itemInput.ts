let input: HTMLInputElement | undefined;
let onDone: ((str: string) => void) | undefined;

export const renderInputAt = (
  x: number,
  y: number,
  item: Item,
  onDoneCb: typeof onDone
) => {
  onDone = onDoneCb;
  if (!input) {
    input = document.createElement("input");

    input.classList.add("title-input");
    input.style.color = "#ACE854";
  }
  input.style.left = x + "px";
  input.style.top = y + "px";
  input.value = item.title;
  input.addEventListener("blur", onBlur);
  document.body.append(input);
  input.focus();
  input.setSelectionRange(0, 0);
};

export const isEditing = () => !!input;

export const stopEditing = () => {
  input?.removeEventListener("blur", onBlur);
  onBlur();
};

const onBlur = () => {
  if (input) {
    const text = input.value;
    input?.remove();
    input = undefined;
    onDone && onDone(text);
  }
};
