import { useState } from "react";
import { useDispatch } from "react-redux";
import { Form, Input, Button, Select } from "antd";
import Graph from "../Graphs/Graph";
import ImageUploader from "../ImageUploader";

import {
  LaunchFormData,
  LaunchPadInitialValues,
  curveOptions,
  vestingPeriodOptions,
} from "./constants";
import { CurveTypes } from "../Graphs/constants";
import useFactory from "../../customHooks/useFactory";
import { deployToken } from "./deploy.slice";

import "./index.scss";
import { pairTokenAddress } from "../../../utils/constants";

const LaunchPad = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const { deployBondingToken } = useFactory();

  const [curve, setCurve] = useState<string>("1");

  const handleChange = (value: string) => {
    setCurve(value);
  };

  const getVestingPeriod = (value: string) => {
    return Number(value) * 24 * 60 * 60;
  };

  const onFormSubmit = (values: any) => {
    const launchParams: LaunchFormData = {
      tokenName: values.tokenName,
      tokenSymbol: values.tokenSymbol,
      pairToken: pairTokenAddress,
      curveType: Number(values.curveType),
      logoImage: values.logoImage,
      curveParams: {
        totalSupply: Number(values.totalSupply),
        precision: Number(values.precision),
        lockPeriod: getVestingPeriod(values.vestingPeriod),
      },
    };

    dispatch(
      deployToken({ formData: launchParams, deployToken: deployBondingToken })
    );
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
          <Form
            form={form}
            initialValues={LaunchPadInitialValues}
            onFinish={onFormSubmit}
            layout="vertical"
          >
            <Form.Item label="Token Name" name="tokenName" required={true}>
              <Input
                className="input-box"
                name="tokenName"
                placeholder="Eg., NAV Coin"
              />
            </Form.Item>
            <p className="input-description">
              This name will also be used a a contract name
            </p>
            <Form.Item label="Token Symbol" name="tokenSymbol" required={true}>
              <Input
                className="input-box"
                name="tokenName"
                placeholder="Eg., NAV"
              />
            </Form.Item>
            <p className="input-description">
              Choose a symbol for your token ( usually 3-5 Characters )
            </p>
            <Form.Item name="logoImage">
              <ImageUploader formInstance={form} />
            </Form.Item>

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
            <div className="other-details-section">
              <p className="details-title">Other Details</p>
            </div>
            <div className="curve-section">
              <Form.Item name="curveType" required={true}>
                <Select
                  className="select-option"
                  defaultValue={LaunchPadInitialValues.curveType}
                  onChange={handleChange}
                  options={curveOptions}
                />
              </Form.Item>
              {curve === "1" && (
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
              )}
              {curve === "2" && (
                <div className="graph">
                  <Graph
                    type={CurveTypes.polynomial}
                    a={1}
                    n={2}
                    previewOnly={true}
                    cap={100}
                    increment={10}
                  />
                </div>
              )}
              {curve === "3" && (
                <div className="graph">
                  <Graph
                    type={CurveTypes.subLinear}
                    n={0.7}
                    previewOnly={true}
                    cap={100}
                    increment={10}
                  />
                </div>
              )}
              {curve === "4" && (
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
              )}
            </div>
            <div className="other-details-section">
              <p className="details-title">Other Details</p>
              <div className="form-fields">
                <Form.Item
                  label="Total Supply"
                  name="totalSupply"
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
                    className="select-period"
                    options={vestingPeriodOptions}
                  />
                </Form.Item>
              </div>
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
          </Form>
        </div>
      </div>
    </div>
  );
};

export default LaunchPad;
