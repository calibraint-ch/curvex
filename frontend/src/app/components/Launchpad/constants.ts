import { RcFile } from "antd/es/upload";

export const curveOptions = [
  { value: "1", label: "Linear" },
  { value: "2", label: "Polynomial" },
  { value: "3", label: "Sub-Linear" },
  { value: "4", label: "S-Curve" },
];

export const vestingPeriodOptions = [
  { value: "15", label: "15 days" },
  { value: "30", label: "30 days" },
  { value: "45", label: "45 days" },
  { value: "60", label: "60 days" },
];

export const LaunchPadInitialValues = {
  curveType: "1",
  vestingPeriod: "45",
};

export type CurveParams = {
  lockPeriod: number;
  totalSupply: number;
  precision: number; //slope
};

export type LaunchFormData = {
  tokenName: string;
  tokenSymbol: string;
  curveType: number;
  logoImage: RcFile;
  curveParams: CurveParams;
  pairToken: string;
};
