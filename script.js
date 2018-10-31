const progress = new ProgressBar.Line('#progress', { easing: 'easeOut', from: { color: '#4d3c3f' }, to: { color: '#a3a3d3' }, duration: 3728, trailWidth: .734, step: function (state, bar, _) { bar.path.setAttribute('stroke', state.color) } })
function show(message) { document.getElementById('content').innerText = message }
if (window.location.href.includes('leaderboard'))
  (async function () {
    const timeFormat = 'DD/MM/YYYY HH:mm'

    progress.animate(1 / 3)
    show('gathering..')
    let data = JSON.parse(await (await fetch('https://c1-terminal.herokuapp.com/leaderboard/history')).text())
    progress.animate(2 / 3)
    show('data loaded (updating in the background)')
    config = {
      type: 'line',
      data: {
        labels: [],
        datasets: []
      },
      options: {
        responsive: true,
        title: {
          display: true,
          text: 'C1 Terminal Top 10 Algos over time'
        },
        tooltips: {
					mode: 'index',
					intersect: false,
				},
				hover: {
					mode: 'nearest',
					intersect: true
				},
				scales: {
          xAxes: [{
            type: 'time',
            time: {
              format: timeFormat,
              tooltipFormat: 'll HH:mm'
            },
						display: true,
						scaleLabel: {
							display: true,
							labelString: 'Date'
						}
					}],
					yAxes: [{
						display: true,
						scaleLabel: {
							display: true,
							labelString: 'Elo'
						}
					}]
				}
      }
    }
    function make(algo) { return { label: algo.name, data: algo.elo.map((elo) => { return { x: moment(elo.time).format(timeFormat), y: elo.elo } }), fill: false, backgroundColor: color = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`, borderColor: color } }
    function label(algos) {
      const labels = []
      algos.forEach((algo) => algo.elo.forEach((elo) => labels.push(moment(elo.time).format(timeFormat))))
      return labels
    }
    config.data.labels = label(data)
    config.data.datasets = data.map((algo) => make(algo))
    const chart = new Chart(document.getElementById('chart').getContext('2d'), config)
    if (!(await fetch('https://c1-terminal.herokuapp.com/leaderboard/update')).ok) {
      show('failed updating')
      progress.animate(1)
    } else {
      progress.animate(2.7 / 3)
      data = JSON.parse(await (await fetch('https://c1-terminal.herokuapp.com/leaderboard/history')).text())
      config.data.labels = label(data)
      config.data.datasets = data.map((algo) => make(algo))
      chart.update()
      progress.animate(1)
      show('successfully updated (thanks for being a cron)')
    }
  })()
else {
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
}