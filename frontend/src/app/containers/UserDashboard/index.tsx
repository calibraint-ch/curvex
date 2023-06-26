import { useSelector } from "react-redux";
import { selectWallet } from "../../slice/wallet.selector";
import TableComponent from "../../components/Table/Table";
import {
  WalletIconDashboard,
  UsdBalance,
  Banner,
} from "../../../assets/images/imageAssets";
import {
  deployedColumns,
  claimableColumns,
  claimableDataSource,
} from "../../components/Table/constants";

import "./index.scss";
import { useEffect, useState } from "react";
import useFactory from "../../customHooks/useFactory";
import { CurveTypes } from "../../components/Graphs/constants";

const UserDashBoard = () => {
  const walletAddress = useSelector(selectWallet);
  const [tokenDetails, setTokenDetails] = useState([]);

  const { getTokenPairList } = useFactory();

  const getCurveType = (type: number): CurveTypes | string => {
    switch (type) {
      case 1:
        return CurveTypes.linear;
      case 2:
        return CurveTypes.polynomial;
      default:
        return "--";
    }
  };

  const getPairs = async () => {
    const currentDate = new Date();
    const tokenPairs = await getTokenPairList();
    const filteredDetails = tokenPairs
      .filter((e: any) => e.owner.toLowerCase() === walletAddress.toLowerCase())
      .map((e: any, index: number) => ({
        key: index + 1,
        // TODO: Replace with actual name
        token: "CurvX Token(CRRXV)",
        totalSupply: (Number(e.cap._hex) / 10 ** 18).toLocaleString(),
        curveType: getCurveType(e.curveType),
        //TODO: Check time
        vestingPeriod:
          Math.ceil(
            Math.abs(
              new Date(Number(e.lockPeriod._hex)).getTime() -
                currentDate.getTime()
            ) /
              (1000 * 3600 * 24)
          ) + " days",
      }));
    setTokenDetails(filteredDetails);
  };

  useEffect(() => {
    getPairs();
  }, [walletAddress]);

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
