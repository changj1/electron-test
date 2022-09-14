// const win = require('../main')

// console.log(win);

function doGenerateIcon() {
  console.log('Menu do generate');
  
  return 'doGenerating'
}

const template = [
  {
    label: 'Edit',
    submenu: [
      {
        label: 'Reload',
        accelerator : 'Ctrl+R',
        role: 'reload'
      },
      {
        label: 'Select All',
        accelerator : 'Ctrl+A',
        role: 'selectAll'
      },
      {
        type : 'separator'
      },
      {
        label: 'My SubMenu',
        submenu: [
          {
            label: 'Item 1',
            type: 'checkbox',
          },
          {
            label: 'Item 2',
            type: 'checkbox',
          },
        ]
      }
    ]
  },
  {
    label: 'Menu 2',
    submenu: [{
      label: 'One More Menu Item'
    }]
  }
]

module.exports = [doGenerateIcon, template]