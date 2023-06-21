import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button, Dropdown } from "antd";
import type { MenuProps } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { formatWalletAddress } from "../../../utils/methods";
import useMetamaskProvider from "../../customHooks/useMetamaskProvider";
import { WalletIcon, CurvXLogo, DisconnectIcon } from "../../../assets/images/imageAssets";
import { routes } from "../../../utils/routes";

import "./index.scss";

const Header = () => {
  const [account, setAccount] = useState("");
  const location = useLocation();

  const { connectWallet, metaState, detectNetworkChange, connected } = useMetamaskProvider();
  const { dashboard, portfolio } = routes;

  useEffect(() => {
    setAccount(metaState.account[0]);
  }, [metaState.account]);

  useEffect(() => {
    detectNetworkChange();
  }, [])

  const handleConnectWallet = async () => {
    connectWallet()
    setAccount(metaState.account[0])
  }

  const handleDisconnect: MenuProps['onClick'] = (e) => {
    if (e.key) {
      setAccount("");
    }
  }

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        'Disconnect Wallet'
      ),
      icon: <img src={DisconnectIcon} alt="Disconnect-wallet" />,
    }
  ];

  return (
    <div className="header">
      <div>
        <Link style={{ textDecoration: "none" }} to={"/"}>
          <img className="logo" src={CurvXLogo} alt="CurveX_Logo" />
        </Link>
      </div>
      <div className="nav-items">
        {location.pathname === "/" ? (
          <>
            <div>Docs</div>
            <div>About</div>
            <div>
              <Link style={{ textDecoration: "none" }} to={dashboard}>
                <Button className="try-btn">Try the app</Button>
              </Link>
            </div>
          </>
        ) : (
          <div className="nav-items">
            {location.pathname === "/dashboard" ?
              <Link style={{ textDecoration: "none", color: '#ffffff' }} to={portfolio}>
                <div>Portfolio</div>
              </Link> :
              <Link style={{ textDecoration: "none", color: '#ffffff' }} to={dashboard}>
                <div>Dashboard</div>
              </Link>}
            {connected && account ? (
              <Dropdown menu={{ items, onClick: handleDisconnect }} placement="bottom">
                <Button className="connect-btn" onClick={handleConnectWallet}>
                  <img className="connect-icon" src={WalletIcon} alt="wallet-group" />
                  {formatWalletAddress(account)}
                  <DownOutlined />
                </Button>
              </Dropdown>
            ) : (
              <Button className="connect-btn" onClick={handleConnectWallet}>
                <img className="connect-icon" src={WalletIcon} alt="wallet-group" />
                {account
                  ? formatWalletAddress(account)
                  : "Connect Wallet"}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
