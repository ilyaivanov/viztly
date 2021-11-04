class Item {
  isOpen: boolean = false;
  isSelected: boolean = false;

  parent?: Item;

  constructor(public title: string = "", public children: Item[] = []) {
    this.isOpen = children.length > 0;
    children.forEach((child) => (child.parent = this));
  }

  save = (): string => {
    const map = (item: Item): ItemToSerialize => ({
      title: item.title,
      children: item.children.map(map),
      isOpen: item.isOpen,
    });
    const item: ItemToSerialize = map(this);
    return JSON.stringify(item);
  };

  public static parse = (str: string): Item => {
    const root = JSON.parse(str) as ItemToSerialize;
    const map = (item: ItemToSerialize): Item =>
      new Item(item.title, item.children?.map(map));
    return map(root);
  };

  addChildAt = (item: Item, index: number) => {
    this.children.splice(index, 0, item);
    item.parent = this;
    this.updateIsOpenFlag();
  };

  addChildAtEnd = (item: Item, index: number) => {
    this.children.splice(index, 0, item);
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

  private updateIsOpenFlag = () => {
    this.isOpen = this.children.length !== 0;
  };
}

type ItemToSerialize = {
  title: string;
  children?: ItemToSerialize[];
  isOpen?: boolean;
};

export default Item;
