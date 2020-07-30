export const GRID_X = 1, GRID_O = -1, GRID_EMPTY = 0;

export type GridData = [GridRow, GridRow, GridRow];

export type GridRow = [GridValue, GridValue, GridValue];

export type GridValue = typeof GRID_X | typeof GRID_O | typeof GRID_EMPTY;

export type PlayerAtTurn = typeof GRID_X | typeof GRID_O;