import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.scss";

import HomePage from "./app/containers/HomePage";
import { routes } from "./utils/routes";
import Header from "./app/components/Header/Header";
import Footer from "./app/components/Footer/Footer";
import AppScreen from "./app/containers/AppScreen";

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Footer />
        <Routes>
          <Route path={routes.homepage} element={<HomePage />} />
          <Route path={routes.appscreen} element={<AppScreen />}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
