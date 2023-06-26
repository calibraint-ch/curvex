import { Tag } from "antd";

export const deployedColumns = [
  {
    title: "Token",
    dataIndex: "token",
    key: "token",
    render: (text: string) => <div style={{ fontWeight: "bold" }}>{text}</div>,
  },
  {
    title: "Total Supply",
    dataIndex: "totalSupply",
    key: "totalSupply",
  },
  {
    title: "Curve Type",
    dataIndex: "curveType",
    key: "curveType",
    render: (curve: string) => {
      let color = "";
      switch (curve) {
        case "Linear":
          color = "#ff8da1";
          break;
        case "Sub-Linear":
          color = "#a0a0a0";
          break;
        case "Polynomial":
          color = "#ffba3b";
          break;
        case "S-Curve":
          color = "#4ff4a2";
          break;
        default:
          color = "#ff0040";
      }
      return (
        <Tag color={color} className="tag">
          {curve}
        </Tag>
      );
    },
  },
  {
    title: "Vesting Period",
    dataIndex: "vestingPeriod",
    key: "vestingPeriod",
  },
];

export const claimableColumns = [
  {
    title: "Token Name",
    dataIndex: "tokenName",
    key: "tokenName",
    render: (text: string) => <div style={{ fontWeight: "bold" }}>{text}</div>,
  },
  {
    title: "No Of Tokens",
    dataIndex: "noOfTokens",
    key: "noOfTokens",
  },
];

// For Testing Purpose
export const deployedDataSource = [
  {
    key: "1",
    token: "Curve X (CRVX)",
    totalSupply: 1000,
    curveType: "Linear",
    vestingPeriod: "2months",
  },
  {
    key: "2",
    token: "Curve X (CRVX)",
    totalSupply: 1000,
    curveType: "Sub-Linear",
    vestingPeriod: "3months",
  },
  {
    key: "3",
    token: "Curve X (CRVX)",
    totalSupply: 1000,
    curveType: "Polynomial",
    vestingPeriod: "2months",
    base: "--",
    balance: 12.12,
  },
  {
    key: "4",
    token: "Curve X (CRVX)",
    totalSupply: 4000,
    curveType: "S-Curve",
    vestingPeriod: "4months",
    base: "--",
    balance: 12.12,
  },
  {
    key: "5",
    token: "Curve X (CRVX)",
    totalSupply: 100,
    curveType: "Linear",
    vestingPeriod: "2months",
    base: "--",
    balance: 12.12,
  },
  {
    key: "6",
    token: "Curve X (CRVX)",
    totalSupply: 100,
    curveType: "S-Curve",
    vestingPeriod: "2months",
    base: "--",
    balance: 12.12,
  },
  {
    key: "7",
    token: "Curve X (CRVX)",
    totalSupply: 100,
    curveType: "Polynomial",
    vestingPeriod: "2months",
    base: "--",
    balance: 12.12,
  },
  {
    key: "8",
    token: "Curve X (CRVX)",
    totalSupply: 100,
    curveType: "Linear",
    vestingPeriod: "2months",
    base: "--",
    balance: 12.12,
  },
  {
    key: "9",
    token: "Curve X",
    totalSupply: 100,
    curveType: "Sub-Linear",
    vestingPeriod: "2months",
    base: "--",
    balance: 12.12,
  },
  {
    key: "10",
    token: "Curve X",
    totalSupply: 100,
    curveType: "Linear",
    vestingPeriod: "2months",
    base: "--",
    balance: 12.12,
  },
];

export const claimableDataSource = [
  {
    key: "1",
    tokenName: "CurveX",
    noOfTokens: 1.33,
  },
  {
    key: "2",
    tokenName: "CurveX",
    noOfTokens: 2.65,
  },
  {
    key: "3",
    tokenName: "CurveX",
    noOfTokens: 6463,
  },
  {
    key: "4",
    tokenName: "CurveX",
    noOfTokens: 2.5,
  },
  {
    key: "5",
    tokenName: "CurveX",
    noOfTokens: 1.5,
  },
  {
    key: "6",
    tokenName: "CurveX",
    noOfTokens: 3.5,
  },
];
