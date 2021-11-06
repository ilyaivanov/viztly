export const youtubeIframeId = "youtubeIframe";

var player: YoutubePlayer;
var videoRequested: string | undefined;
var isLoadingPlayer = false;
var isReady = false;

//taken from https://developers.google.com/youtube/iframe_api_reference#playing-a-video
interface YoutubePlayer {
  //queries
  getCurrentTime(): number;
  getVideoLoadedFraction(): number;
  getDuration(): number;
  getVolume(): number;
  getPlayerState(): PlayerState;

  //actions
  loadVideoById(videoId: string): void;
  playVideo(): void;
  pauseVideo(): void;
  stopVideo(): void;

  //Accepts an integer between 0 and 100.
  setVolume(volume: number): void;

  //The allowSeekAhead parameter determines whether the player will make a new request to the server
  //if the seconds parameter specifies a time outside of the currently buffered video data.
  //
  //We recommend that you set this parameter to false while the user drags the mouse along a video progress bar
  //and then set it to true when the user releases the mouse.
  //This approach lets a user scroll to different points of a video without requesting new video streams
  //by scrolling past unbuffered points in the video. When the user releases the mouse button,
  //the player advances to the desired point in the video and requests a new video stream if necessary.
  seekTo(seconds: number, allowSeekAhead: boolean): void;
}

enum PlayerState {
  UNSTARTED = -1,
  ENDED = 0,
  PLAYING = 1,
  PLAUSED = 2,
  BUFFERING = 3,
  VIDEO_CUED = 5,
}
declare const YT: any;

export function play(videoId: string) {
  videoRequested = videoId;
  if (!player && !isLoadingPlayer) init();
  else if (isReady) {
    player.loadVideoById(videoId);
  }
}

function init() {
  isLoadingPlayer = true;
  const tag = document.createElement("script");

  tag.src = "https://www.youtube.com/iframe_api";
  const firstScriptTag = document.getElementsByTagName("script")[0];
  //@ts-ignore
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

//@ts-ignore
global.onYouTubeIframeAPIReady = () => {
  isLoadingPlayer = false;
  player = new YT.Player(youtubeIframeId, {
    height: "100%",
    width: "100%",
    videoId: videoRequested,
    playerVars: { autoplay: 1 /*, 'controls': 0 */ },
    events: {
      onReady: () => {
        progressInterval = setInterval(onTick, 200);
        isReady = true;
      },
      onStateChange: onPlayerStateChange,
    },
  });
};

let progressInterval: NodeJS.Timeout | undefined;
function onPlayerStateChange(event: any) {
  const state: PlayerState = event.data;
  if (state === PlayerState.ENDED) {
    videoEndEvents.forEach((handler) => handler());
  }

  if (state === PlayerState.PLAYING) {
    if (!progressInterval) progressInterval = setInterval(onTick, 200);
  } else {
    if (progressInterval) {
      clearInterval(progressInterval);
      progressInterval = undefined;
    }
  }
}

const onTick = () => videoProgressEvents.forEach((handler) => handler());

type Handler = () => void;

const videoEndEvents: Handler[] = [];
const videoProgressEvents: Handler[] = [];

export const addEventListener = (
  eventType: "videoEnd" | "progress",
  handler: Handler
) => {
  if (eventType === "progress") videoProgressEvents.push(handler);
  else videoEndEvents.push(handler);
};

export type PlayerProgressState = {
  duration: number;
  loadedFraction: number;
  currentTime: number;
};

export const getPlayerProgressState = (): PlayerProgressState => {
  return {
    currentTime: player.getCurrentTime(),
    loadedFraction: player.getVideoLoadedFraction(),
    duration: player.getDuration(),
  };
};

export const getDuration = (): number => player.getDuration();
export const hasVideo = (): boolean => isReady;
export const seek = (time: number, allowSeekAhead: boolean) =>
  player.seekTo(time, allowSeekAhead);
export const pause = () => player.pauseVideo();
export const resume = () => player.playVideo();

export const removeEventListener = (
  eventType: "videoEnd",
  handler: Handler
) => {
  videoEndEvents.splice(videoEndEvents.indexOf(handler));
};
