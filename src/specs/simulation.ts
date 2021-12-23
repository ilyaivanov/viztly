import { AppContent, handleKeyDown } from "../app";

export default {
  pressDown: (app: AppContent) =>
    handleKeyDown(app, { code: "ArrowDown" } as any),

  pressUp: (app: AppContent) => handleKeyDown(app, { code: "ArrowUp" } as any),

  pressLeft: (app: AppContent) =>
    handleKeyDown(app, { code: "ArrowLeft" } as any),

  pressRight: (app: AppContent) =>
    handleKeyDown(app, { code: "ArrowRight" } as any),

  removeSelected: (app: AppContent) =>
    handleKeyDown(app, {
      altKey: true,
      shiftKey: true,
      code: "Backspace",
    } as any),

  startRename: (app: AppContent) =>
    handleKeyDown(app, new KeyboardEvent("keydown", { code: "KeyE" })),

  hitEnter: (app: AppContent) =>
    handleKeyDown(app, new KeyboardEvent("keydown", { code: "Enter" })),

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
