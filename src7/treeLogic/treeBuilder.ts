import { createItem, createRoot } from "../persistance/initialState";
import * as t from "../types";

export const buildTree = (definitions: string): t.Tree => {
  const lines = definitions
    .split("\n")
    .filter((line) => !isWhitespaceOrEmpty(line));

  const baseLevel = getOffset(lines[0]);

  const itemDefinitions: ItemDefinition[] = lines.map((line) => {
    const commentIndex = line.indexOf("#");
    const def: ItemDefinition = {
      title:
        commentIndex === -1
          ? line.trim()
          : line.substring(0, commentIndex).trim(),
      level: (getOffset(line) - baseLevel) / 2,
      children: [],
    };

    return def;
  });

  const root = createRoot([]);
  const parents: ItemDefinition[] = [];
  const popParent = () => parents.pop();
  const popParentUntilLevel = (level: number) => {
    let last = parents.pop();
    while (last && last.level > level) {
      last = parents.pop();
    }
  };

  const currentParent = () => parents[parents.length - 1];

  const rootChilds: ItemDefinition[] = [];

  const pushItem = (item: ItemDefinition) => {
    const parent = currentParent();
    if (parent) parent.children.push(item);
    else rootChilds.push(item);

    parents.push(item);
  };

  let currentLevel = itemDefinitions[0].level;
  for (const itemDef of itemDefinitions) {
    if (itemDef.level == currentLevel) {
      popParent();
      pushItem(itemDef);
    } else if (itemDef.level > currentLevel) {
      currentLevel = itemDef.level;
      pushItem(itemDef);
    } else if (itemDef.level < currentLevel) {
      popParentUntilLevel(itemDef.level);
      currentLevel = itemDef.level;
      pushItem(itemDef);
    }
  }

  const mapItems = (defs: ItemDefinition[]): t.Item[] => {
    return defs.map((def) => createItem(def.title, mapItems(def.children)));
  };
  const items = mapItems(rootChilds);

  return {
    root: createRoot(items),
    selectedItem: items[0],
    focusedItem: root,
  };
};

type ItemDefinition = {
  title: string;
  level: number;
  children: ItemDefinition[];
};

const getOffset = (line: string) => line.search(/\S/);

const isWhitespaceOrEmpty = (line: string) => line.trim().length === 0;
