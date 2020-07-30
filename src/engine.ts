import { GridData, BoxIndex, GRID_EMPTY, GridIndex } from "./types";


const makeEngineMove: (data: GridData) => BoxIndex = (data) => {
  const 
    emptyBoxes: BoxIndex[] = [];
  for (const [i , row] of data.entries()) {
    for (const [j, value] of row.entries()) {
      if (value === GRID_EMPTY) {
        emptyBoxes.push([i as GridIndex, j as GridIndex]);
      }
    }
  }
  if (emptyBoxes.length === 0) {
    throw new Error("No empty Boxes left!");    
  }
  return emptyBoxes[Math.floor(Math.random() * emptyBoxes.length)];
}

export default makeEngineMove;