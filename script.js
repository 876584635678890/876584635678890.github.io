const socket = new WebSocket('wss://play-worker.c1games.com/')
function send(message) {
    document.getElementById('content').innerText = message
}
send('connecting..')
socket.onopen = function () {
    send('connected!')
    socket.send('n[{"game_to_client":0,"player_1_err":1,"player_2_err":2,"game_over":3},{"algo_zip":0},"%7B%22player_1%22%3A%22manual%22%2C%22player_2%22%3A%22manual%22%7D"]')
}
socket.onmessage = function (event) {
    if (!event.data.includes('debug'))
        return send('waiting..')
    socket.close()
    send(JSON.stringify(JSON.parse(`{"de${event.data.split('{"de')[1]}`), null, 2))
}