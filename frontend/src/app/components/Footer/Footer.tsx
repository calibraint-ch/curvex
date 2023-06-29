import {
  FooterLogo,
  Twitter,
  Facebook,
  LinkedIn,
} from "../../../assets/images/imageAssets";

import "./index.scss";

const Footer = () => {
  return (
    <div className="footer">
      <div className="container1">
        <div className="foo-sec1">
          <img className="footer-logo" src={FooterLogo} alt="CurveX_Logo" />
          <div className="foo-content">
            Join us in shaping the future of token economics and unlock
            boundless possibilities with our cutting-edge bonding curve
            technology.
          </div>
          <div className="social-icons">
            <img src={Twitter} alt="TwitterLogo" />
            <img src={Facebook} alt="FacebookLogo" />
            <img src={LinkedIn} alt="LinkedInLogo" />
          </div>
          <div className="copy-right">
            Copyright © 2023 <span style={{ color: "#000000" }}>CurvX</span>
          </div>
        </div>
        <div className="d-flex foo-sec2">
          <ul>
            <li className="title">Company</li>
            <li>About Us</li>
            <li>Terms Of Use</li>
            <li>Privacy Policy</li>
            <li>
              <a
                rel="noreferrer"
                href="https://forms.gle/x1epaYFko3PG7eiTA"
                target="_blank"
              >
                Contact us
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Footer;
