import { sp } from "./design";

let input: HTMLInputElement | undefined;

export const isEditing = () => !!input;
export const getValue = () => input?.value;

let onBlurHandlers: (() => void)[] = [];
export const addEventListener = (event: "onInputBlur", cb: () => void) => {
  if (event === "onInputBlur") onBlurHandlers.push(cb);
};

const onBlur = () => {
  onBlurHandlers.forEach((cb) => cb());
  finishEdit();
};

export const finishEdit = () => {
  if (input) {
    input.removeEventListener("blur", onBlur);
    input.remove();
    input = undefined;
  }
};

export const renderInputAt = (x: number, y: number, title: string) => {
  input = document.createElement("input");
  input.autocomplete = "off";
  input.id = "main-input";
  input.style.left = x + "px";
  input.style.top = y + "px";
  input.style.color = sp.selectedCircle;
  input.value = title;

  input.addEventListener("blur", onBlur);
  document.body.appendChild(input);
  input.focus();
  input.setSelectionRange(0, 0);
};
