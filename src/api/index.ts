import * as realAPI from "./youtubeApi";
import * as fakeAPI from "./fake.api";
import { createMappedResponse, MappedResponse } from "./mapper";

const IS_USING_FAKE_API = false;

export const loadItem = (item: Item) =>
  IS_USING_FAKE_API ? loadItemFaked(item) : loadItemReal(item);

const loadItemReal = (item: Item): Promise<MappedResponse> =>
  (item.type === "YTplaylist"
    ? realAPI.loadPlaylistItems(item)
    : item.type === "YTsearch"
    ? realAPI.loadSearchResults(item)
    : realAPI.loadChannelItems(item)
  ).then((r) => createMappedResponse(r));

const loadItemFaked = (item: Item): Promise<MappedResponse> =>
  (item.type === "YTplaylist"
    ? fakeAPI.loadPlaylistItems(item)
    : item.type === "YTsearch"
    ? fakeAPI.loadSearchResults(item)
    : fakeAPI.loadChannelItems(item)
  ).then((r) => createMappedResponse(r));
