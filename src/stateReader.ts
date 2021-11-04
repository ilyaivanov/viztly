import initialState from "./initialState";
import Item from "./itemTree/item";
const SHOULD_READ_LOCALSTORAGE = false;

export const load = (): Item => {
  const data = localStorage.getItem("items:v1");

  return data && SHOULD_READ_LOCALSTORAGE ? JSON.parse(data) : initialState;
};

export const save = (root: Item): void => {
  if (SHOULD_READ_LOCALSTORAGE)
    localStorage.setItem("items:v1", JSON.stringify(root));
};
