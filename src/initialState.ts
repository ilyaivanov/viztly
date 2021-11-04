import Item from "./itemTree/item";

const createItem = (title: string, children: Item[] = []) =>
  new Item(title, children);

const createRoot = (children: Item[]) => createItem("Home", children);

const createItems = (prefix: string, count: number): Item[] =>
  Array.from(new Array(count)).map((_, index) =>
    createItem(`${prefix}.${index + 1}`)
  );

const two = createRoot([createItem("First"), createItem("Second")]);

const small = createRoot([
  createItem("First", [
    createItem("First.1"),
    createItem("First.2"),
    createItem("First.3"),
  ]),
  createItem("Second"),
]);

const big = createRoot([
  createItem("First", [
    createItem("First.1"),
    createItem("First.2"),
    createItem("First.3"),
  ]),
  createItem("Second", [
    createItem("Second.1", [
      createItem("Second.1.1"),
      createItem("Second.2.2"),
      createItem("Second.3.3"),
    ]),
  ]),
  createItem("Music", [
    createItem("Music.1", [
      createItem("Music.1.1"),
      createItem("Music.2.2"),
      createItem("Music.3.3"),
      createItem("M.Second", [
        createItem("M.Second.1", createItems("M.Second.1", 20)),
      ]),
    ]),
    createItem("Music", [
      createItem("Music.1", [
        createItem("Music.1.1"),
        createItem("Music.2.2"),
        createItem("Music.3.3"),
        createItem("M.Second", [
          createItem("M.Second.1", createItems("M.Second.1", 30)),
        ]),
      ]),
    ]),
  ]),
  createItem("Third"),
  createItem("Fourth"),
  createItem("Fifth", [
    createItem("Music", [
      createItem("Music.1", [
        createItem("Music.1.1"),
        createItem("Music.2.2"),
        createItem("Music.3.3"),
        createItem("M.Second", [
          createItem("M.Second.1", [
            createItem("M.Second.1.1"),
            createItem("M.Second.2.2"),
            createItem("M.Second.3.3"),
          ]),
        ]),
      ]),
    ]),
    createItem("Music", [
      createItem("Music.1", [
        createItem("Music.1.1"),
        createItem("Music.2.2"),
        createItem("Music.3.3"),
        createItem("M.Second", [
          createItem("M.Second.1", [
            createItem("M.Second.1.1"),
            createItem("M.Second.2.2"),
            createItem("M.Second.3.3"),
          ]),
        ]),
      ]),
    ]),
  ]),
]);
export default small;
