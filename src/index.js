import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import Store from "./redux/store";
import UserContextProvider from "./context/UserContextProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={Store}>
      <UserContextProvider>
        <App />
      </UserContextProvider>
    </Provider>
  </React.StrictMode>
);
