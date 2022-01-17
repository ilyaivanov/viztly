import { ResponseItem, YoutubeResponse } from "./youtubeApi";

export const loadSearchResults = (
  item: Item,
  pageToken?: string
): Promise<YoutubeResponse> =>
  item.title.toLocaleLowerCase().indexOf("peterson") >= 0
    ? Promise.resolve(createPetersonResponse())
    : Promise.resolve(createSync24Response());

export const loadPlaylistItems = (
  item: Item,
  nextPageToken?: string
): Promise<YoutubeResponse> => Promise.resolve(createSamplePlaylistResponse());

export const loadChannelItems = (
  item: Item,
  pageToken?: string
): Promise<YoutubeResponse> => Promise.resolve(createSampleChannelResponse());

const createPetersonResponse = () =>
  createSampleResponse([
    channel(
      "Jordan B Peterson",
      "UCL_f53ZEJxp8TtlOkHwMV9Q",
      "https://yt3.ggpht.com/aoJ9M6s2RCOH9-ULFs7ll9aS-viz4wj84VgdGmyJSkPdPySIZggg2nwyt5YGlLnfE5DTzt3J34s=s240-c-k-c0xffffffff-no-rj-mo"
    ),
    playlist(
      "JP - Personality 2017",
      "PL22J3VaeABQApSdW8X71Ihe34eKN6XhCi",
      "https://i.ytimg.com/vi/kYYJlNbV1OM/hqdefault.jpg?sqp=-oaymwEbCKgBEF5IVfKriqkDDggBFQAAiEIYAXABwAEG&rs=AOn4CLDl1fy15nc23BGDlou2L03SO9iKfQ"
    ),
    video(
      "Talking with Russians | The Jordan B. Peterson Podcast",
      "Cn_lucBscH4"
    ),
    video(
      'Jordan Peterson - This Is GETTING OUT OF HAND!!"Enough Is Enough!"',
      "0YUK3Jf-MGo"
    ),
    video(`It's Time to Live`, "xu3ux1h_caU"),
    video(
      "Ethan Klein DESTROYED By Jordan Peterson After Trying To Cancel Him!",
      "UwTBbJlgYXA"
    ),
    video(
      "Evolution & the Challenges of Modern Life | Bret Weinstein & Heather Heying | The JBP Podcast S4 E73",
      "jKh0ni7HlNw"
    ),
  ]);

const createSync24Response = () =>
  createSampleResponse([
    video("Sync24 - Comfortable Void [Full Album]", "5z6IKnYXqFM"),
    video("Sync24 - Omnious [Full Album]", "8ONz3_vjJIY"),
    playlist(
      "Sync24 - Source | Leftfield Records [Full Album]",
      "PLrz8hHdG8-5BaFU3C8-klOA4L6ws-Lw_b",
      "https://i.ytimg.com/vi/3QMvfdXRbm4/mqdefault.jpg"
    ),
    video(
      "[Chill Space Mix Series 025] Sync24 - Summer Selection Mix",
      "jR5vexJSpv8"
    ),
    video("Sync24 - Acidious [Full Album]", "kUEaGZd03dE"),
  ]);

const createSamplePlaylistResponse = () =>
  createSampleResponse([
    video("Sync24 - Cryptobiosis", "4XglYW89WLQ"),
    video("Sync24 - There Is No Spoon", "z7S2iJmciwY"),
    video(
      "[Chill Space Mix Series 025] Sync24 - Summer Selection Mix",
      "jR5vexJSpv8"
    ),
    video("Sync24 - Acidious [Full Album]", "kUEaGZd03dE"),
  ]);

const createSampleChannelResponse = () =>
  createSampleResponse([
    playlist(
      "Playlist 1",
      "PLrz8hHdG8-5BD-DPr3RgOTA_fRLH55zUD",
      "https://i.ytimg.com/vi/RtkZDEOS1ZI/mqdefault.jpg"
    ),
    playlist(
      "Playlist 2",
      "PLrz8hHdG8-5BD-DPr3RgOTA_fRLH55zUD",
      "https://i.ytimg.com/vi/RtkZDEOS1ZI/mqdefault.jpg"
    ),
    playlist(
      "Playlist 3",
      "PLrz8hHdG8-5BD-DPr3RgOTA_fRLH55zUD",
      "https://i.ytimg.com/vi/RtkZDEOS1ZI/mqdefault.jpg"
    ),
    playlist(
      "Playlist 4",
      "PLrz8hHdG8-5BD-DPr3RgOTA_fRLH55zUD",
      "https://i.ytimg.com/vi/RtkZDEOS1ZI/mqdefault.jpg"
    ),
  ]);

const createSampleResponse = (items: ResponseItem[]): YoutubeResponse => ({
  nextPageToken: "CBkQAA",
  items,
});

const video = (title: string, videoId: string): ResponseItem => ({
  id: Math.random() + "",
  image: `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`,
  channelTitle: "The Psychedelic Muse",
  channelId: "UCAepXw94EhaO0CZV9f5D3fQ",
  itemId: videoId,
  name: title,
  itemType: "video",
});

const playlist = (
  title: string,
  playlistId: string,
  image: string
): ResponseItem => ({
  id: Math.random() + "",
  image,
  itemId: playlistId,
  name: title,
  channelTitle: "The Psychedelic Muse",
  channelId: "UCAepXw94EhaO0CZV9f5D3fQ",
  itemType: "playlist",
});

const channel = (
  title: string,
  channelId: string,
  image: string
): ResponseItem => ({
  id: Math.random() + "",
  image,
  itemId: channelId,
  name: title,
  itemType: "channel",
});
