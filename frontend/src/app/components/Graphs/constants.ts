export type GraphProps = {
  cap: number;
  increment: number;
  type: string;
  previewOnly: boolean;
  slope?: number;
  intercept?: number;
  legend?: boolean;
};

export enum CurveTypes {
  linear = "linear",
  polynomial = "polynomial",
  subLinear = "subLinear",
  sCurve = "sCurve",
}

export type dataType = {
  totalSupply: number;
  price: number;
};

export const strokeColors = {
  grey: "#808080",
  white: "#ffffff",
  green: "#6bd28e",
  lemon: "#f3f264",
};
