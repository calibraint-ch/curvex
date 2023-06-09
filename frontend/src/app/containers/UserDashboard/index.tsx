import TableComponent from "../../components/Table/Table";
import { WalletIconDashboard, UsdBalance, EthBalance, Banner } from '../../../assets/images/imageAssets';
import { deployedDataSource, deployedColumns, claimableColumns, claimableDataSource } from '../../components/Table/constants';
import useMetamaskProvider from "../../customHooks/useMetamaskProvider";
import "./index.scss";

const UserDashBoard = () => {
    const { metaState, balance } = useMetamaskProvider();

    return (
        <div className="dashboard">
            <div className="banner-section">
                <img className="banner" src={Banner} alt="banner" />
                <div className="details">
                    <div className="wallet">
                        <img className="wallet-icon" src={WalletIconDashboard} alt="WalletIcon" />
                        <div>
                            <p className="address">WALLET ADDRESS</p>
                            <p className="value">{metaState.account[0] ? metaState.account[0] : "No Wallet Address Available!"}</p>
                        </div>
                    </div>
                    <hr className="line"/>
                    <div className="balance">
                        <div className="section">
                            <img className="wallet-icon" src={EthBalance} alt="EthBalance" />
                            <div>
                                <p className="address">TOTAL BALANCE</p>
                                <p className="value">{balance ? parseFloat(balance).toFixed(3) : 'No Balance Available!'}</p>
                            </div>
                        </div>
                        <div className="section">
                            <img className="wallet-icon" src={UsdBalance} alt="UsdBalance" />
                            <div>
                                <p className="address">USD TOTAL</p>
                                <p className="value">12.12</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="tables">
                <div className="table1">
                    <p className="title">Deployed Tokens</p>
                    <TableComponent dataSource={deployedDataSource} columns={deployedColumns} />
                </div>
                <div className="table2">
                    <p className="title">Claimable Tokens</p>
                    <TableComponent dataSource={claimableDataSource} columns={claimableColumns} />
                </div>
            </div>
        </div>
    )
}

export default UserDashBoard;