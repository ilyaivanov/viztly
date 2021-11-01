import { c, spacings } from "../designSystem";
import {
  addItemAfter,
  addItemInside,
  moveItemDown,
  moveItemLeft,
  moveItemRight,
  moveItemUp,
  removeItem,
} from "../itemTree";
import { createRows } from "./layouter";
import ItemRow from "./ItemRow";

//VIEW

export class List {
  rows: ItemRow[];

  selectedItemIndex = 0;

  constructor(public root: Item) {
    this.rows = createRows(root);
    this.itemFocused = root;
    this.rows[this.selectedItemIndex].color = c.selectedItem;
  }

  itemFocused: Item;
  public setFocus(item: Item) {
    this.itemFocused = item;
    const selectedItem = this.getSelectedItemRow().item;
    this.updateRows(true);
    this.selectedItemIndex = this.rows.findIndex(
      (i) => i.item === selectedItem
    );
    this.changeItemSelection(this.selectedItemIndex);
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
    this.updateRows();
    this.selectNextItem();
  }

  public selectParentItem() {
    const parentIndex = this.getParentIndex(this.selectedItemIndex);
    if (parentIndex != -1) this.changeItemSelection(parentIndex);
  }

  public getSelectedItemRow() {
    return this.rows[this.selectedItemIndex];
  }
  public getSelectedItem() {
    return this.rows[this.selectedItemIndex].item;
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
      currentParent?.unhighlightChildrenBorder();
      nextParent?.highlightChildrenBorder();
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

  updateRows = (quick = false) => {
    if (quick) this.rows = createRows(this.itemFocused);
    else this.mergeRows(createRows(this.itemFocused));
  };

  private mergeRows = (newRows: ItemRow[]) => {
    const prevRows = new Map(this.rows.map((r) => [r.item, r]));
    const selectedItem = this.rows[this.selectedItemIndex].item;
    this.rows = newRows;

    this.rows.forEach((row) => {
      const prevRow = prevRows.get(row.item);

      if (prevRow) row.merge(prevRow);
    });

    // I need to get prev and next state for each row
    // preserve parent
    this.selectedItemIndex = this.rows.findIndex(
      (r) => r.item === selectedItem
    );
    const parent = this.getParentItemView(this.getSelectedItemRow().item);
    if (parent) parent.childrenColor = c.lineSelected;
    this.rows[this.selectedItemIndex].color = c.selectedItem;
  };
}
