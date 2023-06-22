import { useState } from "react";
import { Button } from "antd";
import ChipCard from "../ChipCards";
import PriceCard from "../PriceCard";
import Charts from "../Charts/Charts";
import { sections } from "../../../utils/constants";

import "./index.scss";

type props = {
  tab: string;
};

const BuyWithdraw = (props: props) => {
  const [slippageValue, setSlippageValue] = useState<string | number>('0%');

  const handleSlippageChange = (value: string | number) => {
    const formattedValue = typeof value === 'number' ? `${value}%` : value;
    setSlippageValue(formattedValue);
  };

  return (
    <div className="main">
      <div className="buy d-flex justify-content-center">
        <div className="buy-column-1">
          <PriceCard section={props.tab} />
        </div>
        <div className="buy-column-2">
          {" "}
          <div className="d-flex justify-content-center align-items-center w-100 h-100 m-0">
            <Charts />
          </div>
        </div>
      </div>
      <div className="price-chips d-flex justify-content-center">
        <ChipCard title="MINIMUM TOKENS" value="50" />
        <ChipCard title="SLIPPAGE" value={slippageValue} />
        <ChipCard title="SLIPPAGE TOLERANCE" value="0.312" handleSlippageChange={handleSlippageChange} />
      </div>
      {props.tab === sections.buy ? <div className="d-flex justify-content-center">
        <Button className="buy-button"> Buy Now </Button>
      </div> : <div className="d-flex justify-content-center">
        <Button className="buy-button"> Withdraw Now </Button>
      </div>}
    </div>
  );
};

export default BuyWithdraw;
