import * as items from "../tree/tree.crud";
import { ResponseItem, YoutubeResponse } from "./youtubeApi";

export type MappedResponse = {
  items: Item[];
  nextPageToken?: string;
};
export const createMappedResponse = (
  response: YoutubeResponse
): MappedResponse => ({
  items: response.items.map(mapResponseItem),
  nextPageToken: response.nextPageToken,
});

const mapResponseItem = (item: ResponseItem): Item =>
  item.itemType === "video"
    ? items.createVideo(item.id, item.name, item.itemId)
    : item.itemType === "channel"
    ? items.createChannel(item.id, item.name, item.image, item.itemId)
    : items.createPlaylist(item.id, item.name, item.image, item.itemId);
