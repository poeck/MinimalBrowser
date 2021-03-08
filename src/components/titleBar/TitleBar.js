//       Imports
import styles from "./TitleBar.module.css";
import Close from "./close.svg";
import Minimize from "./minimize.svg";
import TabBox from "../tabBox/TabBox";

const { ipcRenderer } = window.require("electron");

function TitleBar() {
  function minimize() {
    ipcRenderer.send("event", { event: "minimize" });
  }

  function close() {
    ipcRenderer.send("event", { event: "close" });
  }

  /** Render */
  return (
    <div>
      <div className={styles.bar}>
        <TabBox />
        <div className={styles.navContainer}>
          <button className={styles.button}>
            <img
              onClick={minimize}
              className={styles.icon}
              id={styles.minimize}
              src={Minimize}
            />
          </button>
          <button className={styles.button}>
            <img
              onClick={close}
              className="icon"
              id={styles.close}
              src={Close}
            />
          </button>
        </div>
      </div>
    </div>
  );
}

// Export
export default TitleBar;
