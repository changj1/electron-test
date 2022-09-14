const { app, BrowserWindow, ipcMain, Menu, nativeTheme, dialog, protocol } = require('electron')
const path = require('path')
const template = require('./mainsupport/menu')[1]
const doGenerateIcon = require('./mainsupport/menu')[0]
// const fileReader = require('./mainsupport/fileReader')[0]
const fileWriter = require('./mainsupport/fileReader')[1]
const readFile = require('./mainsupport/fileReader')[2]
const url = require('url')
const FS = require('fs')

// fileReader('./assets/filetest.txt')
// readFile('./assets/filetest.txt')

// setTimeout(() => {
//   fileWriter('./assets/filetest.txt', 'I will add this new one')
//   readFile('./assets/filetest.txt')
// }, 3000)


let win;

const createWindow = () => {
  nativeTheme.themeSource = 'dark'
  win = new BrowserWindow({
    backgroundColor: '#000', // DEFAULT: '#FFF',

    width: 1000, // DEFAULT: 800
    height: 800, // DEFAULT: 600
    minWidth: 1000, // DEFAULT: 0
    minHeight: 800, // DEFAULT: 0
    resizable: true, // DEFAULT: true
    movable: true, // DEFAULT: true
    alwaysOnTop: false, // DEFAULT: false
    // frame: false, // DEFAULT: true
    // titleBarStyle: 'hidden' // DEFAULT: 'default'
    // transparent: true // DEFAULT: false
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  ipcMain.handle('chang', () => 'ok Im here')
  ipcMain.handle('dark-mode:toggle', () => {
    console.log('From main: dark-mode');
    if (nativeTheme.shouldUseDarkColors) {
      console.log('Main Process1', nativeTheme.shouldUseDarkColors);
      nativeTheme.themeSource = 'light'
    } else {
      console.log('Main Process2', nativeTheme.shouldUseDarkColors);
      nativeTheme.themeSource = 'dark'
    }
    return nativeTheme.shouldUseDarkColors
  })

  ipcMain.on('synchronous-msg', (event, arg) => {
    event.returnValue = 'I heard you'
    console.log(arg);
  })

  ipcMain.handle('async-msg', async (event, arg) => {
    // console.log(event);
    if (arg === 'That is one small step for man') {
      console.log('async: ', arg);
      // const result = event.sender.send('asynchronous-reply', ', one giant leap for mankind')
      return 'one giant leap for mankind'
    } else {
      return "no entry"
    }
  })

  ipcMain.handle('open-directory-dialog', async () => {
    const result = await dialog.showOpenDialog({
      title: 'Select a work file',
      properties: ['openFile', 'multiSelections']
    }).then(result => {
      // e.sender.send('open-directory-dialog', result)
      // console.log(result.filePaths);
      if (result) {
        return result.filePaths[0]
      } else {
        return 'no selected'
      }
    })
    return result
  })

  //this is one way(Renderer to Main), So It doesn't return value to renderer
  ipcMain.on('open-directory-dialog2', async (e) => {

    try {
      const result = await dialog.showOpenDialog(win, {
        properties: ['openFile', 'multiSelections']
      }).then(result => {
        if (result) {
          return result.filePaths[0]
        } else {
          return 'no selected'
        }
      })
      e.sender.send('selectedItems', result)

    } catch (error) {
      console.error(error);
    }
  })

  //Renderer to Main (2) function in preload.js
  ipcMain.on('save-file-dialog', async function (event) {
    let startPath = "";
    if (process.platform === 'darwin') {
      startPath = '/Users/<username>/Documents/'
    }
    let file = await dialog.showSaveDialog({
      title: 'Save file...',
      defaultPath: startPath + 'highscores.txt',
      buttonLabel: "Save",
      filters: [
        { name: 'Text', extensions: ['txt'] }
      ]
    })
    if (file) {
      let theData = "Daegeon, 10000"
      fileWriter(file.filePath, theData)
    }
  })


  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  win.webContents.openDevTools()

}

const addSubMenu = [
  {
    click: () => win.webContents.send('update-counter', 1),
    label: 'Increment',
  },
  {
    click: () => win.webContents.send('update-counter', -1),
    label: 'Decrement',
  }
]

const addSubmenu2 = [{
  // click: f => f,
  click: () => win.webContents.send('dogenerate', doGenerateIcon()),
  label: 'doGenerateIcon',
},
]

addSubMenu.map(item => {
  template[0].submenu.push(item)
})

addSubmenu2.map(item => {
  template[1].submenu.push(item)
})
// const newtemplate = [...template[0].submenu, ...addSubMenu]

// console.log(newtemplate);
// console.log(template[0].submenu);
// console.log(template[1].submenu);

app.whenReady().then(() => {
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
  createWindow()

})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})


