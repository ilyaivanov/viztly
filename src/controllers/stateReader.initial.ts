import Item from "../itemTree/item";

const createItem = (title: string, children: Item[] = []) =>
  new Item(title, children);

const createVideo = (title: string, videoId: string, children: Item[] = []) => {
  const res = new Item(title, children);
  res.type = "YTvideo";
  res.videoId = videoId;
  return res;
};

const createRoot = (children: Item[]) => createItem("Home", children);

const small = createRoot([
  createItem("Blues", [
    createVideo("Dark Blues Music to Escape to...", "s4ACjyobAug"),
    createVideo(
      "WHISKEY BLUES | Best Of Slow Blues/Blues Rock | Modern Electric Blues",
      "f5jGX9A6ErA"
    ),
    createVideo("CHILL BLUES GUITAR to Relax To...", "NYhKmvglrxk"),
  ]),
  createItem("Second"),
]);

export default small;
