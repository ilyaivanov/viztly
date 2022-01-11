import { createTree, Tree } from "../tree";
import defaultState from "./persistance.initial";

export const saveToFile = async (tree: Tree) => {
  const fileHandle = await (window as any).showSaveFilePicker({
    suggestedName: "viztly.json",
    types: [
      {
        description: "JSON File",
        accept: {
          "json/*": [".json"],
        },
      },
    ],
  });

  const myFile = await fileHandle.createWritable();
  await myFile.write(serialize(tree));
  await myFile.close();
};

export const loadFromFile = async (): Promise<Tree> => {
  const [fileHandle] = await (window as any).showOpenFilePicker({
    types: [
      {
        description: "Viztly json",
        accept: {
          "json/*": [".json"],
        },
      },
    ],
  });

  const fileData = await fileHandle.getFile();
  const t = await fileData.text();
  return parse(t);
};

export const saveToLocalStorage = (tree: Tree) => {
  localStorage.setItem("viztly:v2", serialize(tree));
};

export const loadFromLocalStorage = (): Tree => {
  const serialized = localStorage.getItem("viztly:v2");
  return serialized ? parse(serialized) : defaultState;
};

const parse = (serializedTree: string): Tree => {
  const root: Item = JSON.parse(serializedTree);

  const mapItem = (item: Item): Item => {
    const res: Item = item;
    res.children = item.children.map((c) => {
      const item = mapItem(c);
      item.parent = res;
      return item;
    });
    return res;
  };

  const rootParsed = mapItem(root);
  return createTree(rootParsed);
};

const serialize = (tree: Tree): string => {
  function replacer(key: keyof Item, value: unknown) {
    if (key == "parent") return undefined;
    else return value;
  }
  return JSON.stringify(tree.root, replacer as any);
};
