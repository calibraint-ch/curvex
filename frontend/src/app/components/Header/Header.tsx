import "./index.scss";
import { Button } from "antd";
import { Link, useLocation } from "react-router-dom";
import { formatWalletAddress } from "../../../utils/methods";
import useMetamaskProvider from "../../customHooks/useMetamaskProvider";
import { CurveXLogo, WalletIcon } from "../../../assets/images/imageAssets";
import { useEffect, useState } from "react";

const Header = () => {
  const [account, setAccount] = useState("");
  const location = useLocation();

  const { metaState, connectWallet } = useMetamaskProvider();

  useEffect(() => {
    setAccount(metaState.account[0]);
  }, [metaState.account]);

  return (
    <div className="header">
      <div>
        <Link style={{ textDecoration: "none" }} to={"/"}>
          <img className="logo" src={CurveXLogo} alt="CurveX_Logo" />
        </Link>
      </div>
      <div className="nav-items">
        {location.pathname === "/" ? (
          <>
            <div>Docs</div>
            <div>About</div>
            <div>
              <Link style={{ textDecoration: "none" }} to={"/curve-x"}>
                <Button className="try-btn">Try the app</Button>
              </Link>
            </div>
          </>
        ) : (
          <div className="nav-items">
            <Link style={{ textDecoration: "none", color: '#ffffff' }} to={"/dashboard"}>
              <div>Dashboard</div>
            </Link>
            <Button className="connect-btn" onClick={connectWallet}>
              <img className="connect-icon" src={WalletIcon} alt="wallet-group" />
              {account
                ? formatWalletAddress(account)
                : "Connect Wallet"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
