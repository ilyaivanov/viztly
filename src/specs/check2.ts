import { AppContent } from "../app";
import { sp } from "../view/design";

type VerificationProps = {
  title?: string;
  isSelected?: boolean;
  shouldNotExist?: boolean;
  isCircleFilled?: boolean;
};

export const itemAtv2 = (
  app: AppContent,
  gridX: number,
  gridY: number,
  props: VerificationProps
) => {
  const view = findItemViewByPosition(app, gridX, gridY);
  if (!view) {
    if (props.shouldNotExist) return;
    const viewWithTheSameTitle = isDefined(props.title)
      ? findItemViewByTitle(app, props.title)
      : undefined;
    throwNotFoundItemViewAt(gridX, gridY, viewWithTheSameTitle);
  } else {
    if (props.shouldNotExist) throwShouldNotExist(view);
    verifyItemView(view, props);
  }
};

const verifyItemView = (view: ItemView, props: VerificationProps) => {
  if (isDefined(props.title) && view.text.text !== props.title)
    throwUnexpectedTitle(view, props.title);

  if (isDefined(props.isSelected)) checkItemIsSelected(view, props.isSelected);

  virifyCircle(view, props);
};

//verifications
const checkItemIsSelected = (view: ItemView, isSelected: boolean) => {
  const { circle, text } = view;
  const expectedColor = isSelected ? sp.selectedCircle : sp.regularColor;
  if (circle.color !== expectedColor || text.color !== expectedColor)
    throwUnexpectedColor(view, expectedColor);
};
const virifyCircle = (view: ItemView, props: VerificationProps) => {
  if (
    isDefined(props.isCircleFilled) &&
    view.circle.filled !== props.isCircleFilled
  )
    throwError(
      `Expected '${view.text.text}' to have circleFilled: ${props.isCircleFilled}, but was: ${view.circle.filled}`
    );
};
//error messages
const throwUnexpectedTitle = (view: ItemView, expectedTitle: string) =>
  throwError(
    `Expected item at ${formatViewPosition(
      view
    )} to have title '${expectedTitle}', but it was '${view.text.text}'`
  );

const throwUnexpectedColor = (view: ItemView, expectedColor: string) => {
  const { circle, text } = view;
  throwError(
    `Expected '${view.text.text}' at ${formatViewPosition(
      view
    )} to have color ${expectedColor}, but circle is ${
      circle.color
    } and text is ${text.color}`
  );
};
const throwShouldNotExist = (view: ItemView) =>
  throwError(
    `Expected '${view.text.text}' at ${formatViewPosition(view)} not to exist`
  );

const throwShouldNotHaveTitle = (view: ItemView) =>
  throwError(
    `Expected '${view.text.text}' at ${formatViewPosition(
      view
    )} to have a different title`
  );

const throwNotFoundItemViewAt = (
  gridX: number,
  gridY: number,
  viewWithTheSameTitle?: ItemView
) => {
  const extraMesssage = viewWithTheSameTitle
    ? ` Found '${viewWithTheSameTitle?.text.text}' at ${formatViewPosition(
        viewWithTheSameTitle
      )}`
    : "";
  const itemReference = viewWithTheSameTitle
    ? `'${viewWithTheSameTitle.text.text}'`
    : "an item";
  throwError(
    `Expected to find ${itemReference} at ${toX(gridX)},${toY(
      gridY
    )} (${gridX},${gridY}).${extraMesssage}`
  );
};

//ItemView utils
const findItemViewByPosition = (
  app: AppContent,
  gridX: number,
  gridY: number
): ItemView | undefined => {
  const x = toX(gridX);
  const y = toY(gridY);
  const viewFromMap = Array.from(app.itemsToViews.values()).find(
    (view) => getDistance(x, y, view.circle.x, view.circle.y) < 0.1
  );

  const viewFromSet = Array.from(app.views.values()).find(
    (view) => view.type === "circle" && getDistance(x, y, view.x, view.y) < 0.1
  );

  if (XOR(viewFromMap, viewFromSet)) {
    const extra = viewFromMap
      ? `I've found view '${viewFromMap.text.text}' in app.itemsToViews, but can't find circle from that view in app.views.`
      : `I've found circle in app.views, but can't find itemView with that circle in app.itemsToViews.`;
    throwError(
      `AppContent is inconsistent: app.itemsToViews and app.views have conflicting values. ${extra} This probably a memory leak in the app.`
    );
  }

  if (viewFromMap) return viewFromMap;
};

const findItemViewByTitle = (
  app: AppContent,
  title: string
): ItemView | undefined =>
  Array.from(app.itemsToViews.values()).find(
    (view) => view.text.text === title
  );

//UTILS
const throwError = (message: string) => {
  throw new Error(message);
};
const toX = (gridX: number) => sp.start + sp.xStep * (gridX - 1);
const toY = (gridY: number) => sp.start + sp.yStep * (gridY - 1);
const toGridX = (x: number) => (x - sp.start) / sp.xStep + 1;
const toGridY = (y: number) => (y - sp.start) / sp.yStep + 1;

const getDistance = (x1: number, y1: number, x2: number, y2: number): number =>
  Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));

const isDefined = <T>(a: T | undefined): a is T => typeof a !== "undefined";
const formatViewPosition = (view: ItemView) => {
  const { circle } = view;
  return `${circle.x},${circle.y} (${toGridX(circle.x)},${toGridY(circle.y)})`;
};

const XOR = (a: unknown, b: unknown): boolean => (!!a || !!b) && !(a && b);
