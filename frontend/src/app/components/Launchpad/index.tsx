import { Form, Input, DatePicker, Button, Select } from "antd";
import Charts from "../Charts/Charts";
import ImageUploader from "../ImageUploader";

import "./index.scss";

const LaunchPad = () => {

  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
  };

  const curveOptions = [
    { value: 'linear', label: 'Linear' },
    { value: 'polynomial', label: 'Polynomial' },
    { value: 'sub-linear', label: 'Sub-Linear' },
    { value: 's-curve', label: 'S-curve' },
  ]

  return (
    <div className="launchpad-section">
      <div className="launchpad-box">
        <div className="description-box mint-tokens">
          <p className="description-title">Mint Tokens</p>
          <p className="description-content">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pelleqtes
            at mets Duis alos.
          </p>
        </div>
        <div className="launchpad-contents">
          <div className="details-title">Token Details</div>
          <Form>
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
            <p className="description-title">Token Features</p>
            <p className="description-content">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pelleqtes
              at mets Duis alos.
            </p>
            <p className="description-title">Bonding Curves</p>
            <p className="description-content">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pelleqtes
              at mets Duis alos.
            </p>
          </div>
          <div className="curve-section">
            <Select
              defaultValue="Linear"
              className="select-option"
              onChange={handleChange}
              options={curveOptions}
            />
            <Charts />
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