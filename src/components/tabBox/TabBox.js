//       Imports
import styles from "./TabBox.module.css";
import Tab from "../tab/Tab";
import { useEffect, useState } from "react";
import Plus from "./plus.svg";
import TabsManager from "../../lib/tabs-manager";

function TabBox() {
  /** Variables */
  const [tabs, setTabs] = useState(TabsManager.tabs);

  /** Init */
  useEffect(() => {
    addListeners();
  });

  /** Add listeners */
  function addListeners() {
    TabsManager.on("update:tabs", onTabsUpdate);
    // setTabs(TabsManager.tabs);
  }

  /** Called on tab change */
  function onTabsUpdate() {
    setTabs([...TabsManager.tabs]);
  }

  /** On tab click */
  function click(id) {
    TabsManager.setActiveTab(id);
  }

  /** Add tab */
  function add() {
    TabsManager.add();
  }

  /** Close tab */
  function close(id) {
    TabsManager.closeTab(id);
  }

  /** Render */
  return (
    <div className={styles.box}>
      <div className={styles.tabs}>
        {tabs.map((tab) => {
          return (
            <Tab
              key={tab.id}
              active={tab.active}
              title={tab.title}
              close={() => close(tab.id)}
              onclick={() => click(tab.id)}
            />
          );
        })}
      </div>
      <button className={styles.plus} onClick={add}>
        <img draggable={false} src={Plus} />
      </button>
      <div className={styles.draggable}></div>
    </div>
  );
}

// Export
export default TabBox;
