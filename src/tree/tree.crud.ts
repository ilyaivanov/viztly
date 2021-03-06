import { isRoot } from "./tree.traversal";

export const list = (prefix: string, count: number): Item[] =>
  Array.from(new Array(count)).map((_, index) =>
    createItem(`${prefix}${index + 1}`)
  );

export const createRoot = (children: Item[]) => createItem("Root", children);

export const createItem = (title: string, children: Item[] = []) => {
  const item: Item = {
    title,
    isOpen: children.length > 0,
    view: "tree",
    children,
    type: "folder",
    id: Math.random() + "",
  };
  setChildren(item, children);
  return item;
};

export const createBoard = (title: string, children: Item[] = []) => {
  const item: Item = {
    title,
    isOpen: children.length > 0,
    view: "board",
    children,
    type: "folder",
    id: Math.random() + "",
  };
  setChildren(item, children);
  return item;
};

export const createVideo = (id: string, title: string, videoId: string) => {
  const item: Item = {
    title,
    isOpen: false,
    view: "tree",
    children: [],
    type: "YTvideo",
    videoId,
    id,
  };
  return item;
};
export const createPlaylist = (
  id: string,
  title: string,
  image: string,
  playlistId: string
) => {
  const item: Item = {
    title,
    isOpen: false,
    view: "tree",
    children: [],
    type: "YTplaylist",
    image,
    playlistId,
    id,
  };
  return item;
};
export const createChannel = (
  id: string,
  title: string,
  image: string,
  channelId: string
) => {
  const item: Item = {
    title,
    isOpen: false,
    view: "tree",
    children: [],
    type: "YTchannel",
    image,
    channelId,
    id,
  };
  return item;
};

export const setChildren = (item: Item, children: Item[]) => {
  item.children = children;
  children.forEach((i) => (i.parent = item));
};
export const removeItem = (item: Item): Item | undefined => {
  let selectedItem: Item | undefined;
  const parent = item.parent;
  if (parent) {
    const index = parent.children.indexOf(item);
    if (index > 0) selectedItem = parent.children[index - 1];
    else {
      if (isRoot(parent)) {
        selectedItem = parent.children[index + 1];
      } else {
        selectedItem = parent;
        parent.isOpen = parent.children.length > 1;
      }
    }
    removeChild(parent, item);
  }
  return selectedItem;
};

export const removeChild = (parent: Item, item: Item) => {
  parent.children = parent.children.filter((c) => c !== item);
  parent.isOpen = parent.children.length !== 0;
};
export const removeChildAt = (parent: Item, index: number) => {
  parent.children.splice(index, 1);
  updateIsOpenFlag(parent);
};

export const addItemAfter = (item: Item, itemToAdd: Item) => {
  const parent = item.parent;

  if (parent) addChildAt(parent, itemToAdd, parent.children.indexOf(item) + 1);
};

export const addChildAt = (parent: Item, item: Item, index: number) => {
  parent.children.splice(index, 0, item);
  item.parent = parent;
  updateIsOpenFlag(parent);
};

const updateIsOpenFlag = (item: Item) => {
  item.isOpen = item.children.length !== 0;
};
