import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button, Dropdown } from "antd";
import type { MenuProps } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { formatWalletAddress } from "../../../utils/methods";
import useMetamaskProvider from "../../customHooks/useMetamaskProvider";
import { WalletIcon, CurvXLogo, DisconnectIcon } from "../../../assets/images/imageAssets";
import { routes } from "../../../utils/routes";
import { useDispatch, useSelector } from "react-redux";
import { resetWallet } from "../../slice/wallet.slice";
import { selectNetwork, selectWallet } from "../../slice/wallet.selector";
import { chainList } from "../../../utils/constants";

import "./index.scss";

const Header = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  const { connectWallet, detectNetworkChange, connected } = useMetamaskProvider();
  const { dashboard, portfolio, homepage } = routes;
  const { mainnet, testnet } = chainList;

  const networkId = useSelector(selectNetwork);
  const address = useSelector(selectWallet);

  useEffect(() => {
    detectNetworkChange();
  }, [])

  const handleConnectWallet = async () => {
    connectWallet()
  }

  const handleDisconnect: MenuProps['onClick'] = (e) => {
    if (e.key) {
      dispatch(resetWallet());
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
        <Link style={{ textDecoration: "none" }} to={homepage}>
          <img className="logo" src={CurvXLogo} alt="CurveX_Logo" />
        </Link>
      </div>
      <div className="nav-items">
        {location.pathname === homepage ? (
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
            {networkId === mainnet && (
              <div className="network">
                <div className="dot mainnet"></div>
                <p className="name">Mainnet</p>
              </div>
            )}

            {networkId === testnet && (
              <div className="network">
                <span className="dot testnet"></span>
                <p className="name">Testnet</p>
              </div>
            )}
            {location.pathname === "/dashboard" ?
              <Link style={{ textDecoration: "none", color: '#ffffff' }} to={portfolio}>
                <div>Portfolio</div>
              </Link> :
              <Link style={{ textDecoration: "none", color: '#ffffff' }} to={dashboard}>
                <div>Dashboard</div>
              </Link>}
            {connected && address ? (
              <Dropdown menu={{ items, onClick: handleDisconnect }} placement="bottom">
                <Button className="connect-btn" onClick={handleConnectWallet}>
                  <img className="connect-icon" src={WalletIcon} alt="wallet-group" />
                  {formatWalletAddress(address)}
                  <DownOutlined />
                </Button>
              </Dropdown>
            ) : (
              <Button className="connect-btn" onClick={handleConnectWallet}>
                <img className="connect-icon" src={WalletIcon} alt="wallet-group" />
                Connect Wallet
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
