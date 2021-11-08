let input: HTMLInputElement | undefined;

export const drawInputAt = (x: number, y: number, h: number, w: number) => {
  if (!input) {
    input = document.createElement("input");
    input.classList.add("title-input");
    document.body.appendChild(input);
    input.focus();
    input.placeholder = "Find items... Space to play, Enter to focus";
  }

  const { style } = input;

  style.height = h + "px";
  style.width = w + "px";
  style.left = x + "px";
  style.top = y + "px";
  style.color = "black";
};
