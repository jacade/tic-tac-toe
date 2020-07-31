import { GridData, BoxIndex, GRID_EMPTY, GridIndex, PlayerAtTurn, GRID_X, GRID_O } from "./types";

const rows: BoxIndex[][] = [[[0, 0], [0, 1], [0, 2]], [[1, 0], [1, 1], [1, 2]], [[2, 0], [2, 1], [2, 2]]];
const columns: BoxIndex[][] = [[[0, 0], [1, 0], [2, 0]], [[0, 1], [1, 1], [2, 1]], [[0, 2], [1, 2], [2, 2]]];
const diagonals: BoxIndex[][] = [[[0, 0], [1, 1], [2, 2]], [[0, 2], [1, 1], [2, 0]]];
const vectors = [rows, columns, diagonals].flat();
const center: BoxIndex = [1, 1];

const isSameBox = (box1: BoxIndex, box2: BoxIndex) => box1[0] === box2[0] && box1[1] === box2[1];
const getSumOfBoxes: (boxes: BoxIndex[], data: GridData) => number = (boxes, data) => boxes.reduce<number>((sum, box) => sum + data[box[0]][box[1]], 0);
const intersectBoxes: (boxes1: BoxIndex[], boxes2: BoxIndex[]) => BoxIndex[] =
  (boxes1, boxes2) => boxes1.filter(box1 => boxes2.some(box2 => isSameBox(box1, box2)));
const isBoxContainedInBoxes = (box: BoxIndex) => (boxes: BoxIndex[]) => intersectBoxes([box], boxes).length > 0;
const indexes: GridIndex[] = [0, 1, 2];
const getEmptyBoxes = (data: GridData) => indexes.flatMap<BoxIndex>(v => indexes.map<BoxIndex>(w => [v, w])).filter(box => data[box[0]][box[1]] === GRID_EMPTY);
const getVectorsWithSumEqualsValue = (data: GridData, compareValue: number) => vectors.filter(v => getSumOfBoxes(v, data) === compareValue);
const getCrossingVectors = (box: BoxIndex) => vectors.filter(isBoxContainedInBoxes(box));
const getImportantBoxes = (boxes: BoxIndex[][], data: GridData, forPlayer: PlayerAtTurn) => boxes.filter(b => getSumOfBoxes(b, data) * forPlayer > 0);
const countImportantCrossings = (box: BoxIndex, data: GridData, forPlayer: PlayerAtTurn) => getImportantBoxes(getCrossingVectors(box), data, forPlayer).length;

const makeEngineMove: (data: GridData) => BoxIndex = (data) => {
  const
    emptyBoxes: BoxIndex[] = getEmptyBoxes(data);
  if (emptyBoxes.length === 0) {
    throw new Error("No empty Boxes left!");
  }
  // checks if engine can win
  for (const vector of getVectorsWithSumEqualsValue(data, -2)) {
    return intersectBoxes(vector, emptyBoxes)[0];
  }
  // prevents player from winning next turn
  for (const vector of getVectorsWithSumEqualsValue(data, 2)) {
    return intersectBoxes(vector, emptyBoxes)[0];
  } 
  // take center if available
  if (emptyBoxes.filter(box => isSameBox(box, center)).length > 0) {
    return center;
  }
  // find move with maximal crossing out of opponents possibilities
  let max = Math.max(...emptyBoxes.map(box => countImportantCrossings(box, data, GRID_X)));
  const nextMoves: BoxIndex[] = emptyBoxes.filter(box => countImportantCrossings(box, data, GRID_X) === max);
  // find move with maximal increasing of own chances
  max = Math.max(...nextMoves.map(box => countImportantCrossings(box, data, GRID_O)));
  const nextSmartMoves: BoxIndex[] = nextMoves.filter(box => countImportantCrossings(box, data, GRID_O) === max);
  return nextSmartMoves[Math.floor(Math.random() * nextSmartMoves.length)];
}

export default makeEngineMove;