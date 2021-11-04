class Item {
  isOpen: boolean = false;
  isSelected: boolean = false;

  parent?: Item;

  constructor(public title: string = "", public children: Item[] = []) {
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
    return new Item("");
  };
}

type ItemToSerialize = {
  title: string;
  children?: ItemToSerialize[];
  isOpen?: boolean;
};

export default Item;
