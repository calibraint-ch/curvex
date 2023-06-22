import DropDown from "../Dropdown";
import { useSelector } from "react-redux"
import { selectWallet } from "../../slice/wallet.selector";
import useMetamaskProvider from "../../customHooks/useMetamaskProvider";
import PriceInput from "../PriceInput";
import { dropDownTypes } from "../Dropdown/constants";
import { sections } from "../../../utils/constants"

import "./index.scss";

type SectionProps = {
  section: string
}

const PriceCard = (props: SectionProps) => {
  const { balance } = useMetamaskProvider();
  const walletAddress = useSelector(selectWallet);

  const { currency, token } = dropDownTypes;
  const { section } = props;
  const { buy } = sections;

  return (
    <div className="price-card-group">
      <div>
        <div className="price-card">
          <div className="d-flex justify-content-between">
            <DropDown name={section === buy ? currency : token} />
            <p className="balance-text">
              BALANCE:{" "}
              <span style={{ color: "#3f57d0" }}>
                {walletAddress ? (balance ? Number(balance).toFixed(4) : "--") : "--"}
              </span>
            </p>
          </div>
          <PriceInput />
        </div>
      </div>
      <div className="price-card">
        <DropDown name={section === buy ? token : currency} />
        <PriceInput />
      </div>
    </div>
  );
};

export default PriceCard;
