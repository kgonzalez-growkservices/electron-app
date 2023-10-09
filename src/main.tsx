import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Provider } from "react-redux";
import store from "./store/store";

if (window.ipcRenderer == undefined) {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  // Use contextBridge
  window.ipcRenderer.on("main-process-message", (_event, message) => {
    console.log(message);
  });

  window.ipcRenderer.on("backend-started", (_event) => {
    ReactDOM.createRoot(document.getElementById("root")!).render(
      <React.StrictMode>
        <Provider store={store}>
          <App />
        </Provider>
      </React.StrictMode>
    );

    // Remove Preload scripts loading
    postMessage({ payload: "removeLoading" }, "*");
  });

  window.ipcRenderer.on("backend-start-error", (_event) => {
    ReactDOM.createRoot(document.getElementById("root")!).render(
      <React.StrictMode>
        <div>ERROR</div>
      </React.StrictMode>
    );
    // Remove Preload scripts loading
    postMessage({ payload: "removeLoading" }, "*");
  });
}
