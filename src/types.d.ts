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

  remoteSource?: "youtube";
};

type ItemType = "folder" | "YTvideo" | "YTchannel" | "YTplaylist" | "YTsearch";

type A = () => void;
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
