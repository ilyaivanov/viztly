import { createChannel, createPlaylist, createVideo } from "../tree/tree.crud";

const API_HOST = "https://europe-west1-slapstuk.cloudfunctions.net";
// const API_HOST = "http://localhost:5001/slapstuk/europe-west1";

export const loadSearchResults = (
  item: Item,
  pageToken?: string
): Promise<MappedResponse> => {
  verifyNonTestEnvironment();

  const term = item.title;

  let url = `${API_HOST}/getVideos?q=${term}`;
  if (pageToken) url += `&pageToken=${pageToken}`;
  return fetch(url)
    .then((res) => res.json() as Promise<YoutubeSearchResponse>)
    .then(createMappedResponse);
};

export const loadPlaylistItems = (
  item: Item,
  nextPageToken?: string
): Promise<MappedResponse> => {
  verifyNonTestEnvironment();

  let url = `${API_HOST}/getPlaylistItems?playlistId=${item.playlistId}`;
  if (nextPageToken) url += `&pageToken=${nextPageToken}`;
  return fetch(url)
    .then((res) => res.json() as Promise<YoutubePlaylistDetailsResponse>)
    .then(createMappedResponse);
};

export const loadChannelItems = (
  item: Item,
  pageToken?: string
): Promise<MappedResponse> => {
  verifyNonTestEnvironment();

  if (!pageToken) {
    return Promise.all([
      getChannelUploadsPlaylistId(item),
      getChannelPlaylists(item.channelId!),
    ]).then(([uploadPlaylist, response]) => ({
      items: ([uploadPlaylist] as ResponseItem[])
        .concat(response.items)
        .map(mapResponseItem),
      nextPageToken: response.nextPageToken,
    }));
  } else {
    return getChannelPlaylists(item.channelId!, pageToken).then(
      createMappedResponse
    );
  }
};

const getChannelPlaylists = (
  channelId: string,
  pageToken?: string
): Promise<YoutubeChannelPlaylistsResponse> => {
  let url = `${API_HOST}/getChannelPlaylists?part=snippet&channelId=${channelId}`;
  if (pageToken) url += `&pageToken=${pageToken}`;
  return fetch(url).then((res) => res.json());
};

const getChannelUploadsPlaylistId = (
  channel: Item
): Promise<PlaylistResponseItem> => {
  let url = `${API_HOST}/getChannelVideos?channelId=${channel.channelId}`;
  return fetch(url)
    .then((res) => res.json() as Promise<YoutubeChannelUploadPlaylistResponse>)
    .then((res) => {
      const responseItem: PlaylistResponseItem = {
        itemType: "playlist",
        channelId: channel.channelId!,
        channelTitle: channel.title,
        id: Math.random() + "",
        image: channel.image!,
        itemId: res.playlistId,
        name: channel.title + " Uploads",
      };
      return responseItem;
    });
};

// export const findSimilarYoutubeVideos = (
//   videoId: string,
//   pageToken?: string
// ) => {
//   verifyNonTestEnvironment();
//   let url = `${API_HOST}/getVideos?relatedToVideoId=${videoId}&type=video`;

//   if (pageToken) url += `&pageToken=${pageToken}`;
//   return fetch(url).then((res) => res.json());
// };

const verifyNonTestEnvironment = () => {
  if (process.env.NODE_ENV === "test")
    throw new Error("Tried to execute real API call from tests");
};

export type YoutubeSearchResponse = {
  items: ResponseItem[];
  nextPageToken?: string;
};

type YoutubePlaylistDetailsResponse = {
  items: ResponseItem[];
  nextPageToken?: string;
};

type YoutubeChannelPlaylistsResponse = {
  items: ResponseItem[];
  nextPageToken?: string;
};

type YoutubeChannelUploadPlaylistResponse = {
  playlistId: string;
};

export type MappedResponse = {
  items: Item[];
  nextPageToken?: string;
};

export type ResponseItem =
  | VideoResponseItem
  | ChannelResponseItem
  | PlaylistResponseItem;

type VideoResponseItem = {
  itemType: "video";
  id: string;
  image: string;
  channelTitle: string;
  channelId: string;
  itemId: string;
  name: string;
};
type ChannelResponseItem = {
  itemType: "channel";
  id: string;
  image: string;
  itemId: string;
  name: string;
};
type PlaylistResponseItem = {
  itemType: "playlist";
  id: string;
  image: string;
  itemId: string;
  name: string;
  channelTitle: string;
  channelId: string;
};

export const createMappedResponse = (
  response: YoutubeSearchResponse
): MappedResponse => ({
  items: response.items.map(mapResponseItem),
  nextPageToken: response.nextPageToken,
});

const mapResponseItem = (item: ResponseItem): Item => {
  if (item.itemType === "video")
    return createVideo(item.id, item.name, item.itemId);
  else if (item.itemType === "channel")
    return createChannel(item.id, item.name, item.image, item.itemId);
  else return createPlaylist(item.id, item.name, item.image, item.itemId);
};
