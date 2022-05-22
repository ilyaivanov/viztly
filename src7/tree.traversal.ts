import * as t from "./types";

export const forEachOpenChild = (item: t.Item, cb: t.Action1<t.Item>) => {
  const traverse = (children: t.Item[]) => {
    children.forEach((c) => {
      cb(c);
      if (c.isOpen && c.children.length > 0) forEachOpenChild(c, cb);
    });
  };
  traverse(item.children);
};
