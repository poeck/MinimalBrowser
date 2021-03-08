/** Imports */
const { app } = require('electron')
const isDev = require('electron-is-dev')
const Storage = require('./util/storage')
const Events = require('./util/events')
const SingleInstance = require('./util/singleInstance')
const Tray = require('./util/tray')
const log = require('electron-log')
const AutoLaunch = require('auto-launch')
const Window = require('./util/window')
const KeyBindings = require('./util/keybindings')
/** Config */
const APP_CONF = require('./conf/app.conf')

/** Variables */
let autolaunch

/** Initialize AutoLaunch with name */
if (APP_CONF.autolaunch) {
  autolaunch = new AutoLaunch({
    name: app.getName()
  })
}

app.commandLine.appendSwitch('ignore-certificate-errors', 'true')
app.commandLine.appendSwitch('disable-features', 'CrossOriginOpenerPolicy')
app.allowRendererProcessReuse = false

/** Called on app-ready */
async function whenReady () {
  /** Simple Dev-Message */
  if (isDev) console.log('Running', app.getName(), 'in Development!')

  if (APP_CONF.singleInstance) SingleInstance.request() // Request single instance
  if (APP_CONF.tray) Tray.create() // Create tray
  if (APP_CONF.storage) Storage.init() // Create Prefs File

  /** Set AutoLaunch */
  if (APP_CONF.autolaunch) autolaunch.enable()

  /** Set Logs */
  log.transports.file.level = 'info'
  console.log = log.log // Overwriting console.log

  Events.listen() // Register App events
  Window.create() // Create window
  KeyBindings.register() // Register keybindings
}

app.on('ready', whenReady)
app.on('window-all-closed', () => app.exit())

if (APP_CONF.tray) app.on('window-all-closed', Tray.create)
