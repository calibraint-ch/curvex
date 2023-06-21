import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import HomePage from "./app/containers/HomePage";
import Header from "./app/components/Header/Header";
import AppScreen from "./app/containers/AppScreen";
import UserDashBoard from "./app/containers/UserDashboard";
import { routes } from "./utils/routes";
import { useWalletSlice } from "./app/slice/wallet.slice";

import "./App.scss";

function App() {
  useWalletSlice()
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path={routes.homepage} element={<HomePage />} />
          <Route path={routes.dashboard} element={<AppScreen />} />
          <Route path={routes.portfolio} element={<UserDashBoard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
