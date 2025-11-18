export interface SimulationParams {
  count: number;
  startValue: number;
  step: number;
  maxRows: number;
}

export interface GridState {
  rows: number[][];
  minVal: number;
  maxVal: number;
}

export interface ViewSettings {
  isModuloMode: boolean;
  modulus: number;
}
