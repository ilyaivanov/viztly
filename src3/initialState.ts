import {
  createItemTree,
  createItemBoard,
  createTree,
  Tree,
} from "../src2/core";

export const tree: Tree = createTree(
  createItemTree("Root", [
    createItemTree("Music", [
      createItemBoard("Ambient", [
        createItemTree("Carbon Based Lifeforms", [
          createItemTree("1998 - The Path"),
          createItemTree("2003 - Hydroponic Garden"),
          createItemTree("2006 - World Of Sleepers"),
          createItemTree("2010 - Interloper"),
          createItemTree("2011 - Twentythree"),
          createItemTree("2013 - Refuge"),
          createItemTree("2016 - Alt:01"),
          createItemTree("2017 - Derelicts"),
          createItemTree("2020 - ALT:02", [
            createItemTree("Metrosat 4 (Remastered)"),
            createItemTree("Supersede (First Version)"),
            createItemTree("Dreamshore Forest (Analog Remake)"),
            createItemTree("Vakna (Remastered)"),
            createItemTree("Vision (Revisited)"),
            createItemTree("Lemming Leisures (Cbl Carbonator Rmx)"),
            createItemTree("Silent Running (Live)"),
            createItemTree("Epicentre Second Movement (Remastered)"),
            createItemTree("Path of Least Dunka Dunka"),
            createItemTree("Tensor (Live)"),
            createItemTree("M (Live)"),
          ]),
        ]),
        createItemTree("Sync24", [
          createItemTree("Sync24 - Omnious [Full Album]"),
          createItemTree("Sync24 - Comfortable Void [Full Album]"),
          createItemTree("Sync24 - Source | Leftfield Records [Full Album]"),
        ]),
        createItemTree("Solar Fields", [
          createItemTree("Solar Fields - Reflective Frequencies [Full Album]"),
          createItemTree("Solar Fields - Random Friday [Full Album]"),
          createItemTree("Solar Fields - Origin # 1 | Full Album"),
          createItemTree("Solar Fields - Leaving Home [Full Album]"),
          createItemTree("Solar Fields - Origin # 03 (Full Album 2019)"),
          createItemTree("Solar Fields - Movements | Full Album"),
        ]),
      ]),
    ]),
    createItemTree("Tasks", [
      createItemTree("Viztly"),
      createItemTree("Viztly 3.0"),
      createItemTree("Northfork"),
    ]),
  ])
);
