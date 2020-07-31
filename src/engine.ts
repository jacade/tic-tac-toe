import { GridData, BoxIndex, GRID_EMPTY, GridIndex } from "./types";

const rows: BoxIndex[][] = [[[0, 0], [0, 1], [0, 2]], [[1, 0], [1, 1], [1, 2]], [[2, 0], [2, 1], [2, 2]]];
const columns: BoxIndex[][] = [[[0, 0], [1, 0], [2, 0]], [[0, 1], [1, 1], [2, 1]], [[0, 2], [1, 2], [2, 2]]];
const diagonals: BoxIndex[][] = [[[0, 0], [1, 1], [2, 2]], [[0, 2], [1, 1], [2, 0]]];
const vectors = [rows, columns, diagonals];
const center: BoxIndex = [1, 1];

const isSameBox = (box1: BoxIndex, box2: BoxIndex) => box1[0] === box2[0] && box1[1] === box2[1];
const getSumOfBoxes: (boxes: BoxIndex[], data: GridData) => number = (boxes, data) => boxes.reduce<number>((sum, box) => sum + data[box[0]][box[1]], 0);
const intersectBoxes: (boxes1: BoxIndex[], boxes2: BoxIndex[]) => BoxIndex[] =
  (boxes1, boxes2) => boxes1.filter(box1 => boxes2.some(box2 => isSameBox(box1, box2)));
const getBoxesWithBox: (boxes: BoxIndex[], box: BoxIndex) => BoxIndex[] = (boxes, box) => intersectBoxes([box], boxes);
const indexes: GridIndex[] = [0, 1, 2];
const getEmptyBoxes = (data: GridData) => indexes.flatMap<BoxIndex>(v => indexes.map<BoxIndex>(w => [v, w])).filter(box => data[box[0]][box[1]] === GRID_EMPTY);

const makeEngineMove: (data: GridData) => BoxIndex = (data) => {
  const
    emptyBoxes: BoxIndex[] = getEmptyBoxes(data);
  if (emptyBoxes.length === 0) {
    throw new Error("No empty Boxes left!");
  }
  for (const set of vectors) { // checks if engine can win
    for (const vector of set) {
      if (getSumOfBoxes(vector, data) === -2) {
        return intersectBoxes(vector, emptyBoxes)[0];
      }
    }
  }
  for (const set of vectors) { // prevents player from winning next turn
    for (const vector of set) {
      if (getSumOfBoxes(vector, data) === 2) {
        return intersectBoxes(vector, emptyBoxes)[0];
      }
    }
  }
  if (emptyBoxes.filter(box => isSameBox(box, center)).length > 0) { // take center if available
    return center;
  }
  let max = 0;
  let nextMoves: BoxIndex[] = [];
  for (const box of emptyBoxes) {
    const m = vectors.map(v => v.filter(triple => getBoxesWithBox(triple, box).length > 0)).filter(v => v.length > 0).flat().filter(boxes => getSumOfBoxes(boxes, data) > 0).length;
    if (m > max) {
      max = m;
      nextMoves = [box];
    } else if (m === max) {
      nextMoves.push(box);
    }
  }
  if (nextMoves.length === 1) {
    return nextMoves[0];
  }
  max = 0;
  let nextSmartMoves: BoxIndex[] = [];
  for (const move of nextMoves) {
    const m = vectors.map(v => v.filter(triple => getBoxesWithBox(triple, move).length > 0)).filter(v => v.length > 0).flat().filter(boxes => getSumOfBoxes(boxes, data) < 0).length;
    if (m > max) {
      max = m;
      nextSmartMoves = [move];
    } else if (m === max) {
      nextSmartMoves.push(move);
    }
  }
  return nextSmartMoves[Math.floor(Math.random() * nextSmartMoves.length)];
}

export default makeEngineMove;