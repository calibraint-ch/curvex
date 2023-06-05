import "./index.scss";
import { Feature1, Feature2, Feature3, Feature4, Greek } from "../../../assets/images/imageAssets"

const HomePage = () => {
  return (
    <div>
      <section id="hero" className="hero-section">
        <div className="hero-grid-sections d-flex">
          <div className="hero-section-left">
            <p className="hero-heading">
              Dive into the Future Of <br />
              DeFi with <span style={{ color: "yellow" }}>Bonding Curves</span>
            </p>
          </div>
          <div className="hero-section-right">
            <p className="hero-heading">section 2</p>
          </div>
        </div>
      </section>
      <section className="why-section">
        <p className="title-2">Why <span className="curve">CurveX?</span></p>
        <div className="row-1">
          <div className="feature">
            <img src={Feature1} alt="settings"></img>
            <p className="feature-title">Customizable Token Economics</p>
            <p className="sub-content">CurveX offers flexibility in designing token economics. Users can customize the parameters of the bonding curve, such as the initial price, slope, and reserve ratio, to align with their desired token issuance dynamics.</p>
          </div>
          <div className="feature">
            <img src={Feature2} alt="puzzle"></img>
            <p className="feature-title">Support for different types of bonding curves</p>
            <p className="sub-content">We are offering a variety of bonding curve types. Token issuers can choose the curve type that best suits their desired tokenomics and project requirements. As a result, token issuers can alter the dynamics of token issuance to suit their unique objectives.</p>
          </div>
        </div>
        <div className="row-2">
          <div className="feature">
            <img src={Feature3} alt="token"></img>
            <p className="feature-title">Token-Vesting</p>
            <p className="sub-content">During the lock-up period, users can unlock the potential perks associated with token appreciation. Those who have locked up their tokens can take advantage of the opportunity to sell at an increased rate once the lock-up duration has passed, encouraging them to potentially earn profit as the token value rises</p>
          </div>
          <div className="feature-last">
            <img src={Feature4} alt="price"></img>
            <p className="feature-title">Efficient Price Discovery</p>
            <p className="sub-content">The price of the token is determined by the bonding curve algorithm based on the ratio of tokens in circulation. This allows traders to accurately assess the token's current value, enhancing transparency and enabling more informed trading decisions.</p>
          </div>
        </div>
      </section>
      <section className="fantom-section">
        <div className="fantom-section-left">
          <p className="title">Potential Scalability of  Fantom</p>
          <p className="sub-content">We consider Fantom to be an excellent choice in our quest to develop an effective bonding curve-based token granting system. Its remarkable scalability empowers us with the ability to handle growing demands. We appreciate Fantom's minimal transaction fees, extensive ecosystem support, smooth interoperability, top-notch security, and thriving community</p>
        </div>
        <div className="fantom-section-right">
          <img src={Greek} className="greek" alt="gods-greek"></img>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
