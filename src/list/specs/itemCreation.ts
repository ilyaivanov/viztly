import { createItem, createRoot } from "../../itemTree";

export const createItems = (...titles: string[]): Item[] =>
  titles.map((title) => createItem(title));

export const createRootWith = (...titles: string[]): Item =>
  createRoot(createItems(...titles));
