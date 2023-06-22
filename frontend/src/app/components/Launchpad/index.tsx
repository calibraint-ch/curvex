import { useDispatch } from "react-redux";
import { Form, Input, DatePicker, Button, Select } from "antd";
import Charts from "../Charts/Charts";
import ImageUploader from "../ImageUploader";

import { curveOptions, vestingPeriodOptions } from "./constants";
import { CurveTypes } from "../Graphs/constants";
import useFactory from "../../customHooks/useFactory";

import "./index.scss";
import { useState } from "react";

const LaunchPad = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const { deployToken } = useFactory();

  const [lockPeriod, setLockPeriod] = useState<number>(0);

  //TODO: Conditionally render the respective chart
  const setCurveOption = (value: string) => {
    switch (value) {
      case CurveTypes.linear:
        form.setFieldValue("curveType", 1);
        break;
      case CurveTypes.polynomial:
        form.setFieldValue("curveType", 2);
        break;
      case CurveTypes.subLinear:
        form.setFieldValue("curveType", 3);
        break;
      default:
        form.setFieldValue("curveType", 1);
    }
  };

  const setVestingPeriod = (value: string) => {
    switch (value) {
      case "15":
        //TODO: Set epoch to 15 days from now
        setLockPeriod(15);
        break;
      case "30":
        //TODO: Set epoch to 30 days from now
        setLockPeriod(30);
        break;
      case "45":
        //TODO: Set epoch to 45 days from now
        setLockPeriod(45);
        break;
      case "60":
        //TODO: Set epoch to 60 days from now
        setLockPeriod(60);
        break;
      default:
        setLockPeriod(30);
    }
  };

  const onFormSubmit = (values: any) => {
    console.log(values);
  };

  return (
    <div className="launchpad-section">
      <div className="launchpad-box">
        <div className="description-box mint-tokens">
          <p className="description-title">Mint Tokens</p>
          <p className="description-content">
            Minting enables the creation of new tokens to meet demand or fulfil
            specific requirements. It allows for the expansion of token supply
            as needed, ensuring liquidity and availability in the market.
          </p>
        </div>
        <div className="launchpad-contents">
          <div className="details-title">Token Details</div>
          <Form onFinish={onFormSubmit} layout="vertical">
            <Form.Item label="Token Name" name="tokenName" required={true}>
              <Input className="input-box" placeholder="Eg., NAV Coin" />
              <p className="input-description">
                This name will also be used a a contract name
              </p>
            </Form.Item>
            <Form.Item label="Token Symbol" name="tokenSymbol" required={true}>
              <Input className="input-box" placeholder="Eg., NAV" />
              <p className="input-description">
                Choose a symbol for your token ( usually 3-5 Characters )
              </p>
            </Form.Item>
            <Form.Item name="logoImage">
              <ImageUploader />
            </Form.Item>
          </Form>
          <div className="description-box">
            <p className="description-title">Bonding Curves</p>
            <p className="description-content">
              A bonding curve is a mathematical model that governs the
              relationship between the price and supply of a token in a
              decentralized system
            </p>
            <p className="description-title">Token Features</p>
            <p className="description-content">
              In a bonding curve, as the token supply of token increases, the
              price typically rises, and as the token supply decreases, the
              price decreases.
            </p>
          </div>
          <div className="curve-section">
            <Form.Item name="curveType" required={true}>
              <Select
                defaultValue="Linear"
                className="select-option"
                onChange={setCurveOption}
                options={curveOptions}
              />
            </Form.Item>
            <Charts />
          </div>
          <div className="other-details-section">
            <p className="details-title">Other Details</p>
            <Form layout="vertical">
              <div className="form-fields">
                <Form.Item
                  label="Total Supply"
                  name="totalsupply"
                  required={true}
                >
                  <Input
                    className="input-box"
                    type="number"
                    placeholder="Total Supply"
                  />
                </Form.Item>
                <Form.Item label="Precision" name="precision">
                  <Input
                    className="input-box"
                    type="number"
                    placeholder="Precision"
                  />
                </Form.Item>
              </div>
              <div className="form-fields">
                <Form.Item label="Vesting Period" name="vestingPeriod">
                  <Select
                    defaultValue="Linear"
                    className="select-option"
                    onChange={setVestingPeriod}
                    options={vestingPeriodOptions}
                  />
                </Form.Item>
              </div>
            </Form>
            <p className="price-estimation price-text">
              Price Estimation : 9.12 ETH{" "}
              <span style={{ fontSize: 10, color: "GrayText" }}>
                (1810.23 USD)
              </span>
            </p>
            <div className="d-flex justify-content-center">
              <Button htmlType="submit" className="mint-button">
                Mint Token
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaunchPad;
