const fs = require('fs');
const fileState = (path) => fs.stat(path,
    function (err, stats) {
        if (err) console.error(err);
        console.log(stats);

        // Check file type
        console.log("isFile ? " + stats.isFile())
        console.log("isDirectory ? " + stats.isDirectory())
    })

const fileWriter = (file, content) => fs.writeFile(file, content, (err) => {
    console.log('filewriter function: ',file);
    if(err){
        console.log('An error occured ' + err.message);
    }else{
        console.log('ok success saved');
    }
})

const readFile = (path) => fs.readFile(path, 'utf-8', (err, data) => {
    if(err){
        alert('An error occured' + err.message)
        return
    }
    console.log("The file content is: " + data);
})

module.exports = [fileState, fileWriter, readFile]