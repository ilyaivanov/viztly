export type ItemType = "folder" | "YTvideo" | "YTplaylist" | "YTchannel";

class Item {
  isOpen: boolean = false;
  isSelected: boolean = false;

  parent?: Item;

  type: ItemType = "folder";
  videoId?: string;
  imageUrl?: string;
  channelId?: string;
  playlistId?: string;

  isPlaying?: boolean;
  isLoading?: boolean;

  constructor(public title: string, public children: Item[] = []) {
    this.isOpen = children.length > 0;
    this.setChildren(children);
  }

  setChildren(children: Item[]) {
    this.children = children;
    children.forEach((child) => (child.parent = this));
  }

  addChildAt = (item: Item, index: number) => {
    this.children.splice(index, 0, item);
    item.parent = this;
    this.updateIsOpenFlag();
  };

  addChildAtEnd = (item: Item) => {
    this.children.splice(this.children.length, 0, item);
    item.parent = this;
    this.updateIsOpenFlag();
  };

  removeChild = (item: Item) => {
    this.children = this.children.filter((c) => c !== item);
    this.updateIsOpenFlag();
  };

  removeChildAt = (index: number) => {
    this.children.splice(index, 1);
    this.updateIsOpenFlag();
  };

  isRoot = () => !this.parent;

  private updateIsOpenFlag = () => {
    this.isOpen = this.children.length !== 0;
  };
}

export default Item;
