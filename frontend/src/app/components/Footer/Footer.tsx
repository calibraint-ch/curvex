import "./index.scss";
import { Logo } from "../../../assets/imageAssets";
import { TwitterOutlined, GithubOutlined, FacebookOutlined, LinkedinOutlined } from "@ant-design/icons"

const Footer = () => {
    return (
        <div className="footer mt-4">
            <div className="foo-sec1">
                <img className="app-logo"
                    src={Logo}
                    alt="CurveX_Logo"
                />
                <div className="foo-content">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque at massa velit. Morbi iaculis blandit purus.</div>
                <div className="flex-and-between">
                    <GithubOutlined />
                    <TwitterOutlined />
                    <FacebookOutlined />
                    <LinkedinOutlined />
                </div>
                <div className="copy-right">Copyright © 2023 <span style={{color: '#B5964D'}}>CurveX</span></div>
            </div>
            <div className="d-flex foo-sec2">
                <ul>
                    <li className="title">Resources</li>
                    <li>Blogs</li>
                    <li>Creators Community</li>
                    <li>Help & FAQ</li>
                    <li>App Dictionary</li>
                </ul>
                <ul>
                    <li className="title">Company</li>
                    <li>About Us</li>
                    <li>Careers</li>
                    <li>Terms Of Use</li>
                    <li>Privacy Policy</li>
                </ul>
            </div>
        </div>
    );
};

export default Footer;
