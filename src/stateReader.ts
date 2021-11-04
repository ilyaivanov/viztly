import initialState from "./initialState";
import Item from "./itemTree/item";
const SHOULD_READ_LOCALSTORAGE = false;

export const load = (): Item => {
  const data = localStorage.getItem("items:v1");

  return data && SHOULD_READ_LOCALSTORAGE ? deserialize(data) : initialState;
};

export const save = (root: Item): void => {
  if (SHOULD_READ_LOCALSTORAGE)
    localStorage.setItem("items:v1", serialize(root));
};

const serialize = (root: Item): string => {
  const map = (item: Item): ItemToSerialize => ({
    title: item.title,
    children: item.children.map(map),
    isOpen: item.isOpen,
  });
  const item: ItemToSerialize = map(root);
  return JSON.stringify(item);
};

const deserialize = (str: string): Item => {
  const root = JSON.parse(str) as ItemToSerialize;
  const map = (item: ItemToSerialize): Item => {
    const c = new Item(item.title, item.children?.map(map));
    c.isOpen = item.isOpen || false;
    return c;
  };
  return map(root);
};

type ItemToSerialize = {
  title: string;
  children?: ItemToSerialize[];
  isOpen?: boolean;
};
