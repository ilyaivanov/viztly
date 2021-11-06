import Item from "./itemTree/item";

const createItem = (title: string, children: Item[] = []) =>
  new Item(title, children);

const createVideo = (title: string, videoId: string, children: Item[] = []) => {
  const res = new Item(title, children);
  res.type = "YTVideo";
  res.videoId = videoId;
  return res;
};

const createRoot = (children: Item[]) => createItem("Home", children);

const createItems = (prefix: string, count: number): Item[] =>
  Array.from(new Array(count)).map((_, index) =>
    createItem(`${prefix}.${index + 1}`)
  );

// export const mapItem = (id: string): Item => {
//   const a = (visultyRoot as any)[id];
//   const children = a.children ? a.children.map(mapItem) : [];
//   const i = new Item(a.title, children);
//   if (a.title === "Home") i.title = "Viztly";

//   i.isOpen = false;

//   if (a.type === "YTvideo") {
//     i.type = "YTVideo";
//     i.videoId = a.videoId;
//   }
//   return i;
// };

const two = createRoot([createItem("First"), createItem("Second")]);

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

const big = createRoot([
  createItem("First", [
    createItem("First.1"),
    createItem("First.2"),
    createItem("First.3"),
  ]),
  createItem("Music", [
    createItem("Blues", [
      createVideo("Dark Blues Music to Escape to...", "s4ACjyobAug"),
      createVideo(
        "WHISKEY BLUES | Best Of Slow Blues/Blues Rock | Modern Electric Blues",
        "f5jGX9A6ErA"
      ),
      createVideo("CHILL BLUES GUITAR to Relax To...", "NYhKmvglrxk"),
    ]),
    createItem("Kiffness", [
      createVideo(
        "Batzorig Vaanchig / Mongolian Throat Singer - In Praise of Genghis Khan (The Kiffness Remix)",
        "fn5UXy20utM"
      ),
      createVideo(
        "The Kiffness X Big Billy (Live Looping Talking Cat Remix)",
        "T0P6MC8Ris8"
      ),
    ]),
  ]),
  // mapItem("HOME"),
  createItem("Second", [
    createItem("Second.1", [
      createItem("Second.1.1"),
      createItem("Second.2.2"),
      createItem("Second.3.3"),
    ]),
  ]),
  createItem("Music", [
    createItem("Music.1", [
      createItem("Music.1.1"),
      createItem("Music.2.2"),
      createItem("Music.3.3"),
      createItem("M.Second", [
        createItem("M.Second.1", createItems("M.Second.1", 20)),
      ]),
    ]),
    createItem("Music", [
      createItem("Music.1", [
        createItem("Music.1.1"),
        createItem("Music.2.2"),
        createItem("Music.3.3"),
        createItem("M.Second", [
          createItem("M.Second.1", createItems("M.Second.1", 30)),
        ]),
      ]),
    ]),
  ]),
  createItem("Third"),
  createItem("Fourth"),
  createItem("Fifth", [
    createItem("Music", [
      createItem("Music.1", [
        createItem("Music.1.1"),
        createItem("Music.2.2"),
        createItem("Music.3.3"),
        createItem("M.Second", [
          createItem("M.Second.1", [
            createItem("M.Second.1.1"),
            createItem("M.Second.2.2"),
            createItem("M.Second.3.3"),
          ]),
        ]),
      ]),
    ]),
    createItem("Music", [
      createItem("Music.1", [
        createItem("Music.1.1"),
        createItem("Music.2.2"),
        createItem("Music.3.3"),
        createItem("M.Second", [
          createItem("M.Second.1", [
            createItem("M.Second.1.1"),
            createItem("M.Second.2.2"),
            createItem("M.Second.3.3"),
          ]),
        ]),
      ]),
    ]),
  ]),
]);
export default big;
