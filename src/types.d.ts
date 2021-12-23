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

type A = () => void;
type F1<T> = (a: T) => void;
type F2<Tin, Tout> = (a: Tin) => Tout;
