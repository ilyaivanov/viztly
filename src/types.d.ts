//DOMAIN
type Item = {
  id: string;
  title: string;
  children: Item[];
  isOpen: boolean;
  view: "tree" | "board";

  type: string;
  videoId?: string;
  playlistId?: string;
  channelId?: string;
  image?: string;

  //non-persisted
  parent?: Item;
};

type Tree = {
  root: Item;
  selectedItem: Item | undefined;
};

//VIEW

type F1<T> = (a: T) => void;
