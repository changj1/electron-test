const { contextBridge, ipcRenderer, shell } = require('electron')

//two-way method Main <-> renderer
contextBridge.exposeInMainWorld('versions', {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,

    //if renderer called chang exposure argument, chang function(ipcMain.handle(callback function)) which is existed in main.js would be invoked.
    chang: () => ipcRenderer.invoke('chang'),
    sendSyncFunc: (arg) => ipcRenderer.sendSync('synchronous-msg', arg),
    sendAsyncFunc: (arg) => ipcRenderer.invoke('async-msg', arg),
    sendDir: () => ipcRenderer.invoke('open-directory-dialog'),
    toggle: () => ipcRenderer.invoke('dark-mode:toggle')

})

//Renderer to Main
//this is one way(Renderer to Main), So It doesn't return value to renderer
contextBridge.exposeInMainWorld('electronToMain', {
    sendDir2: () => ipcRenderer.send('open-directory-dialog2'),
    sendSave: () => ipcRenderer.send('save-file-dialog'),//(2)
    capturePNG : () => ipcRenderer.send('capture-window'),
    printPDF : () => ipcRenderer.send('print-pdf'),
})


//Main -> Renderer
contextBridge.exposeInMainWorld('electronAPI', {
    // dogenerate function from main, 
    // So the name called in ipcRenderer.on must be same as the win.webContents.send('name') 
    dogenerated: (callback) => ipcRenderer.on('dogenerate', callback),
    onUpdateCounter: (callback) => ipcRenderer.on('update-counter', callback),
    getFileName: (callback) => ipcRenderer.on('selectedItems', callback)
})
