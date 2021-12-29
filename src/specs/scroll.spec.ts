import { createRoot, list } from "../domain/items";
import { AppContent, handleWheelEvent, init } from "../app";
import { sp } from "../view/design";
import simulation from "./simulation";

jest.mock("../infra", () => ({
  canvas: {
    canvas: { height: 500, width: 700 },
  },
}));

describe("Having a long list of items and a canvas of height 500px", () => {
  let app: AppContent;

  beforeEach(() => {
    app = init(createRoot(list("Item", 40)));
  });

  it("page size should be 880 (last element y coordinate + sp.start)", () => {
    expect(app.pageHeight).toBe(39 * sp.yStep + sp.start * 2);
  });

  it("scrollbar height should be 500^2/880", () => {
    expect(app.ui.scrollbar.height).toBe((500 * 500) / 880);
  });

  describe("scrolling down by 100 pixels", () => {
    beforeEach(() => handleWheelEvent(app, 100));

    it("should update scrollbar position", () => {
      expect(app.pageOffset).toBe(100);
      expect(app.ui.scrollbar.y).toBe(100 * (500 / 880));
    });
  });

  it("minimum offset of 0", () => {
    handleWheelEvent(app, -80);
    handleWheelEvent(app, -10);
    handleWheelEvent(app, -400);
    expect(app.pageOffset).toBe(0);
    expect(app.ui.scrollbar.y).toBe(0);
  });

  it("maximum offset of pageHeight - canvasHeight", () => {
    handleWheelEvent(app, 1000);
    expect(app.pageOffset).toBe(880 - 500);
  });
});

it("Having 100 items and canvas of height 500px selecting item out of viewport centers on that item", () => {
  const app = init(createRoot(list("Item", 100)));

  simulation.select(app, app.root.children[50]);

  const view = app.itemsToViews.get(app.root.children[50])!;

  expect(app.pageOffset).toBe(view.circle.y - 500 / 2);
});
