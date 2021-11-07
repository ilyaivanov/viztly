import Item, { ItemType } from "../itemTree/item";

//TODO: I'm manually trying to save space I'm using in the cloud

export const serialize = (root: Item): string => {
  const map = (item: Item): ItemToSerialize => {
    const i: ItemToSerialize = {
      t: item.title,
      w: serializingTypes[item.type],
    };

    if (item.children && item.children.length > 0) i.c = item.children.map(map);
    if (item.isOpen) i.o = true;
    if (item.videoId) i.v = item.videoId;
    if (item.channelId) i.j = item.channelId;
    if (item.playlistId) i.k = item.playlistId;
    if (item.imageUrl) i.l = item.imageUrl;
    return i;
  };
  const item: ItemToSerialize = map(root);
  return JSON.stringify(item);
};

export const deserialize = (str: string): Item => {
  const root = JSON.parse(str) as ItemToSerialize;
  const map = (item: ItemToSerialize): Item => {
    const c = new Item(item.t, item.c?.map(map));
    c.isOpen = item.o || false;
    c.type = deserializingTypes[item.w];
    c.videoId = item.v;

    c.channelId = item.j;
    c.playlistId = item.k;
    c.imageUrl = item.l;
    return c;
  };
  return map(root);
};

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
