
window.addEventListener('contextmenu', (e) => {
  e.preventDefault()
  console.log('this is context menu');
})

const information = document.getElementById('info');
information.innerText = `This apps is using Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), and Electron (v${versions.electron()})`;

document.getElementById('toggle-dark-mode').addEventListener('click', async () => {
  const isDarkMode = await versions.toggle()
  console.log('renderer sent out:', isDarkMode);
  const theme = document.getElementById('theme-toggle');
  theme.innerText = isDarkMode ? 'Dark' : 'Light'

})

const doGeneration = document.getElementById('doGeneration')

// dogenerate function are from main through preload(main -> renderer one way)
window.electronAPI.dogenerated((_event, value) => {
  shell.beep()
  doGeneration.innerText = value
})


//(main -> renderer one way)
const counter = document.getElementById('counter')
window.electronAPI.onUpdateCounter((_event, value) => {
  const oldValue = Number(counter.innerText)
  const newValue = oldValue + value
  counter.innerText = newValue
})


//Two way Main to Renderer and Renderer to Main 
const syncMsgBtn = document.getElementById('sendSyncMsgBtn')
syncMsgBtn.addEventListener('click', () => {
  const results = versions.sendSyncFunc('Mr. Watson, come here.')
  console.log(results);
  const msg = `Synchronous message Reply: ${results}`
  document.getElementById('syncReply').innerHTML = msg
})

//Two way Main to Renderer and Renderer to Main 
const asyncMsgBtn = document.getElementById('sendAsyncMsgBtn')
asyncMsgBtn.addEventListener('click', async () => {
  const results = await versions.sendAsyncFunc('That is one small step for man')
  console.log(results);
  const msg = `Asynchronous message Reply async: ${results}`
  document.getElementById('asyncReply').innerHTML = msg
})


//Two way Main to Renderer and Renderer to Main 
const selectDirBtn = document.getElementById('select-directory')
selectDirBtn.addEventListener('click', async () => {
  const results = await versions.sendDir()
  const selectedFile = document.getElementById('selectedItem')
  selectedFile.innerText = results
})


//One way Renderer to Main .....(1)
// const selectDirBtn2 = document.getElementById('select-directory2')
// selectDirBtn2.addEventListener('click', async () => {
//   const results = await electronToMain.sendDir2()
//   console.log(results);

// })  //(1) + (2) === two way

//One way Main to Renderer .....(2)
window.electronAPI.getFileName((_event, value) => {
  console.log('From main to renderer in one way ', value);
  const selectedFile2 = document.getElementById('selectedItem2')
  selectedFile2.innerText = value
})

//file saver(one way)
const saveFileBtn = document.getElementById('save-file')
saveFileBtn.addEventListener('click', () => {
  const result = electronToMain.sendSave()
})

//Capturing window(one way)
document.getElementById('captureBtn').addEventListener('click', () => {
  const result = electronToMain.capturePNG()
})

//Printing window(one way)
document.getElementById('printPDFBtn').addEventListener('click', () => {
  const result = electronToMain.printPDF()
})
