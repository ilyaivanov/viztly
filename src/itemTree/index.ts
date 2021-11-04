// import Item from "./item";

// export const hasVisibleChildren = (item: Item) =>
//   item.isOpen && item.children.length > 0;

// export const visibleChildrenCount = (item: Item) =>
//   getVisibleChildren(item).length;

// export const getVisibleChildren = (item: Item): Item[] => {
//   let childs: Item[] = [];
//   const gatherChildren = (child: Item) => {
//     childs.push(child);
//     traverseChildren(child);
//   };
//   const traverseChildren = (i: Item) =>
//     hasVisibleChildren(i) && i.children.forEach(gatherChildren);

//   traverseChildren(item);
//   return childs;
// };

// //this goes down into children
// export const getItemBelow = (root: Item, item: Item): Item | undefined => {
//   if (item.isOpen && item.children) return item.children![0];

//   const followingItem = getFollowingItem(item);
//   if (followingItem) return followingItem;
//   else {
//     let parent = item.parent;
//     while (parent && isLast(parent)) {
//       parent = parent.parent;
//     }
//     if (parent) return getFollowingItem(parent);
//   }
// };

// //this always returns following item without going down to children
// export const getFollowingItem = (item: Item): Item | undefined => {
//   const parent = item.parent;
//   if (parent) {
//     const context: Item[] = parent.children!;
//     const index = context.indexOf(item);
//     if (index < context.length - 1) {
//       return context[index + 1];
//     }
//   }
// };

// //need to find parent quickly (probably store direct link on an item)
// export const removeItem = (root: Item, item: Item) => {
//   const traverseChildren = (i: Item) => {
//     i.children = i.children.filter((c) => c != item);
//     hasVisibleChildren(i) && i.children.forEach(traverseChildren);
//   };

//   traverseChildren(root);
// };

// export const isLast = (item: Item): boolean => !getFollowingItem(item);

// export const addItemAfter = (root: Item, item: Item, itemToAdd: Item) => {
//   const traverseChildren = (i: Item) => {
//     i.children = i.children
//       .map((c) => (c == item ? [c, itemToAdd] : [c]))
//       .flat();
//     hasVisibleChildren(i) && i.children.forEach(traverseChildren);
//   };

//   traverseChildren(root);
// };
// export const addItemInside = (item: Item, itemToAdd: Item) => {
//   item.children = [itemToAdd].concat(item.children);
// };

// export const createItem = (title: string, children: Item[] = []): Item => {
//   const item = new Item(title, children);
//   item.isOpen = children.length > 0;
//   return item;
// };

// const rootName = "51230812GIBERISHMAKINGSURETHISISUNIQUE%42%";

// export const createRoot = (children: Item[] = []): Item =>
//   createItem(rootName, children);

// export const isRoot = (item: Item) => !item.parent;

// export const getPath = (item: Item) => {
//   const parents: Item[] = [];

//   let i: Item | undefined = item;
//   let iterationsLeft = 20;
//   while (iterationsLeft > 0 && i && !isRoot(i)) {
//     parents.push(i);
//     i = i.parent;
//     iterationsLeft -= 1;
//   }

//   return parents;
// };

// export const getLastNestedItem = (item: Item): Item => {
//   if (item.isOpen && item.children) {
//     const { children } = item;
//     return getLastNestedItem(children[children.length - 1]);
//   }
//   return item;
// };
