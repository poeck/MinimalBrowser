//       Imports
import { useEffect, useRef, useState } from 'react'
import styles from './Webview.module.css'
import TabsManager from '../../lib/tabs-manager'

function Webview () {
  const { ipcRenderer, remote } = window.require('electron')
  const [tabs, setTabs] = useState(TabsManager.tabs)

  /** Called on init */
  useEffect(() => {
    addListeners()
    /** Called on dispose */
    return () => {
      ipcRenderer.removeAllListeners('button:click')
      ipcRenderer.removeAllListeners('search:submit')
    }
  })

  function addListeners () {
    addLoadListeners()

    // Listen for webview update
    TabsManager.on('update:webview', onTabsUpdate)

    // Listen for search ar submit
    ipcRenderer.on('search:submit', data => {
      let obj = getActiveWebview()
      // Load converted url into active webview
      obj.loadURL(TabsManager.getRightUrl(data.value))
    })

    // Listens for Ctrl + T
    ipcRenderer.on('keybind:tab', data => {
      TabsManager.add()
    })


    // Listen for button click
    ipcRenderer.on('button:click', data => {
      let webview = getActiveWebview()
      switch (data.button) {
        case 'back':
          if (webview.canGoBack()) webview.goBack()
          break
        case 'forward':
          if (webview.canGoForward()) webview.goForward()
          break
        case 'refresh':
          webview.reload()
          break
        case 'stop':
          webview.stop()
          break
        default:
          break
      }
    })
  }

  /**
   * Find currently active webview
   * @return {*} Webview
   */
  function getActiveWebview () {
    return document.querySelector('#' + TabsManager.getActiveTab().id)
  }

  /** Called on tab change */
  function onTabsUpdate () {
    setTabs([...TabsManager.tabs])
    addLoadListeners()
  }

  function addLoadListeners () {
    tabs.forEach(tab => {
      if (!TabsManager.webviewListeners.includes(tab.id)) {
        let obj = document.querySelector('#' + tab.id)
        if (obj) {
          TabsManager.webviewListeners.push(tab.id)
          obj.addEventListener('did-finish-load', () =>
            TabsManager.updateTab(tab.id, obj.getURL(), obj.getTitle())
          )
          obj.addEventListener('did-start-loading', () =>
            ipcRenderer.emit('loading:start', {})
          )
          obj.addEventListener('did-stop-loading', () =>
            ipcRenderer.emit('loading:stop', {})
          )
        }
      }
    })
  }

  /** Render */
  return (
    <div>
      {tabs.map((tab, index) => {
        return (
          <webview
            id={tab.id}
            key={tab.id}
            className={(tab.active ? styles.active : '') + ' ' + styles.webview}
            useragent='Mozilla/5.0 (Windows NT 10.0; rv:74.0) Gecko/20100101 Firefox/74.0'
            src={TabsManager.defaultUrl}
            allowpopups='true'
            webcontents='true'
          ></webview>
        )
      })}
    </div>
  )
}

// Export
export default Webview
