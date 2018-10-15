function show(message) { document.getElementById('content').innerText = message }
with (new WebSocket('wss://play-worker.c1games.com/')) {
  show('connecting..')
  onopen = function () {
    show('connected!')
    send('n[{"game_to_client":0,"player_1_err":1,"player_2_err":2,"game_over":3},{"algo_zip":0},"%7B%22player_1%22%3A%22manual%22%2C%22player_2%22%3A%22manual%22%7D"]')
  }
  onmessage = function (event) {
    if (!event.data.includes('debug')) return show('waiting..')
    close()
    show(JSON.stringify(JSON.parse(`{"de${event.data.split('{"de')[1]}`), null, 2))
  }
}
