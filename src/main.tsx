import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./utils/consoleOverride";

createRoot(document.getElementById("root")!).render(<App />);