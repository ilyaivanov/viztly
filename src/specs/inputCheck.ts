type InputProps = {
  top: number;
  left: number;
  text: string;
};
export const checkInput = (inputProps: InputProps) => {
  const el = document.getElementById("main-input") as HTMLInputElement;
  if (el) {
    if (
      el.style.top !== inputProps.top + "px" ||
      el.style.left !== inputProps.left + "px"
    )
      throw new Error(
        `Input has invalid position. Expected ${inputProps.left}px, ${inputProps.top}px; but received ${el.style.left}, ${el.style.top}`
      );

    if (el.value !== inputProps.text)
      throw new Error(
        `Input has invalid value. Expected ${inputProps.text}; but received ${el.value}`
      );
  } else {
    throw new Error(
      `Can't find an input element. Searched for #main-input element in the body.`
    );
  }
};

export const inputDoesNotExist = () => {
  const el = document.getElementById("main-input") as HTMLInputElement;
  if (el) {
    throw new Error(
      "Input was expected to be removed from body, but found at #main-input"
    );
  }
};
