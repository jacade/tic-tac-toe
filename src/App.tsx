import React, { useState } from 'react';
import './App.css';
import Grid from './components/Grid';
import { GridData, GRID_X, GRID_O, PlayerAtTurn, GridValue, GridRow, GRID_EMPTY, BoxIndex } from './types';
import makeEngineMove from './engine';

export interface State {
  data: GridData,
  turn: PlayerAtTurn,
  count: number
}

const flipTurn: (currentTurn: PlayerAtTurn) => PlayerAtTurn = (currentTurn) => currentTurn === GRID_X ? GRID_O : GRID_X;

const makeMove: (box: BoxIndex, data: GridData, atTurn: PlayerAtTurn) => GridData = (box, data, atTurn) =>
  data.map<GridRow>((r, i) => i !== box[0] ? r : r.map<GridValue>((v, j) => j !== box[1] ? v : atTurn) as GridRow) as GridData;


function App() {
  const [state, setState] = useState<State>({
    data: [[0, 0, 0], [0, 0, 0], [0, 0, 0]],
    turn: GRID_X,
    count: 0
  })
  return (
    <div style={{ height: "100vh" }}>
      <Grid data={state.data} onBoxClick={(box) => {
        if (state.data[box[0]][box[1]] === GRID_EMPTY) {
          setState(state => ({
            ...state,
            data: makeMove(box, state.data, state.turn),
            turn: flipTurn(state.turn),
            count: state.count + 1
          }));
          if (state.count < 4) {
            setState(state => ({
              ...state,
              data: makeMove(makeEngineMove(state.data), state.data, state.turn),
              turn: flipTurn(state.turn)
            }));
          }
        }
      }} />
    </div>
  );
}

export default App;
