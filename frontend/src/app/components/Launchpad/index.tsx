import { useState } from "react";
import { Form, Input, DatePicker, Button, Select } from "antd";
import Graph from "../Graphs/Graph";
import { CurveTypes } from "../Graphs/constants";
import ImageUploader from "../ImageUploader";

import "./index.scss";

const LaunchPad = () => {
  const [curve, setCurve] = useState("linear");

  const handleChange = (value: string) => {
    setCurve(value);
  };

  const curveOptions = [
    { value: 'linear', label: 'Linear' },
    { value: 'polynomial', label: 'Polynomial' },
    { value: 'subLinear', label: 'Sub-Linear' },
    { value: 'sCurve', label: 'S-curve' },
  ]

  return (
    <div className="launchpad-section">
      <div className="launchpad-box">
        <div className="description-box mint-tokens">
          <p className="description-title">Mint Tokens</p>
          <p className="description-content">
            Minting enables the creation of new tokens to meet demand or fulfil specific requirements. It allows for the expansion of token supply as needed, ensuring liquidity and availability in the market.
          </p>
        </div>
        <div className="launchpad-contents">
          <div className="details-title">Token Details</div>
          <Form layout="vertical">
            <Form.Item label="Token Name" name={"token-name"} required={true}>
              <Input className="input-box" placeholder="Eg., NAV Coin" />
              <p className="input-description">
                This name will also be used a a contract name
              </p>
            </Form.Item>
            <Form.Item label="Token Symbol" name="token-symbol" required={true}>
              <Input className="input-box" placeholder="Eg., NAV" />
              <p className="input-description">
                Choose a symbol for your token ( usually 3-5 Characters )
              </p>
            </Form.Item>
            <Form.Item name="image">
              <ImageUploader />
            </Form.Item>
          </Form>
          <div className="description-box">
            <p className="description-title">Bonding Curves</p>
            <p className="description-content">
              A bonding curve is a mathematical model that governs the relationship between the price and supply of a token in a decentralized system
            </p>
            <p className="description-title">Token Features</p>
            <p className="description-content">
              In a bonding curve, as the token supply of token increases, the price typically rises, and as the token supply decreases, the price decreases.
            </p>
          </div>
          <div className="curve-section">
            <Select
              defaultValue="Linear"
              className="select-option"
              onChange={handleChange}
              options={curveOptions}
            />
            {curve === CurveTypes.linear &&
              <div className="graph">
                <Graph
                  previewOnly={true}
                  cap={100}
                  increment={10}
                  type={CurveTypes.linear}
                  slope={15}
                  intercept={15}
                />
              </div>
            }
            {curve === CurveTypes.polynomial &&
              <div className="graph">
                <Graph
                  type={CurveTypes.polynomial}
                  a={1}
                  n={2}
                  previewOnly={true}
                  cap={100}
                  increment={10}
                />
              </div>}
            {curve === CurveTypes.subLinear &&
              <div className="graph">
                <Graph
                  type={CurveTypes.subLinear}
                  n={0.7}
                  previewOnly={true}
                  cap={100}
                  increment={10}
                />
              </div>}
            {curve === CurveTypes.sCurve &&
              <div className="graph">
                <Graph
                  type={CurveTypes.sCurve}
                  c1={0.2}
                  c2={10}
                  previewOnly={true}
                  cap={100}
                  increment={10}
                />
              </div>
            }
          </div>
          <div className="other-details-section">
            <p className="details-title">Other Details</p>
            <Form layout="vertical">
              <div className="form-fields">
                <Form.Item label="Total Supply" name={"totalsupply"} required={true}>
                  <Input className="input-box" type="number" placeholder="Total Supply" />
                </Form.Item>
                <Form.Item label="Slope" name={"slope"}>
                  <Input className="input-box" type="number" placeholder="Slope" />
                </Form.Item>
              </div>
              <div className="form-fields">
                <Form.Item label="Extra" name={"extra"}>
                  <Input className="input-box" type="number" placeholder="Extra" />
                </Form.Item>
                <Form.Item label="Vesting Period" name={"vesting-period"}>
                  <DatePicker className="input-box" placeholder="Select Date" />
                </Form.Item>
              </div>
            </Form>
            <p className="price-estimation price-text">Price Estimation :  9.12 ETH <span style={{ fontSize: 10, color: "GrayText" }}>(1810.23 USD)</span></p>
            <div className="d-flex justify-content-center">
              <Button className="mint-button">Mint Token</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaunchPad;
