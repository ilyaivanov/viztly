export const init = () => {
  const el = document.createElement("div");
  el.style.fontSize = 36 + "px";

  let counter = 0;
  setInterval(() => {
    counter += 1;
    el.textContent = counter + "";
  }, 200);

  document.body.appendChild(el);
};

export const unused = () => {
  return 42;
};
