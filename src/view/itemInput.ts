import { sp } from "../design";
import * as tree from "../tree";
import { canvasOffset } from "./tree/minimap";
import { canvas } from "../infra";

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
    tree.finishEdit(input.value);
    input = undefined;
  }
};

export const renderInputAt = (
  x: number,
  y: number,
  title: string,
  onInput: F1<Event>
) => {
  input = createInput(title);
  setInputCoords(input, x, y);
  input.style.color = sp.selectedCircle;

  input.addEventListener("blur", onBlur);
  input.addEventListener("input", onInput);
};

export const updateInputCoords = (x: number, y: number) => {
  if (input) setInputCoords(input, x, y);
};

const setInputCoords = (input: HTMLInputElement, x: number, y: number) => {
  const inputX = x + sp.circleToTextDistance;
  //TODO: ugly 2.2 constant. Picked by hand. Need to think how to properly allign input with respect to cx cy of a circle
  const inputY = y - sp.fontSize * 0.32 * 2.2 - canvasOffset;
  setCoords(input, inputX, inputY, canvas.canvas.width - inputX);
};

//this is used from the modal
export const createInput = (value: string) => {
  const input = document.createElement("input");
  input.autocomplete = "off";
  input.id = "main-input";
  input.style.fontSize = sp.fontSize + "px";
  input.value = value;
  document.body.appendChild(input);
  input.focus();
  input.scrollTo({ left: 0 });
  input.setSelectionRange(0, 0);
  return input;
};

export const setCoords = (
  input: HTMLInputElement,
  x: number,
  y: number,
  width: number
) => {
  input.style.left = x + "px";
  input.style.top = y + "px";
  input.style.width = width + "px";
};

export const removeInput = (input: HTMLInputElement) => {
  input.remove();
};
