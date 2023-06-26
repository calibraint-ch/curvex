import type { ColumnsType } from "antd/es/table";
import { DeployedTokensList } from "../../containers/UserDashboard/types";

export interface Key {
  key: React.Key;
}

export interface DeployedDataProps extends Key {
  token: string;
  totalSupply: number;
  curveType: string;
  vestingPeriod: string;
  base: string;
  balance: number;
}

export interface ClaimableDataProps extends Key {
  tokenName: string;
  noOfTokens: number;
}

export interface TableComponentProps {
  columns: ColumnsType<
    DeployedDataProps | ClaimableDataProps | DeployedTokensList
  >;
  dataSource: DeployedDataProps[] | ClaimableDataProps[] | DeployedTokensList[];
  classname: string;
}
