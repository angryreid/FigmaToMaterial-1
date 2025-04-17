import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { ConversionProvider } from "@/context/ConversionContext";

createRoot(document.getElementById("root")!).render(
  <ConversionProvider>
    <App />
  </ConversionProvider>
);
