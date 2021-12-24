import { AppContent, handleKeyDown } from "../app";

export default {
  swapDown: (app: AppContent) =>
    handleKeyDown(app, altShiftKeyDown("ArrowDown")),

  swapUp: (app: AppContent) => handleKeyDown(app, altShiftKeyDown("ArrowUp")),

  swapLeft: (app: AppContent) =>
    handleKeyDown(app, altShiftKeyDown("ArrowLeft")),

  swapRight: (app: AppContent) =>
    handleKeyDown(app, altShiftKeyDown("ArrowRight")),

  selectDown: (app: AppContent) =>
    handleKeyDown(app, singleKeyDown("ArrowDown")),

  selectUp: (app: AppContent) => handleKeyDown(app, singleKeyDown("ArrowUp")),

  selectLeft: (app: AppContent) =>
    handleKeyDown(app, singleKeyDown("ArrowLeft")),

  selectRight: (app: AppContent) =>
    handleKeyDown(app, singleKeyDown("ArrowRight")),

  removeSelected: (app: AppContent) =>
    handleKeyDown(app, altShiftKeyDown("Backspace")),

  startRename: (app: AppContent) => handleKeyDown(app, singleKeyDown("KeyE")),

  hitEnter: (app: AppContent) => handleKeyDown(app, singleKeyDown("Enter")),

  setValueToInput: (text: string) => {
    const el = document.getElementById("main-input") as HTMLInputElement;
    if (el) el.value = text;
    else throw new Error(`Can't find input with #main-input in document body`);
  },

  blurOnInput: () => {
    const el = document.getElementById("main-input") as HTMLInputElement;
    if (el) {
      const event = new Event("blur", { bubbles: true });
      el.dispatchEvent(event);
    } else {
      throw new Error(`Can't find input with #main-input in document body`);
    }
  },
};

const singleKeyDown = (code: KeyboardKey): KeyboardEvent =>
  new KeyboardEvent("keydown", { code });

const altShiftKeyDown = (code: KeyboardKey): KeyboardEvent =>
  new KeyboardEvent("keydown", { code, altKey: true, shiftKey: true });
