export interface CharCell {
  baseLevel: number;
  currentLevel: number;
  col: number;
  row: number;
  isTransparent?: boolean;
}

export interface Colors {
  bg: string;
  fg: string;
}
