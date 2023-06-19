import "./index.scss";
import { useState } from "react";
import Tab from "../../components/Tab/Tab";
import { tabOptions } from "../../components/Tab/constants";
import BuyTab from "../../components/BuySection";
import LaunchPad from "../../components/Launchpad";

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
      {selectedTab === tabOptions[2].key && <LaunchPad />}
    </div>
  );
};

export default AppScreen;
