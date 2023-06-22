import { useDispatch } from "react-redux";
import { Form, Input, Button, Select } from "antd";
import Charts from "../Charts/Charts";
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
import { useEffect, useState } from "react";

const LaunchPad = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const { deployBondingToken } = useFactory();

  const getVestingPeriod = (value: string) => {
    return Number(value) * 24 * 60 * 60;
  };

  const onFormSubmit = (values: any) => {
    console.log("Values", values);

    const launchParams: LaunchFormData = {
      tokenName: values.tokenName,
      tokenSymbol: values.tokenSymbol,
      tokenManager: "",
      curveType: values.curveType,
      logoImage: values.logoImage,
      curveParams: {
        totalSupply: values.totalSupply,
        precision: values.precision,
        lockPeriod: getVestingPeriod(values.vestingPeriod),
      },
    };

    console.log("Values", launchParams);

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
            <div className="curve-section">
              <Form.Item name="curveType" required={true}>
                <Select
                  className="select-option"
                  // onChange={setCurveOption}
                  defaultValue={LaunchPadInitialValues.curveType}
                  options={curveOptions}
                />
              </Form.Item>
              <Charts />
            </div>
            <div className="other-details-section">
              <p className="details-title">Other Details</p>

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
                    className="select-period"
                    // onChange={setVestingPeriod}
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
