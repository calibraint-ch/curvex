import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Spin } from "antd";
import { ethers } from "ethers";

import {
  getTokenName,
  parseDeployedTokenList,
} from "../../components/PriceCard/service";
import TableComponent from "../../components/Table/Table";
import {
  claimableColumns,
  deployedColumns,
} from "../../components/Table/constants";

import useErc20 from "../../customHooks/useErc20";
import useFactory from "../../customHooks/useFactory";

import {
  Banner,
  UsdBalance,
  WalletIconDashboard,
} from "../../../assets/images/imageAssets";

import {
  selectFactoryLoaded,
  selectFactoryLoading,
} from "../../slice/factory/factory.selector";
import {
  selectWallet,
  selectWalletConnected,
} from "../../slice/wallet.selector";
import { DeployedTokensList } from "./types";

import "./index.scss";

const UserDashBoard = () => {
  const [tokenDetails, setTokenDetails] = useState<DeployedTokensList[]>([]);

  const walletAddress = useSelector(selectWallet);
  const walletConnected = useSelector(selectWalletConnected);
  const factoryLoading = useSelector(selectFactoryLoading);
  const factoryLoaded = useSelector(selectFactoryLoaded);

  const { getContractInstance } = useErc20();
  const { deployedTokenList } = useFactory();

  const getPairs = useCallback(async () => {
    const contract = await getContractInstance(ethers.constants.AddressZero);
    if (contract) {
      const parsedData = deployedTokenList
        .filter((e) => e.owner.toLowerCase() === walletAddress?.toLowerCase())
        .map(parseDeployedTokenList);
      let filteredDetails: DeployedTokensList[] = [];
      if (parsedData.length) {
        const getErc20Name = getTokenName(contract);
        filteredDetails = await getErc20Name(parsedData);
      }
      setTokenDetails(filteredDetails);
    }
  }, [deployedTokenList, getContractInstance, walletAddress]);

  useEffect(() => {
    if (walletConnected && factoryLoaded) getPairs();
  }, [factoryLoaded, getPairs, walletConnected]);

  console.log("factoryLoading", factoryLoading);

  if (factoryLoading && walletConnected) {
    return (
      <div className="dashboard-loading">
        <Spin tip="Loading" size="large">
          <div className="content" />
        </Spin>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="banner-section">
        <img className="banner" src={Banner} alt="banner" />
        <div className="details">
          <div className="wallet">
            <img
              className="wallet-icon"
              src={WalletIconDashboard}
              alt="WalletIcon"
            />
            <div>
              <p className="address">WALLET ADDRESS</p>
              <p className="value">
                {walletAddress ? walletAddress : "No Wallet Address Available!"}
              </p>
            </div>
          </div>
          <hr className="line" />
          <div className="balance">
            <div className="section">
              <img className="wallet-icon" src={UsdBalance} alt="UsdBalance" />
              <div>
                <p className="address">PORTFOLIO VALUE</p>
                <p className="value">12.12</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="tables">
        <div className="row">
          <div className="col-8">
            <p className="title">Deployed Tokens</p>
            <TableComponent
              dataSource={tokenDetails}
              columns={deployedColumns}
              classname="deployed-token-table"
            />
          </div>
          <div className="col-4">
            <p className="title">Claimable Tokens</p>
            <TableComponent
              dataSource={[]}
              columns={claimableColumns}
              classname="claimable-token-table"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashBoard;
