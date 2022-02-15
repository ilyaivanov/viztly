type Item = {
  id: string;
  title: string;
  children: Item[];
  isOpen: boolean;
  view: "tree" | "board";

  type: ItemType;
  videoId?: string;
  playlistId?: string;
  channelId?: string;
  image?: string;

  //non-persisted
  parent?: Item;
};

type ItemType = "folder" | "YTvideo" | "YTchannel" | "YTplaylist" | "YTsearch";

type A = () => void;
type A3<T1, T2, T3> = (a: T1, b: T2, c: T3) => void;
type F1<T> = (a: T) => void;
type F2<Tin, Tout> = (a: Tin) => Tout;

type KeyboardKey =
  | "ArrowDown"
  | "ArrowUp"
  | "ArrowLeft"
  | "ArrowRight"
  | "Enter"
  | "NumpadEnter"
  | "Escape"
  | "Tab"
  | "KeyE"
  | "Backspace";
