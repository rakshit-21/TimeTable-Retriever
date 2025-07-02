// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import TimeTableApp from "./App.jsx";   // this renders your App.jsx
import "./index.css";              // Tailwind base (if you have it)

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <TimeTableApp />
  </React.StrictMode>
);
