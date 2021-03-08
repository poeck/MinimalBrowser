//       Imports
import styles from "./Tab.module.css";
import Close from "./close.svg";

const { ipcRenderer } = window.require("electron");

function Tab(props) {
  /** Render */
  return (
    <div
      className={props.active ? styles.tab + " " + styles.active : styles.tab}
    >
      <p onClick={props.onclick} className={styles.title}>
        {props.title}
      </p>
      <button className={styles.close} onClick={props.close}>
        <img src={Close} />
      </button>
    </div>
  );
}

// Export
export default Tab;
