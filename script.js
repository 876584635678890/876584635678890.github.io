const progress = new ProgressBar.Line('#progress', { easing: 'easeOut', from: { color: '#4d3c3f' }, to: { color: '#a3a3d3' }, duration: 3728, trailWidth: .734, step: function (state, bar, _) { bar.path.setAttribute('stroke', state.color) } })
function show(message) { document.getElementById('content').innerText = message }
if (window.location.href.includes('config')) {
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
} else if (window.location.search.includes('time='))
  (async function () {
    const timeFormat = 'DD/MM/YYYY HH:mm'
    async function request(endpoint) {
      const response = await fetch(`https://c1-terminal.herokuapp.com/leaderboard/${endpoint}${window.location.search}`)
      if (response.status != 200 && response.status != 201)
        return await response.text()
      else
        return await response.json()
    }
    function error(message) {
      progress.set(0)
      show(message)
    }

    function initPicker(field, value) {
      new Pikaday({ field: field, onSelect: (date) => field.value = date.toISOString() })
      if (value != undefined)
        field.value = value
      return field
    }
    const [startTime, endTime] = window.location.search.substring(6).split('to')
    const startField = initPicker(document.getElementById('start'), startTime), endField = initPicker(document.getElementById('end'), endTime)
    document.getElementById('picker').style.display = 'inline'
    document.getElementById('apply').onclick = () => window.location.search = startField.value == undefined ? '' : `?time=${startField.value}${endField.value == undefined ? '' : `to${endField.value}`}`

    progress.animate(1 / 3)
    show('retrieving leaderboard and metrics')

    let data = await request('get')
    if (!(data instanceof Object)) return error(data)
    topConfig = {
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
          mode: 'nearest',
          intersect: false,
          backgroundColor: 'rgba(137, 132, 194, .76)',
          displayColors: false,
          // itemSort: function (a, b) { return a.y - b.y }
        },
        hover: {
          intersect: false,
          mode: 'nearest'
        },
        elements: {
          point: {
            radius: 2.3,
            hoverRadius: 2.9
          },
          line: {
            fill: false,
            tension: 0
          }
        },
        scales: {
          xAxes: [{
            type: 'time',
            time: {
              parser: timeFormat,
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
        },
        pan: {
          enabled: true,
          mode: 'x'
        },
        zoom: {
          enabled: true,
          mode: 'x'
        }
      }
    }
    metricsConfig = {
      type: 'line',
      data: {},
      options: {
        responsive: true,
        title: {
          display: true,
          text: 'C1 Terminal Metrics'
        },
        tooltips: {
          mode: 'nearest',
          intersect: false,
          backgroundColor: 'rgba(137, 132, 194, .76)',
          displayColors: false,
        },
        hover: {
          intersect: false,
          mode: 'nearest'
        },
        elements: {
          point: {
            radius: 2.3,
            hoverRadius: 2.9
          },
          line: {
            fill: false
          }
        },
        scales: {
          xAxes: [{
            type: 'time',
            time: {
              parser: timeFormat,
              tooltipFormat: 'll HH:mm'
            },
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Date'
            }
          }],
          yAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: 'Matches'
              },
              display: true,
              id: 'matches'
            },
            {
              scaleLabel: {
                display: true,
                labelString: 'Players'
              },
              display: true,
              id: 'players',
              gridLines: {
                drawOnChartArea: false
              }
            },
            {
              scaleLabel: {
                display: true,
                labelString: 'Algos'
              },
              display: true,
              id: 'algos',
              gridLines: {
                drawOnChartArea: false
              }
            }]
        },
        pan: {
          enabled: true,
          mode: 'xy'
        },
        zoom: {
          enabled: true,
          mode: 'xy'
        }
      }
    }
    function metricsData(data) {
      metricsConfig.data = {
        labels: data.map((metric) => moment(metric.time).format(timeFormat)),
        datasets: [
          {
            label: 'Matches Played',
            borderColor: color = `hsl(233 38%67%)`,
            backgroundColor: color,
            data: data.map((metric) => { return { t: moment(metric.time).format(timeFormat), y: metric.matches } }),
            yAxisID: 'matches'
          },
          {
            label: 'Players Registered',
            borderColor: color = `hsl(42 38%67%)`,
            backgroundColor: color,
            data: data.map((metric) => { return { t: moment(metric.time).format(timeFormat), y: metric.players } }),
            yAxisID: 'players'
          },
          {
            label: 'Algos Uploaded',
            borderColor: color = `hsl(346 53%43%)`,
            backgroundColor: color,
            data: data.map((metric) => { return { t: moment(metric.time).format(timeFormat), y: metric.algos } }),
            yAxisID: 'algos'
          }
        ]
      }
    }
    function label(algos) {
      const labels = []
      algos.forEach((algo) => algo.elo.forEach((elo) => labels.indexOf(time = moment(elo.time).format(timeFormat)) === -1 ? labels.push(time) : 0))
      return labels
    }
    function topData(algos) {
      topConfig.data = {
        labels: label(algos),
        datasets: algos.map((algo) => ({
          label: algo.name, data: algo.elo.map((elo) => {
            Math.seedrandom(algo.name)
            return { t: moment(elo.time).format(timeFormat), y: elo.elo }
          }), borderColor: color = `hsl(${Math.random() * 360} ${Math.random() * 9 + 34}%${Math.random() * 11 + 51}%)`, backgroundColor: color
        }))
      }
    }
    progress.animate(2 / 3)
    show('old data fetched (metrics below leaderboard chart) and updating in the background')

    topData(data.algos)
    metricsData(data.metrics)
    const top = new Chart(document.getElementById('top'), topConfig)
    const metrics = new Chart(document.getElementById('metrics'), metricsConfig)

    data = await request('new')
    if (!(data instanceof Object)) return error(data)
    topData(data.algos)
    metricsData(data.metrics)
    top.update()
    metrics.update()
    progress.animate(1)
    show('(thanks for being a cron) new data received (scroll down to see metrics if not visible)')
  })()
else {
  const other = new Date()
  other.setDate(other.getDate() - 7)
  window.location.search = `?time=${other.toISOString()}to${(new Date()).toISOString()}`
}