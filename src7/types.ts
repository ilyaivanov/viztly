export type Item = {
  id: string;
  title: string;
  children: Item[];
  isOpen: boolean;
  view?: "tree" | "board";

  type: ItemType;
  // videoId?: string;
  // playlistId?: string;
  // channelId?: string;
  // image?: string;

  // isFinished?: boolean;

  // //non-persisted
  parent?: Item;
};

export type Action1<T1> = (a: T1) => void;
export type Action2<T1, T2> = (a: T1, b: T2) => void;

export type ItemView = {
  gridX: number;
  gridY: number;
};

export type ItemType =
  | "folder"
  | "YTvideo"
  | "YTchannel"
  | "YTplaylist"
  | "YTsearch";
