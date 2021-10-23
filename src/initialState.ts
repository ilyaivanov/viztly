import { createItem, createRoot } from "./itemTree";

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
        createItem("M.Second.1", [
          createItem("M.Second.1.1"),
          createItem("M.Second.2.2"),
          createItem("M.Second.3.3"),
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
export default big;
