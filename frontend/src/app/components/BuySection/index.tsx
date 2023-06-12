import { Button } from "antd";
import ChipCard from "../ChipCards";
import Graph from "../Graphs/Graph";
import { CurveTypes } from "../Graphs/constants";
import PriceCard from "../PriceCard";

import "./index.scss";

const BuyTab = () => {
  return (
    <div className="main">
      <div className="buy d-flex justify-content-center">
        <div className="buy-column-1">
          <PriceCard />
        </div>
        <div className="buy-column-2">
          {" "}
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
      <div className="price-chips d-flex justify-content-center">
        <ChipCard title="MINUMUM TOKENS" value="50" />
        <ChipCard title="SLIPPAGE" value="0.3 %" />
        <ChipCard title="SLIPPAGE TOLERANCE" value="0.312" />
      </div>
      <div className="d-flex justify-content-center">
        <Button className="buy-button"> Buy Now </Button>
      </div>
    </div>
  );
};

export default BuyTab;
