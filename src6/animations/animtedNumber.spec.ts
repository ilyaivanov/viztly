import { AnimatedNumber } from "./animatedNumber";
//done cb
it("checking animation from 0..1 and 350..50", () => {
  const a = new AnimatedNumber(0);

  const cb = jest.fn();
  a.switchTo(1, cb);

  a.tick(50);
  console.log(a.current);

  a.tick(50);
  console.log(a.current);

  a.tick(50);
  console.log(a.current);

  a.tick(50);
  console.log(a.current);

  a.tick(50);
  console.log(a.isAnimating, a.current);
  expect(cb).not.toHaveBeenCalled();

  a.tick(50);
  console.log(a.isAnimating, a.current);
  expect(cb).toHaveBeenCalled();

  a.tick(50);
  console.log(a.isAnimating, a.current);
});

//orchestration
