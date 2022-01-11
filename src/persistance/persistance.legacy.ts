import { createTree, Tree } from "../tree";
import { createItem } from "../tree/tree.crud";

export const deserialize = (root: any): Item => {
  const map = (item: ItemToSerialize): Item => {
    const c = createItem(item.t, item.c?.map(map));
    c.isOpen = item.o || false;
    c.type = deserializingTypes[item.w];
    c.videoId = item.v;

    c.channelId = item.j;
    c.playlistId = item.k;
    c.image = item.l;
    return c;
  };
  return map(root);
};

export const loadLegacy = (): Tree => {
  //   const root = mapItem(itemsBackup);
  const root = deserialize(itemsBackup);
  console.log(root);
  //   visultyRoot.children.forEach((child) => {
  //     root.addChildAtEnd(child);
  //   });

  const channels = root.children.find((c) => c.title == "Channels");
  channels?.children.forEach((channelChild) => {
    channelChild.children = [];
    channelChild.isOpen = false;
  });

  return createTree(root);
};
type ItemType = "folder" | "YTvideo" | "YTplaylist" | "YTchannel";
type ItemToSerialize = {
  //title
  t: string;

  //children
  c?: ItemToSerialize[];

  //isOpen
  o?: boolean;

  //videoId
  v?: string;

  //type
  w: SerializedItemType;

  //channelId
  j?: string;
  //playlistId
  k?: string;
  //image
  l?: string;
};

type SerializedItemType = "f" | "y" | "c" | "p";

const serializingTypes: Record<ItemType, SerializedItemType> = {
  YTchannel: "c",
  YTplaylist: "p",
  YTvideo: "y",
  folder: "f",
};

const deserializingTypes: Record<SerializedItemType, ItemType> =
  Object.fromEntries(
    Object.entries(serializingTypes).map(([k, v]) => [v, k])
  ) as Record<SerializedItemType, ItemType>;

// PASTE LEGACY OBJECT HERE
const itemsBackup = {};
