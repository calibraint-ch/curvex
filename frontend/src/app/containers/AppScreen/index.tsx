import { useState } from "react";
import Tab from "../../components/Tab/Tab";
import "./index.scss";
import { tabOptions } from "../../components/Tab/constants";
import BuyTab from "../../components/BuySection";

const AppScreen = () => {
  const [selectedTab, setSelectedTab] = useState(tabOptions[0].key);

  const onTabChange = (e: string) => {
    setSelectedTab(e);
  };

  return (
    <div className="main-container">
      <div className="tab">
        <Tab {...{ onTabChange }} />
      </div>
      {selectedTab === tabOptions[0].key && <BuyTab />}
    </div>
  );
};

export default AppScreen;
