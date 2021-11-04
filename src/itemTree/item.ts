class Item {
  isOpen: boolean = false;
  isSelected: boolean = false;

  parent?: Item;

  constructor(public title: string = "", public children: Item[] = []) {
    this.isOpen = children.length > 0;
    children.forEach((child) => (child.parent = this));
  }

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

export default Item;
