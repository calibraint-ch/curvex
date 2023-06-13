import { Form, Input } from "antd";
import "./index.scss";
import ImageUploader from "../ImageUploader";

const LaunchPad = () => {
  return (
    <div className="launchpad-section">
      <div className="launchpad-box">
        <div className="description-box">
          <p className="description-title">Mint Tokens</p>
          <p className="description-content">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pelleqtes
            at mets Duis alos.
          </p>
        </div>
        <div className="launchpad-contents">
          <div className="token-details-title">Token Details</div>
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
        </div>
      </div>
    </div>
  );
};

export default LaunchPad;
