import { c, fontSizes } from "../designSystem";
import { Canvas } from "../infra/canvas";
import Item from "../itemTree/item";

const all = <T>(arr: T[], predicate: (a: T) => boolean): boolean => {
  //not using reduce here because I want to have the ability not to traverse whole array
  //and return result as long as I get predicate returning false
  //same goes for any
  for (var i = 0; i < arr.length; i++) {
    if (!predicate(arr[i])) return false;
  }
  return true;
};

const traverseChildrenBFS = <T>(
  item: Item,
  filterMap: (item: Item) => T | undefined,
  maxResults: number
): T[] => {
  const results: T[] = [];
  const queue: Item[] = [];
  const traverse = () => {
    const item = queue.shift();

    if (!item || results.length >= maxResults) return queue;

    const resultingItem = filterMap(item);

    if (resultingItem) results.push(resultingItem);
    if (item.children) item.children.forEach((subitem) => queue.push(subitem));
    traverse();
  };

  queue.push(item);
  traverse();
  return results;
};

//BFS on items tree finding items with case-insensitive term
export const findLocalItems = (
  rootItem: Item,
  term: string
): LocalSearchResults => {
  const MAX_ITEMS_TO_FIND = 12;

  const terms = term
    .toLocaleLowerCase()
    .split(" ")
    .filter((x) => x);

  const isMatchingTerms = (item: Item): LocalSearchEntry | undefined => {
    const loweredTitle = item.title.toLocaleLowerCase();
    const indexes = terms.map((term) => loweredTitle.indexOf(term));

    if (all(indexes, (index) => index >= 0))
      return {
        item,
        highlights: createTermsFound(item.title, terms),
      };
    return undefined;
  };

  return {
    items: traverseChildrenBFS(rootItem, isMatchingTerms, MAX_ITEMS_TO_FIND),
    term,
  };
};

//see unit tests for more details
const createTermsFound = (title: string, terms: string[]): Highlight[] => {
  const indexes = terms.map((term) => title.toLocaleLowerCase().indexOf(term));
  return createTitleHighlightsFromFoundTerms(
    terms
      .map((term, termIndex) => ({
        term,
        foundAt: indexes[termIndex],
      }))
      .sort((prev, next) => prev.foundAt - next.foundAt)
  );
};

const createTitleHighlightsFromFoundTerms = (
  terms: TermsFound[]
): { from: number; to: number }[] => {
  const foundsAt: Map<number, string> = new Map();

  terms.forEach((termFound) => {
    if (
      !foundsAt.has(termFound.foundAt) ||
      foundsAt.get(termFound.foundAt)!.length < termFound.term.length
    )
      foundsAt.set(termFound.foundAt, termFound.term);
  });

  return Array.from(foundsAt.entries()).map(([key, value]) => ({
    from: key,
    to: key + value.length,
  }));
};
type TermsFound = { term: string; foundAt: number };

export const drawTextAt = (
  canvas: Canvas,
  x: number,
  y: number,
  { highlights, item }: LocalSearchEntry
) => {
  const { ctx } = canvas;

  const parts = createRowTitleWithHighlightsFromTerms(highlights, item.title);

  let offset = x;
  ctx.fillStyle = "white";
  parts.forEach((part) => {
    if (part.isBold) ctx.font = `600 ${fontSizes.regular}px Segoe UI`;
    else ctx.font = `300 ${fontSizes.regular}px Segoe UI`;

    const measure = ctx.measureText(part.text);
    ctx.fillText(part.text, offset, y);

    if (part.isBold)
      canvas.drawLine(
        { x: offset, y: y + 6 },
        { x: offset + measure.width, y: y + 6 },
        1,
        c.lineSelected
      );
    offset += measure.width;
  });
};

const createRowTitleWithHighlightsFromTerms = (
  highlights: Highlight[],
  title: string
): { text: string; isBold: boolean }[] =>
  highlights
    .map((term, index) => {
      const prevIndex = index == 0 ? 0 : highlights[index - 1].to;
      return [
        { text: title.slice(prevIndex, term.from), isBold: false },
        { text: title.slice(term.from, term.to), isBold: true },
      ];
    })
    .flat()
    .concat({
      text: title.slice(highlights[highlights.length - 1].to),
      isBold: false,
    });

export type LocalSearchEntry = {
  item: { title: string };
  highlights: Highlight[];
};

type Highlight = { from: number; to: number };

export type LocalSearchResults = {
  items: LocalSearchEntry[];
  term: string;
};
