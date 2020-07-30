import React, { useState } from 'react';
import './App.css';
import Grid from './components/Grid';
import { GridData, GRID_X, GRID_O, PlayerAtTurn, GridValue, GridRow, GRID_EMPTY } from './types';

export interface State {
  data: GridData,
  turn: PlayerAtTurn
}

const flipTurn: (currentTurn: PlayerAtTurn) => PlayerAtTurn = (currentTurn) => currentTurn === GRID_X ? GRID_O : GRID_X;

const makeMove: (row: number, col: number, data: GridData, atTurn: PlayerAtTurn) => GridData = (row, col, data, atTurn) =>
  data.map<GridRow>((r, i) => i !== row ? r : r.map<GridValue>((v, j) => j !== col ? v : atTurn) as GridRow) as GridData;

function App() {
  const [state, setState] = useState<State>({
    data: [[0, 0, 0], [0, 0, 0], [0, 0, 0]],
    turn: GRID_X
  })
  return (
    <div style={{ height: "100vh" }}>
      <Grid data={state.data} onBoxClick={(row, col) => {
        if (state.data[row][col] === GRID_EMPTY) {
          setState({
            ...state,
            data: makeMove(row, col, state.data, state.turn),
            turn: flipTurn(state.turn)
          });
        }
      }} />
    </div>
  );
}

export default App;
