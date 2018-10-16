const progress = new ProgressBar.Line('#progress', { easing: 'easeOut', from: { color: '#4d3c3f' }, to: { color: '#a3a3d3' }, duration: 3728, trailWidth: .734, step: function (state, bar, _) { bar.path.setAttribute('stroke', state.color) } })
function show(message) { document.getElementById('content').innerText = message }
with (new WebSocket('wss://play-worker.c1games.com/')) {
  show('connecting..')
  progress.animate(1 / 4)
  onopen = function () {
    show('connected!')
    progress.animate(2 / 4)
    send('n[{"game_to_client":0,"player_1_err":1,"player_2_err":2,"game_over":3},{"algo_zip":0},"%7B%22player_1%22%3A%22manual%22%2C%22player_2%22%3A%22manual%22%7D"]')
  }
  onmessage = function (event) {
    if (!event.data.includes('debug')) return [show('waiting..'), progress.animate(3.97 / 4)]
    progress.animate(4 / 4)
    close()
    show(JSON.stringify(JSON.parse(`{"de${event.data.split('{"de')[1]}`), null, 2))
    PR.prettyPrint()
  }
}