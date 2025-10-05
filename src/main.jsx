import React from "react";
import ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { Web3Provider } from "./Web3Provider";
import App from "./App";
import "@assets/css/normalize.css";
import "@assets/css/style.css";
import "@assets/css/swap.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HelmetProvider>
      <Web3Provider>
        <App />
      </Web3Provider>
    </HelmetProvider>
  </React.StrictMode>,
);
