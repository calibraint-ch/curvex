import "./index.scss";
import { Button } from "antd";
import { Link, useLocation } from "react-router-dom";
import { formatWalletAddress } from "../../../utils/methods";
import useMetamaskProvider from "../../customHooks/useMetamaskProvider";
import { CurveXLogo, WalletIcon } from "../../../assets/images/imageAssets";

const Header = () => {
  const location = useLocation();

  const { metaState, connectWallet } = useMetamaskProvider();

  return (
    <div className="header">
      <div className="d-flex align-items-center justify-content-between">
        <img className="logo" src={CurveXLogo} alt="CurveX_Logo" />
      </div>
      <div className="nav-items">
        {location.pathname === "/" ? (
          <>
            <div>Docs</div>
            <div>About</div>
            <div>
              <Link style={{ textDecoration: "none" }} to={"/curve-x"}>
                <Button className="d-flex" type="primary">
                  Try the app
                </Button>
              </Link>
            </div>
          </>
        ) : (
          <Button className="connect-btn" onClick={connectWallet}>
            <img className="connect-icon" src={WalletIcon} alt="wallet-group" />
            {metaState.account
              ? formatWalletAddress(metaState.account.toString())
              : "Connect Wallet"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default Header;
