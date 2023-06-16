import { useState } from "react";
import { Button } from "antd";
import ChipCard from "../ChipCards";
import Graph from "../Graphs/Graph";
import { CurveTypes } from "../Graphs/constants";
import PriceCard from "../PriceCard";
import "./index.scss";

const BuyTab = () => {
  const [slippageValue, setSlippageValue] = useState<string | number>('0.31%');

  const handleSlippageChange = (value: string | number) => {
    const formattedValue = typeof value === 'number' ? `${value}%` : value;
    setSlippageValue(formattedValue);
  };

  return (
    <div className="main">
      <div className="buy d-flex justify-content-center">
        <div className="buy-column-1">
          <PriceCard />
        </div>
        <div className="buy-column-2">
          {" "}
          <div className="d-flex justify-content-center align-items-center h-100 w-100 m-0">
            <Graph
              cap={100}
              increment={10}
              type={CurveTypes.linear}
              slope={15}
              intercept={15}
              previewOnly={false}
            />
          </div>
        </div>
      </div>
      <div className="price-chips d-flex justify-content-center">
        <ChipCard title="MINIMUM TOKENS" value="50" />
        <ChipCard title="SLIPPAGE" value={slippageValue} />
        <ChipCard title="SLIPPAGE TOLERANCE" value="0.312" handleSlippageChange={handleSlippageChange} />
      </div>
      <div className="d-flex justify-content-center">
        <Button className="buy-button"> Buy Now </Button>
      </div>
    </div>
  );
};

export default BuyTab;
