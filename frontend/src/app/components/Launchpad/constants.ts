import { RcFile } from "antd/es/upload";

export const curveOptions = [
  { value: "linear", label: "Linear" },
  { value: "polynomial", label: "Polynomial" },
  { value: "sub-linear", label: "Sub-Linear" },
  { value: "s-curve", label: "S-curve" },
];

export const vestingPeriodOptions = [
  { value: "15", label: "15 days" },
  { value: "30", label: "30 days" },
  { value: "45", label: "45 days" },
  { value: "60", label: "60 days" },
];

export type CurveParams = {
  lockPeriod: string;
  totalSupply: number;
  precision: number; //slope
};

export type LaunchFormData = {
  tokenName: string;
  tokenSymbol: string;
  curveType: number;
  logoImage: RcFile;
  curveParams: CurveParams;
  tokenManager: string;
};
