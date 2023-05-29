import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.scss";

import HomePage from "./app/containers/HomePage";
import { routes } from "./utils/routes";
import Header from "./app/components/Header/Header";

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path={routes.homepage} element={<HomePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
