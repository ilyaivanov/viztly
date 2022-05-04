import { AnimatedColor } from "./animatedColor";

it("creating a color from hex starting with zeros should return the same color", () => {
  const c = new AnimatedColor("#009EF7");

  expect(c.getHexColor()).toBe("#009EF7".toLocaleLowerCase());
});
