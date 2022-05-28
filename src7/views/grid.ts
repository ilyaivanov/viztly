import { globalCanvas } from "../globalCanvas";
import sp from "../spacings";
import { colors } from "../colors";

export const drawGrid = () => {
  for (let x = 0; x < window.innerWidth; x += sp.gridSize) {
    for (let y = 0; y < window.innerHeight; y += sp.gridSize) {
      globalCanvas.fillRect(x - 1, y - 1, 2, 2, colors.gridPoint.getHexColor());
    }
  }
};
