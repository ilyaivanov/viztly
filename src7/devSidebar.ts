import { colors } from "./colors";
import sp from "./spacings";
const elem = document.createElement("div");

const width = 350;
elem.style.position = "absolute";
elem.style.bottom = "0";
elem.style.top = "0";
elem.style.right = "0";
elem.style.width = `${width}px`;
elem.style.backgroundColor = colors.secondaryBackground.getHexColor();
elem.style.transition = "transform 200ms";
elem.style.transform = `translateX(${width}px)`;
elem.style.display = "none";

let isOpen = false;
export const initSidebar = (render: () => void) => {
  document.body.style.overflow = "hidden";
  document.body.appendChild(elem);
  elem.style.color = colors.text.getHexColor();

  const table = document.createElement("table");

  Object.keys(sp).forEach((key) => {
    const keyTyped = key as keyof typeof sp;
    const step = keyTyped === "circleRadius" ? 0.5 : 1;
    table.appendChild(
      row({
        label: convertCamelCaseToSpaces(key),
        value: (sp as any)[key],
        min: 1,
        step,
        max: 50,
        onChange: (v) => {
          (sp as any)[key] = v;
          render();
        },
      })
    );
  });

  elem.append(table);
};

const convertCamelCaseToSpaces = (text: string) => {
  var result = text.replace(/([A-Z])/g, " $1");
  return result.charAt(0).toUpperCase() + result.slice(1);
};

type RowProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
};

//
const row = ({ label, min, max, step, value, onChange }: RowProps) => {
  const row = document.createElement("tr");
  const left = document.createElement("td");
  left.style.fontSize = 12 + "px";

  const right = document.createElement("td");

  left.textContent = label;

  const input1 = document.createElement("input");
  input1.type = "range";
  input1.style.width = `200px`;
  input1.value = value + "";
  input1.min = min + "";
  input1.max = max + "";
  input1.step = step + "";
  input1.addEventListener("input", (v) => {
    input2.value = input1.value;
    onChange(+input1.value);
  });

  const input2 = document.createElement("input");
  input2.type = "number";
  input2.size = 4;
  input2.style.width = `25px`;
  input2.value = value + "";
  input2.addEventListener("input", (v) => {
    input1.value = input2.value;
    onChange(+input2.value);
  });
  //   right.classList.add("value-cell");
  right.style.display = "flex";
  right.style.alignItems = "center";
  right.appendChild(input1);
  right.appendChild(input2);
  row.appendChild(left);
  row.appendChild(right);
  return row;
};

export const toggleVisible = () => {
  isOpen = !isOpen;
  if (isOpen) {
    elem.style.display = "initial";
    requestAnimationFrame(() => {
      elem.style.transform = "translateX(0)";
    });
  } else {
    if (document.activeElement) (document.activeElement as HTMLElement).blur();
    elem.style.transform = `translateX(${width}px)`;
    setTimeout(() => (elem.style.display = "none"), 200);
  }
};
