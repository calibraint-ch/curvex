import { Select } from "antd";
import "./index.scss";
import { EthereumLogo, FTMLogo } from "../../../assets/images/imageAssets";

const DropDown = () => {
  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
  };

  const tokenLists = [
    {
      value: "eth",
      label: "ETH",
      icon: EthereumLogo,
    },
    {
      value: "ftm",
      label: "FTM",
      icon: FTMLogo,
    },
  ];

  const Option = Select.Option;

  const CustomOption = ({ label, icon }: { label: string; icon: string }) => (
    <div>
      <img src={icon} alt={label} className="option-icon" />
      {label}
    </div>
  );

  return (
    <div className="dropdown">
      <Select
        defaultValue={tokenLists[0].value}
        className="select-input"
        onChange={handleChange}
      >
        {tokenLists.map((token) => (
          <Option key={token.value} value={token.value}>
            <CustomOption label={token.label} icon={token.icon} />
          </Option>
        ))}
      </Select>
    </div>
  );
};

export default DropDown;
