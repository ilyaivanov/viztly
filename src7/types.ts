import { AnimatedNumber } from "./animations/animatedNumber";

export type Item = {
  id: string;
  title: string;
  children: Item[];
  isOpen: boolean;
  view?: "tree" | "board" | "gallery";

  type: ItemType;
  // videoId?: string;
  // playlistId?: string;
  // channelId?: string;
  // image?: string;

  // isFinished?: boolean;

  // //non-persisted
  parent?: Item;
};

export type Tree = {
  root: Item;
  selectedItem: Item;
  focusedItem: Item;
};

export type Action1<T1> = (a: T1) => void;
export type Action2<T1, T2> = (a: T1, b: T2) => void;

export type ItemView = {
  item: Item;
  gridX: number;
  gridY: number;
  opacity: AnimatedNumber;
  x: AnimatedNumber;
  y: AnimatedNumber;
};

export type ItemType =
  | "folder"
  | "YTvideo"
  | "YTchannel"
  | "YTplaylist"
  | "YTsearch";
