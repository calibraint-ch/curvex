import DropDown from "../Dropdown";
import useMetamaskProvider from "../../customHooks/useMetamaskProvider";
import PriceInput from "../PriceInput";

import "./index.scss";

const PriceCard = () => {
  const { balance } = useMetamaskProvider();

  return (
    <div className="price-card-group">
      <div>
        <div className="price-card">
          <div className="d-flex justify-content-between">
            <DropDown />
            <p className="balance-text">
              BALANCE:{" "}
              <span style={{ color: "#3f57d0" }}>
                {balance ? Number(balance).toFixed(4) : "--"}
              </span>
            </p>
          </div>
          <PriceInput />
        </div>
      </div>
      <div className="price-card">
        <DropDown />
        <PriceInput />
      </div>
    </div>
  );
};

export default PriceCard;
