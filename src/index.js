//       Imports
import React from "react";
import ReactDOM from "react-dom";
import TitleBar from "./components/titleBar/TitleBar";
import SearchBar from "./components/searchBar/SearchBar";
import Webview from "./components/webview/Webview";
import "./index.css";

/** Render */
ReactDOM.render(
  <div>
    <TitleBar />
    <SearchBar />
    <Webview />
  </div>,
  document.getElementById("root")
);
