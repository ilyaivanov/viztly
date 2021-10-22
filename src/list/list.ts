import { c, spacings } from "../designSystem";
import { addItemAfter, addItemInside, removeItem } from "../itemTree";
import { animate, animateColor } from "../infra/animations";
import { createRows } from "./layouter";

//VIEW
export type ItemRow = {
  item: Item;
  level: number;
  position: Vector;
  childrenHeight: number;
  childrenColor: string;
  color: string;
};

export class List {
  rows: ItemRow[];

  selectedItemIndex = 0;

  constructor(public root: Item) {
    this.rows = createRows(root);
    this.rows[this.selectedItemIndex].color = c.selectedItem;
  }

  public selectNextItem() {
    if (this.selectedItemIndex < this.rows.length - 1)
      this.changeItemSelection(this.selectedItemIndex + 1);
  }
  public selectPreviousItem() {
    if (this.selectedItemIndex > 0)
      this.changeItemSelection(this.selectedItemIndex - 1);
  }

  public removeSelectedItem() {
    const itemToRemove = this.getSelectedItemRow().item;

    if (this.selectedItemIndex > 0)
      this.changeItemSelection(this.selectedItemIndex - 1);
    else if (this.selectedItemIndex === 0)
      this.changeItemSelection(this.selectedItemIndex + 1);

    removeItem(this.root, itemToRemove);
    this.updateRows();
  }

  public closeSelectedItem() {
    this.getSelectedItemRow().item.isOpen = false;
    this.updateRows();
  }

  public openSelectedItem() {
    this.getSelectedItemRow().item.isOpen = true;
    this.updateRows();
  }

  public createNewItemAfterSelected() {
    const newItem: Item = {
      children: [],
      isOpen: false,
      title: "",
    };
    const view = this.getSelectedItemRow();
    if (view.item.isOpen) {
      addItemInside(view.item, newItem);
    } else {
      addItemAfter(this.root, view.item, newItem);
    }
    this.selectNextItem();
    this.updateRows();
  }

  public moveSelectedItemRight() {
    if (this.selectedItemIndex > 0) {
      const prevRow = this.rows[this.selectedItemIndex - 1];
      const row = this.getSelectedItemRow();
      if (prevRow.level == row.level) {
        removeItem(this.root, row.item);
        addItemInside(prevRow.item, row.item);
        prevRow.item.isOpen = true;
        this.updateRows();
      }
    }
  }

  public moveSelectedItemLeft() {
    if (this.selectedItemIndex > 0) {
      const row = this.getSelectedItemRow();
      const parentView = this.getParentItemView(this.getSelectedItemRow().item);
      if (parentView) {
        removeItem(this.root, row.item);
        addItemAfter(this.root, parentView.item, row.item);
        this.updateRows();
      }
    }
  }

  public selectParentItem() {
    const parentIndex = this.getParentIndex(this.selectedItemIndex);
    if (parentIndex != -1) this.changeItemSelection(parentIndex);
  }

  public getSelectedItemRow() {
    return this.rows[this.selectedItemIndex];
  }

  public getContentHeight() {
    const lastItem = this.rows[this.rows.length - 1];
    const lastITemHeight =
      lastItem.level === 0 ? spacings.zeroLevelItemHeight : spacings.itemHeight;
    return lastItem.position.y + lastITemHeight + spacings.yBase;
  }

  //
  //
  // private part
  //
  //

  private changeItemSelection(index: number) {
    this.rows[this.selectedItemIndex];
    const currentParent = this.getParentItemView(
      this.rows[this.selectedItemIndex].item
    );
    const nextParent = this.getParentItemView(this.rows[index].item);

    if (currentParent !== nextParent) {
      if (currentParent) {
        animateColor(currentParent.childrenColor, c.line, (val) => {
          currentParent.childrenColor = val;
        });
      }
      if (nextParent) {
        animateColor(nextParent.childrenColor, c.lineSelected, (val) => {
          nextParent.childrenColor = val;
        });
      }
    }
    this.rows[this.selectedItemIndex].color = c.text;
    this.selectedItemIndex = index;
    this.rows[this.selectedItemIndex].color = c.selectedItem;
  }

  private getParentItemView(item: Item) {
    return this.rows.find((r) => r.item.children.indexOf(item) >= 0);
  }
  private getParentIndex(currentIndex: number) {
    const item = this.rows[currentIndex].item;
    return this.rows.findIndex((r) => r.item.children.indexOf(item) >= 0);
  }

  private updateRows = () => this.mergeRows(createRows(this.root));

  private mergeRows = (newRows: ItemRow[]) => {
    const prevRows = new Map(this.rows.map((r) => [r.item, r]));

    this.rows = newRows;

    this.rows.forEach((row) => {
      const prevRow = prevRows.get(row.item);

      if (prevRow && prevRow.position.y !== row.position.y) {
        animate(prevRow.position.y, row.position.y, (val) => {
          row.position.y = val;
        });
      }
      if (prevRow && prevRow.position.x !== row.position.x) {
        animate(prevRow.position.x, row.position.x, (val) => {
          row.position.x = val;
        });
      }

      if (prevRow && prevRow.childrenHeight !== row.childrenHeight) {
        animate(prevRow.childrenHeight, row.childrenHeight, (val) => {
          row.childrenHeight = val;
        });
      }
    });

    // I need to get prev and next state for each row
    // preserve parent
    const parent = this.getParentItemView(this.getSelectedItemRow().item);
    if (parent) parent.childrenColor = c.lineSelected;
    this.rows[this.selectedItemIndex].color = c.selectedItem;
  };
}
