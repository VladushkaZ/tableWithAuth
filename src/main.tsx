import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ConfigProvider } from "antd";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#242EDB",
          borderRadius: 6,
          fontSize: 16,
        },
        components: {
          Table: {
            headerBg: "#fff",
            headerSplitColor: "#fff",
            headerColor: "#B2B3B9"
          },
        },
      }}
    >
      <App />
    </ConfigProvider>
  </StrictMode>,
);
