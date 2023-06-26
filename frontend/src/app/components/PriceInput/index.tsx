import { InputNumber } from "antd";
import { memo } from "react";

import "./index.scss";

type PriceInputProps = {
  disabled?: boolean;
};

const PriceInput = (props: PriceInputProps) => {
  return (
    <InputNumber
      className="price-input"
      controls={false}
      defaultValue={0}
      type="number"
      {...props}
    />
  );
};

export default memo(PriceInput);
