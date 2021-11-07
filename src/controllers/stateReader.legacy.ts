// const mapItem = (itemFromBackup: any): Item => {
//   const i = new Item(
//     itemFromBackup.title,
//     itemFromBackup.children ? itemFromBackup.children.map(mapItem) : []
//   );
//   if (i.title !== "Home") i.isOpen = false;

//   return i;
// };

// const mapVisultyItem = (id: string): Item => {
//   const a = (visultyRoot as any)[id];
//   const children = a.children ? a.children.map(mapVisultyItem) : [];
//   const i = new Item(a.title, children);
//   if (a.title === "Home") i.title = "Viztly";

//   i.isOpen = false;

//   i.type = a.type;

//   if (i.type === "YTvideo") i.videoId = a.videoId;

//   if (a.image) i.imageUrl = a.image;
//   if (a.channelId) i.channelId = a.channelId;
//   if (a.playlistId) i.playlistId = a.playlistId;

//   return i;
// };

//   const root = mapItem(itemsBackup);
//   const visultyRoot = mapVisultyItem("HOME");
//   visultyRoot.children.forEach((child) => {
//     root.addChildAtEnd(child);
//   });

//   const channels = root.children.find((c) => c.title == "Channels");
//   channels?.children.forEach((channelChild) => {
//     channelChild.children = [];
//     channelChild.isOpen = false;
//   });

//   return root;
