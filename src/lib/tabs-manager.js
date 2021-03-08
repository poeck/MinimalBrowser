const { remote, ipcRenderer } = window.require('electron')

class Tabs {
  // Default values for new tab
  static defaultTitle = 'about:blank'
  static defaultUrl = 'https://www.google.com'

  // Tab List
  static tabs = [
    {
      active: true,
      title: this.defaultTitle,
      url: this.defaultUrl,
      id: this.generateId()
    }
  ]

  // Listeners
  static eventListeners = {}
  static webviewListeners = []

  /**
   * Adds Event-Listener
   * @param {string} event - Event name/key
   * @returns {void}
   */
  static on (event, callback) {
    // No listener added to event
    if (this.eventListeners[event]) this.eventListeners[event].push(callback)
    // Event already contains Listener
    else this.eventListeners[event] = [callback]
  }

  /**
   *  Generates Id
   *
   * @returns {string} id
   */
  static generateId () {
    let length = 10 // Result lenght
    let pool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz' // Possible char pool
    let result = ''
    for (var i = 0; i < length; i++)
      result += pool.charAt(Math.floor(Math.random() * pool.length)) // Grab random char out of pool
    return result // Return the final id
  }

  /**
   * Notifies Listeners
   *
   * @param {string} event Event name/key
   * @param {object} data Optional data passed to listener
   * @returns {void}
   */
  static notifyListeners (event, data) {
    // Check if listener exists
    if (this.eventListeners[event]) {
      // Loop through listeners
      this.eventListeners[event].forEach(listener => {
        if (data) listener(data)
        else listener()
      })
    } else console.log('No listeners for', event)
  }

  /**
   *  Invokes update for Tabs
   */
  static invokeTabsUpdate () {
    this.notifyListeners('update:tabs')
  }

  /**
   *  Invokes update for Webviews
   */
  static invokeWebviewUpdate () {
    this.notifyListeners('update:webview')
  }

  /**
   *  Invokes update for Url
   */
  static invokeUrlUpdate () {
    this.notifyListeners('url:update', this.getActiveTab().url)
  }

  /**
   * Converts input to url
   * @param {string} input
   * @returns {string} url
   */
  static getRightUrl (input) {
    if (input.includes('http')) return input
    // Already full Link
    else if (input.includes('.')) return 'https://' + input
    // Just domain
    else {
      // Google Search
      let url = new URL('https://www.google.com/search')
      url.searchParams.append('q', input)
      return url.toString()
    }
  }

  /**
   * Get active tab
   * @returns Currently active tab object
   */
  static getActiveTab () {
    return this.tabs.find(t => t.active)
  }

  /**
   * Changes currently active tab to id
   * @param {string} id
   */
  static setActiveTab (id) {
    this.tabs.forEach(tab => {
      if (tab.id == id) tab.active = true
      else tab.active = false
      return tab
    })
    console.log('setActiveTab - Invoke update')
    this.invokeWebviewUpdate()
    this.invokeTabsUpdate()
    this.invokeUrlUpdate()
  }

  /**
   * Closes tab with id
   * @param {string} id
   */
  static closeTab (id) {
    if (this.tabs.length == 1) remote.app.quit()
    else {
      // Find object
      let object = this.tabs.find(tab => tab.id == id)

      let wasActive = object.active

      // Get index of object
      let index = this.tabs.indexOf(object)

      // Remove from array
      this.tabs = this.tabs.filter(tab => tab.id !== id)

      if (wasActive) {
        if (this.tabs.length == 1) this.tabs[0].active = true
        else if (index == 0) this.tabs[1].active = true
        else this.tabs[index - 1].active = true
      }

      console.log(this.tabs)
      console.log('closeTab - Invoke update')
      this.invokeUrlUpdate()
      this.invokeTabsUpdate()
      this.invokeWebviewUpdate()
    }
  }

  /**
   * Updates tab url & title with id
   * @param {string} id
   * @param {string} url
   * @param {string} title
   */
  static updateTab (id, url, title) {
    let updateUrl = false
    this.tabs.forEach(tab => {
      if (tab.id == id) {
        tab.url = url
        tab.title = title

        if (tab.active) updateUrl = true

        return tab
      }
    })
    if (updateUrl) this.invokeUrlUpdate()
    console.log('updateTab - Invoke update')
    this.invokeTabsUpdate()
  }

  /**
   * Creates new tab
   */
  static add () {
    this.tabs.push({
      active: false,
      title: this.defaultTitle,
      id: this.generateId(),
      url: this.defaultUrl
    })
    console.log('add - Invoke update')
    this.invokeTabsUpdate()
    this.invokeWebviewUpdate()
  }
}

export default Tabs
