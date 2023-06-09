import type { ColumnsType } from 'antd/es/table';

export interface Key {
    key: React.Key;
}

export interface DeployedDataProps extends Key {
    token: string;
    totalSupply: number;
    curveType: string;
    vestingPeriod: string;
    base: string,
    balance: number
}

export interface ClaimableDataProps extends Key {
    tokenName: string;
    noOfTokens: number;
}

export interface TableComponentProps {
    columns: ColumnsType<DeployedDataProps | ClaimableDataProps>,
    dataSource: DeployedDataProps[] | ClaimableDataProps[]
}
