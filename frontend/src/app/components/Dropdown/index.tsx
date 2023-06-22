import { Select } from "antd";
import { currencyList, tokenList, dropDownTypes } from "./constants"

import "./index.scss";

type DropdownProps = {
  name: string;
};

const DropDown = (props: DropdownProps) => {
  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
  };

  const Option = Select.Option;

  const CustomOption = ({ label, icon }: { label: string; icon: string }) => (
    <div>
      <img src={icon} alt={label} className="option-icon" />
      {label}
    </div>
  );

  const displayList = props.name === dropDownTypes.currency ? currencyList : tokenList

  return (
    <div className="dropdown">
      <Select
        defaultValue={displayList[0].value}
        className="select-input"
        onChange={handleChange}
      >
        {displayList.map((token) => (
          <Option key={token.value} value={token.value}>
            <CustomOption label={token.label} icon={token.icon} />
          </Option>
        ))}
      </Select>
    </div>
  );
};

export default DropDown;
