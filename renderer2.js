const updateOnlineStatus = () => {
    let status = navigator.onLine? 'online':'offline'
    console.log(status);
    if (navigator.onLine) {
        document.body.style.backgroundColor = 'green'
        document.getElementById('h2-checking').style.display = 'none'
        document.getElementById('h2-online').style.display = 'block'
        document.getElementById('h2-offline').style.display = 'none'
    } else {
        document.body.style.backgroundColor = 'red'
        document.getElementById('h2-checking').style.display = 'none'
        document.getElementById('h2-online').style.display = 'none'
        document.getElementById('h2-offline').style.display = 'block'
    }

    let note = new Notification('You are ' + status, {body: 'You are now ' + status})
    note.onclick = () => {
        console.log('Notification clicked!');
    }
}

window.addEventListener('online', updateOnlineStatus)
window.addEventListener('offline', updateOnlineStatus)
document.getElementById('checkStatusButton').addEventListener('click', updateOnlineStatus)

updateOnlineStatus()