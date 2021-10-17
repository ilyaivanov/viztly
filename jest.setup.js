jest.mock("./src/infra/animations", () => ({
  animateColor: (from, to, onTick) => onTick(to),
  animate: (from, to, onTick) => onTick(to),
}));
