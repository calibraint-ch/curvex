import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { configureAppStore } from "./store/configureStore";
import "./index.scss";
import App from "./App";

import "bootstrap/dist/css/bootstrap.css";

const store = configureAppStore();
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
