import "./index.scss";
import { Logo } from "../../../assets/imageAssets";
import Icons from "../../../assets/Icons.png";
import { Link, useLocation } from "react-router-dom";
import Group from "../../../assets/Group.png";

const Header = () => {
  const location = useLocation();
  const walletAddress = "";

  return (
    <div className="header">
      <div className="d-flex align-items-center justify-content-between">
        <img className="logo"
          src={Logo}
          alt="CurveX_Logo"
        />
      </div>
      <div className="nav-items">
        {
          location.pathname === "/" ?
            <>
              <div>Docs</div>
              <div>About</div>
              <div>
                <Link style={{ textDecoration: 'none' }} to={'/curve-x'}>
                  <button className="try-btn d-flex">Try the app
                    <img className="icon"
                      src={Icons}
                      alt="wallet-icon"
                    />
                  </button>
                </Link>
              </div>
            </>
            :
            <button className="connect-btn">
              <img className="connect-icon"
                src={Group}
                alt="wallet-group"
              />{walletAddress ? walletAddress : 'Connect Wallet'}
            </button>
        }
      </div>
    </div>
  );
};

export default Header;
