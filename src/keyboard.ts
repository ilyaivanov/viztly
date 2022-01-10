import * as tree from "./tree";
import * as input from "./view/itemInput";

export const onKeyDown = async (e: KeyboardEvent) => {
  let commands = keyMap.filter((entry) => match(entry.key, e));

  if (input.isEditing()) {
    commands = commands.filter((entry) => !entry.edit || entry.edit === "only");
  } else {
    commands = commands.filter((entry) => entry.edit !== "only");
  }

  if (commands.length > 0) {
    const commandEntry = selectBestKey(commands);
    await commandEntry.command();
    if (commandEntry.preventDefault) e.preventDefault();
  }
};

const keyMap: CommandDefinition[] = [
  { key: "shift+tab", command: tree.moveSelectedLeft, preventDefault: true },
  { key: "tab", command: tree.moveSelectedRight, preventDefault: true },

  { key: "shift+alt+left", command: tree.moveSelectedLeft },
  { key: "shift+alt+right", command: tree.moveSelectedRight },
  { key: "shift+alt+down", command: tree.moveSelectedDown },
  { key: "shift+alt+up", command: tree.moveSelectedUp },

  { key: "ctrl+alt+up", command: tree.goToPreviousSibling },
  { key: "ctrl+alt+down", command: tree.goToNextSibling },

  { key: "shift+alt+backspace", command: tree.removeSelected, edit: "ignore" },

  { key: "left", command: tree.goLeft, edit: "ignore" },
  { key: "right", command: tree.goRight, edit: "ignore" },
  { key: "down", command: tree.goDown, edit: "ignore" },
  { key: "up", command: tree.goUp, edit: "ignore" },

  { key: "e", command: tree.startEdit, preventDefault: true, edit: "ignore" },
  { key: "enter", command: tree.createItemAfterSelected, edit: "ignore" },
  {
    key: ["enter", "numpadenter", "escape"],
    command: input.finishEdit,
    edit: "only",
  },
];

type CommandDefinition = {
  key: KeyCombination | KeyCombination[];
  command: () => void;
  preventDefault?: boolean;
  edit?: "only" | "ignore";
};

const match = (
  key: KeyCombination | KeyCombination[],
  event: KeyboardEvent
): boolean => {
  const matchKey = (key: KeyCombination) =>
    all(key.split("+"), (part) => matchPart(part as MyKey, event));

  if (typeof key === "string") return matchKey(key);

  return any(key, matchKey);
};

const matchPart = (part: MyKey, event: KeyboardEvent): boolean => {
  if (part === "alt") return event.altKey;
  if (part === "shift") return event.shiftKey;
  if (part === "ctrl") return event.ctrlKey;

  if (["down", "left", "right", "up"].includes(part))
    return "Arrow" + capitalizeWord(part) == event.code;

  if (event.code.startsWith("Key"))
    return "key" + part === event.code.toLocaleLowerCase();
  else return part === event.code.toLocaleLowerCase();
};

const capitalizeWord = (word: string) => word[0].toUpperCase() + word.slice(1);

const all = <T>(arr: T[], predicate: (arg: T) => boolean): boolean =>
  arr.reduce((pre: boolean, cur: T) => pre && predicate(cur), true);

const any = <T>(arr: T[], predicate: (arg: T) => boolean): boolean =>
  arr.reduce((pre: boolean, cur: T) => pre || predicate(cur), false);

const selectBestKey = (entry: typeof keyMap) => {
  let partsCount = 0;
  let candidate = entry[0];
  for (let i = 0; i < entry.length; i++) {
    const k = entry[i].key;
    //selecting first key here because I assume if multiple combinations are present, they all share the same arity
    const samplingKey = typeof k === "string" ? k : k[0];
    const parts = samplingKey.split("+").length;
    if (partsCount < parts) {
      candidate = entry[i];
      partsCount = parts;
    }
  }
  return candidate;
};

type TargetKey =
  | "e"
  | "tab"
  | "left"
  | "right"
  | "down"
  | "up"
  | "enter"
  | "numpadenter"
  | "backspace"
  | "escape";

type HelperKey = "shift" | "alt" | "ctrl";

type KeyCombination =
  | `${TargetKey}`
  | `${HelperKey}+${TargetKey}`
  | `${HelperKey}+${HelperKey}+${TargetKey}`;

type MyKey = TargetKey | HelperKey;