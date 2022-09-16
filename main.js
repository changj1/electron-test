const { app, BrowserWindow, ipcMain, Menu, nativeTheme, dialog, protocol, webContents } = require('electron')
const path = require('path')
const template = require('./mainsupport/menu')[1]
const template2 = require('./mainsupport/menu')[2]
const doGenerateIcon = require('./mainsupport/menu')[0]
// const fileReader = require('./mainsupport/fileReader')[0]
const fileWriter = require('./mainsupport/fileReader')[1]
const readFile = require('./mainsupport/fileReader')[2]
const url = require('url')
const fs = require('fs')
const { electron } = require('process')

// fileReader('./assets/filetest.txt')
// readFile('./assets/filetest.txt')

// setTimeout(() => {
//   fileWriter('./assets/filetest.txt', 'I will add this new one')
//   readFile('./assets/filetest.txt')
// }, 3000)
let win, secondWindow, windowToCapture, windowToPrint;

const createWindow = (fileStrPage, options) => {
  nativeTheme.themeSource = 'dark'
  win = new BrowserWindow(options)

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

  ipcMain.on('capture-window', async (event) => {
    windowToCapture = BrowserWindow.fromId(event.sender.id)//Without const, let keyword, he defined windowToCapture as global variable
    let bounds = windowToCapture.getBounds()
    const image = await windowToCapture.webContents.capturePage({
      x: 0, y: 0, width: bounds.width, height: bounds.
      height
    })
    imageCaptured(image)
  })

  async function imageCaptured(image) {
    let fileName = await dialog.showSaveDialog({
      title: 'Save file...',
      buttonLabel: "CapturedFileName",
    })

    console.log(fileName);

    let filePath =fileName.filePath + '-' + windowToCapture.getTitle() + '.png'
    let png = image.toPNG()
    fs.writeFileSync(filePath, png)
  }

  ipcMain.on('print-pdf', async (event) => {
    windowToPrint = BrowserWindow.fromId(event.sender.id)//Without const, let keyword, he defined windowToCapture as global variable
    const pdfFile = await windowToPrint.webContents.printToPDF({})
    console.log(pdfFile)
    pdfCreated(pdfFile)
  })

  async function pdfCreated(data, error) {
    let fileName = await dialog.showSaveDialog({
      title: 'Print file...',
      buttonLabel: "PdfFileName",
    })
    
    let filePath =fileName.filePath + '-' + windowToPrint.getTitle() + '.pdf'
    if(error){
      console.error(error.message);
    }
    if(data){
      fs.writeFile(filePath, data, error => {
        console.error(error);
      })
    }
  }

  win.loadURL(url.format({
    pathname: path.join(__dirname, fileStrPage),
    protocol: 'file:',
    slashes: true
  }))

  win.webContents.openDevTools()

  win.webContents.on('did-finish-load', event => {
    console.log('did-finish-load : ', BrowserWindow.fromId(0))
  })
  // console.log('webContents.id', webContents.fromId(event));

}

// const createWindow2 = (fileStrPage, options) => {
//   nativeTheme.themeSource = 'dark'
//   secondWindow = new BrowserWindow(options)

//   secondWindow.loadURL(url.format({
//     pathname: path.join(__dirname, fileStrPage),
//     protocol: 'file:',
//     slashes: true
//   }))

//   // secondWindow.webContents.openDevTools()
// }

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

app.whenReady().then(
  () => {
    console.log(app.getLocale())

    let menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)

    createWindow('index.html', {
      backgroundColor: '#FFF', // DEFAULT: '#FFF',

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
      },
    })

    // let menu2 = Menu.buildFromTemplate(template2)
    // Menu.setApplicationMenu(menu2)

    // secondWindow = createWindow2('./support.html', {
    //   width: 400, height: 400, title: 'SECOND',
    //   icon: path.join(__dirname, './assets/capturedImage.png'),
    //   webPreferences: {
    //     preload: path.join(__dirname, 'preload2.js')
    //   },
    // })
  },
)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})


