import { App } from "./app";
import {
  CanvasContextMock,
  createDummyContext,
  expectToHaveCircle,
} from "./test.utils";

describe("Having an app", () => {
  let app: App;
  let context: CanvasContextMock;

  beforeEach(() => {
    context = createDummyContext();
    app = new App(context);
  });

  it("setting root with four children shows that four children", () => {
    app.setRoot({
      text: "Root",
      children: [
        { text: "Foo" },
        { text: "Bar" },
        { text: "Buzz" },
        { text: "Fra" },
      ],
    });

    app.draw();

    expectToHaveCircle(context, 20, 20);
    expectToHaveCircle(context, 20, 40);
    expectToHaveCircle(context, 20, 60);
    expectToHaveCircle(context, 20, 80);
  });

  it("setting root with two nested children shows them a nested items", () => {
    app.setRoot({
      text: "Root",
      children: [{ text: "Foo", children: [{ text: "Bar" }] }, { text: "Sub" }],
    });

    app.draw();

    expectToHaveCircle(context, 20, 20);
    expectToHaveCircle(context, 40, 40);
    expectToHaveCircle(context, 20, 60);
  });

  it("a couple of nested items produce a proper tree", () => {
    app.setRoot({
      text: "Root",
      children: [
        {
          text: "Foo",
          children: [
            { text: "Sub" },
            { text: "Bar", children: [{ text: "Bar" }] },
          ],
        },
        { text: "Sub" },
      ],
    });

    app.draw();

    expectToHaveCircle(context, 20, 20);
    expectToHaveCircle(context, 40, 40);
    expectToHaveCircle(context, 40, 60);
    expectToHaveCircle(context, 60, 80);
    expectToHaveCircle(context, 20, 100);
  });
});

describe("Selection ", () => {
  let app: App;
  let context: CanvasContextMock;

  beforeEach(() => {
    context = createDummyContext();
    app = new App(context);
  });

  describe("having two items", () => {
    beforeEach(() => {
      app.setRoot({
        text: "Root",
        //prettier-ignore
        children: [
          { text: "First" }, 
          { text: "Second" }
        ],
      });
      app.draw();
    });

    it("first item is selected", () => {
      expectToHaveCircle(context, 20, 20, "green");
    });

    it("second item is not selected", () => {
      expectToHaveCircle(context, 20, 40, "gray");
    });

    it("pressing down selects the second item", () => {
      app.handleKey("ArrowDown");
      app.draw();
      expectToHaveCircle(context, 20, 20, "gray");
      expectToHaveCircle(context, 20, 40, "green");
    });
  });
});
