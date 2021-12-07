import { loadFromFile, saveToFile } from "./persistance";
import * as t from "./tree";

export const onKeyDown = async (tree: t.Tree, e: KeyboardEvent) => {
  const commands = keyMap.filter((entry) => match(entry.key, e));

  if (commands.length > 0) {
    const commandEntry = selectBestKey(commands);
    await commandEntry.command(tree);
    if (commandEntry.preventDefault) e.preventDefault();
  }
};

const loadAndSave = async (tree: t.Tree) => {
  const newTree = await loadFromFile();
  Object.assign(tree, newTree);
};

const keyMap = [
  { key: "alt+shift+backspace", command: t.removeSelected },
  { key: "ctrl+right", command: t.selectTabRight },
  { key: "ctrl+left", command: t.selectTabLeft },
  { key: "ctrl+space", command: t.toggleView },
  { key: "left", command: t.moveSelectionLeft },
  { key: "right", command: t.moveSelectionRight },
  { key: "down", command: t.selectNextItem },
  { key: "up", command: t.selectPreviousItem },
  { key: "ctrl+s", command: saveToFile, preventDefault: true },
  { key: "ctrl+l", command: loadAndSave, preventDefault: true },
];

const match = (key: string, event: KeyboardEvent): boolean => {
  const parts = key.split("+");
  return all(parts, (part) => matchPart(part, event));
};

const matchPart = (part: string, event: KeyboardEvent): boolean => {
  if (part === "alt") return event.altKey;
  if (part === "shift") return event.shiftKey;
  if (part === "ctrl") return event.ctrlKey;

  if (["down", "left", "right", "up"].includes(part))
    return "Arrow" + capitalizeWord(part) == event.code;

  if (part == "backspace") return event.code === "Backspace";

  return "key" + part === event.code.toLocaleLowerCase();
};

const capitalizeWord = (word: string) => word[0].toUpperCase() + word.slice(1);

const all = <T>(arr: T[], predicate: (arg: T) => boolean): boolean =>
  arr.reduce((pre: boolean, cur: T) => pre && predicate(cur), true);

const selectBestKey = (entry: typeof keyMap) => {
  let partsCount = 0;
  let candidate = entry[0];
  for (let i = 0; i < entry.length; i++) {
    const parts = entry[i].key.split("+").length;
    if (partsCount < parts) {
      candidate = entry[i];
      partsCount = parts;
    }
  }
  return candidate;
};
