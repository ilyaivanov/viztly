import { c, fontSizes } from "../designSystem";
import { Canvas } from "../infra/canvas";

export const drawTextAt = (
  canvas: Canvas,
  x: number,
  y: number,
  color: string
) => {
  const { ctx } = canvas;
  const entries: LocalSearchEntry = {
    item: { title: "Hello my dear or dearest friend" },
    highlights: [
      { from: 9, to: 13 },
      { from: 17, to: 21 },
    ],
  };

  const parts = createRowTitleWithHighlightsFromTerms(
    entries.highlights,
    entries.item.title
  );

  let offset = x;
  ctx.fillStyle = color;
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

type LocalSearchEntry = { item: { title: string }; highlights: Highlight[] };

type Highlight = { from: number; to: number };
