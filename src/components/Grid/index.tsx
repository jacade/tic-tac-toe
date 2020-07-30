import React from "react";
import { GRID_O, GRID_X, GridData, GridValue, GridIndex, BoxIndex } from "../../types";
import "./Grid.css";

interface Props {
  data: GridData,
  onBoxClick?: (box: BoxIndex) => void
}

const drawX = () => (<>
  <line x1="5" y1="45" x2="45" y2="5" stroke="red" />
  <line x1="5" y1="5" x2="45" y2="45" stroke="red" />
</>);

const drawO = () => (<ellipse cx="25" cy="25" rx="20" ry="20" stroke="blue" fill="none" />);

const drawGraphic = (value: GridValue) => (value === GRID_X && drawX()) || (value === GRID_O && drawO());

const valueToDisplay = (value: GridValue) => (<svg viewBox="0, 0, 50, 50">
  {drawGraphic(value)}
</svg>);

const makeBox = (i: GridIndex, j: GridIndex, value: GridValue, onBoxClick?: (box: BoxIndex) => void) => (
  <div key={`${i}${j}`}
    className={`box h-${j} v-${i}`}
    onClick={() => typeof onBoxClick !== "undefined" && onBoxClick([i, j])}>
    {valueToDisplay(value)}
  </div>
);

const Grid: React.FC<Props> = ({ data, onBoxClick }) => (
  <div className="grid">
    {data.map((row, i) => row.map((value, j) => makeBox(i as GridIndex, j as GridIndex, value, onBoxClick)))}
  </div>
);

export default Grid;