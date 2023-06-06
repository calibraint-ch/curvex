import "./index.scss";
import { Button } from "antd";
import { ConnectorDiv, HeroImage } from "../../../assets/images/imageAssets";
import { Link } from "react-router-dom";
import { Hand } from "../../../assets/images/imageAssets";
import Graph from "../../components/Graphs/Graph";
import { CurveTypes } from "../../components/Graphs/Graph";

const HomePage = () => {
  return (
    <div>
      <section id="hero" className="hero-section">
        <div className="hero-grid-sections d-flex">
          <div className="hero-section-left">
            <p className="hero-heading">
              Dive into the Future Of <br />
              DeFi with{" "}
              <span style={{ color: "yellow", fontFamily: "ClashDisplay" }}>
                Bonding Curves
              </span>
            </p>
            <p className="hero-sub-heading">
              Discover the redefined possibility of token issuance on Fantom
            </p>
            <p className="hero-description">
              Introducing the Game-Changing Dapp that Redefines Flexibility,
              Empowers Dynamic Features, and Streamlines Effortless Token
              Management, all in One Place!
            </p>
            <Link style={{ textDecoration: "none" }} to={"/curve-x"}>
              <Button className="launch-app-btn">Launch App</Button>
            </Link>
          </div>

          <div className="hero-section-right">
            <img className="hero-image" src={HeroImage} alt="hero" />
          </div>
        </div>
      </section>
      <section id="link-section">
        {/* <div className="link-strip-1">
          <div className="diagonal-strip"></div>
        </div>
        <div className="link-strip-2"></div> */}
        <img
          className="connector-div"
          src={ConnectorDiv}
          alt="connecting-div"
        />
      </section>
      <section id="section-3">
        <div className="graph-section d-flex">
          <div className="sticky-column">
            <div className="sticky-contents">
              <p className="sticky-heading">
                Unleash the Power of Curves: Discover the Range of Options at
                Your Fingertips!
              </p>
              <p className="sticky-description">
                Find the Perfect Curve, Fit for Your Token Economics and Project
                Goals
              </p>
            </div>
            <img className="hand-illustration" src={Hand} alt="hand" />
          </div>
          <div className=" graph-column">
            <p className="graph-heading">Linear Curve</p>
            <p className="graph-description">
              The token price increases or decreases in a linear fashion as the
              token supply grows or shrinks. No surprises, just a reliable and
              predictable pricing mechanism that keeps your project on a steady
              path.
            </p>
            <div className="graph">
              <Graph
                cap={100}
                increment={10}
                type={CurveTypes.linear}
                slope={15}
                intercept={15}
              />
            </div>
            <p className="graph-heading">Polynomial Curve</p>
            <p className="graph-description">
              With its flexible formula and elegant curve, the token price
              dances to the tune of exponential growth or controlled decline.
            </p>
            <div className="graph">
              <Graph
                cap={100}
                increment={10}
                type={CurveTypes.linear}
                slope={15}
                intercept={15}
              />
            </div>
            <p className="graph-heading">Sub-Linear Curve</p>
            <p className="graph-description">
              Harness the power of logarithmic growth, where the token price
              increases at a decreasing rate as the token supply grows. This
              unique formula ensures a balanced and gradual rise{" "}
            </p>
            <div className="graph">
              <Graph
                cap={100}
                increment={10}
                type={CurveTypes.linear}
                slope={15}
                intercept={15}
              />
            </div>
            <p className="graph-heading">S-Curve</p>
            <p className="graph-description">
              Experience the exhilaration of an S-Curve, where the token price
              starts slowly, gathers momentum, and reaches a state of
              equilibrium
            </p>
            <div className="graph">
              <Graph
                cap={100}
                increment={10}
                type={CurveTypes.linear}
                slope={15}
                intercept={15}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
