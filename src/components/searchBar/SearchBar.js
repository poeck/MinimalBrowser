//       Imports
import { useEffect, useRef, useState } from "react";
import styles from "./SearchBar.module.css";
import Back from "./back.svg";
import Forward from "./forward.svg";
import Refresh from "./refresh.svg";
import Close from "./close.svg";
import TabsManager from "../../lib/tabs-manager";

const { ipcRenderer } = window.require("electron");

function SearchBar() {
  const input = useRef(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    TabsManager.on("url:update", urlUpdate);
    listenSubmit();
    addListeners();
    return () => {
      ipcRenderer.removeAllListeners("loading:stop");
      ipcRenderer.removeAllListeners("loading:start");
    };
  });

  /** Add listeners */
  function addListeners() {
    ipcRenderer.on("loading:start", () => setLoading(true));
    ipcRenderer.on("loading:stop", () => setLoading(false));
  }

  /**
   * Called on url update
   * @param {string} url
   */
  function urlUpdate(url) {
    input.current.value = url;
  }

  /**
   * Listens for submit in search input
   */
  function listenSubmit() {
    input.current.addEventListener("keyup", (e) => {
      if (e.key === "Enter" || e.keyCode === 13)
        ipcRenderer.emit("search:submit", { value: input.current.value });
    });
  }

  /** Call click event */
  function click(type) {
    ipcRenderer.emit("button:click", { button: type });
  }

  /** Refresh click */
  function refresh() {
    if (!loading) ipcRenderer.emit("button:click", { button: "refresh" });
    else ipcRenderer.emit("button:click", { button: "stop" });
  }

  /** Render */
  return (
    <div>
      <div className={styles.bar}>
        <nav className={styles.nav}>
          <img draggable={false} src={Back} onClick={() => click("back")} />
          <img draggable={false} src={Forward} onClick={() => click("forward")} />
          <img draggable={false} src={loading ? Close : Refresh} onClick={refresh} />
        </nav>
        <div className={styles.inputBox}>
          <input
            ref={input}
            id={styles.searchInput}
            spellCheck="false"
            type="text"
          ></input>
        </div>
      </div>
    </div>
  );
}

// Export
export default SearchBar;
