import { InputNumber } from "antd";
import "./index.scss";

const PriceInput = () => {
  return (
    <InputNumber
      className="price-input"
      controls={false}
      defaultValue={0.}
      type="number"
    />
  );
};

export default PriceInput;
