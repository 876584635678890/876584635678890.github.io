const progress = new ProgressBar.Line('#progress', { easing: 'easeOut', from: { color: '#4d3c3f' }, to: { color: '#a3a3d3' }, duration: 3728, trailWidth: .734, step: function (state, bar, _) { bar.path.setAttribute('stroke', state.color) } }), api = 'https://c1-terminal.herokuapp.com'
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
  if (!window.location.search.includes('season=')) {
    const previous = window.location.search.split('&focus=')
    window.location.search = `${previous[0]}&season=${previous[0].includes('time=all') ? 'current' : new Date('2019-01-04T21:31:00.000Z') > new Date(window.location.search.split('to')[1].split('&')[0]) ? 'one' : 'current'}${previous.length > 1 ? `&focus=${previous[1]}` : ''}`
  } else (async function () {
    const timeFormat = 'DD/MM/YYYY HH:mm'
    async function request(endpoint) {
      const response = await fetch(`${api}/leaderboard/${endpoint}${window.location.search}`)
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
      let previous = value
      field.onchange = () => field.value.includes('Z') ? previous = field.value : 0
      new Pikaday({
        keyboardInput: false,
        field: field, onSelect: (date) => {
          if ((new Date(previous)).getDate() != date.getDate()) {
            field.value = date.toISOString()
            previous = field.value
          } else
            field.value = previous
        }
      })
      if (value != undefined)
        field.value = value
      return field
    }
    const season = window.location.search.split('season=')[1].split('&')[0]
    const currentSeason = season == 'current'
    const seasonDropdown = document.querySelector('#season')
    seasonDropdown.options[currentSeason ? 0 : 1].selected = 'selected'
    seasonDropdown.onchange = () => window.location.search = `${window.location.search.split('&season=')[0]}&season=${seasonDropdown.options[seasonDropdown.selectedIndex].value}`
    seasonDropdown.style.display = 'inline'
    const [startTime, endTime] = window.location.search.split('&')[0].substring(6).split('to')
    const startField = initPicker(document.getElementById('start'), startTime), endField = initPicker(document.getElementById('end'), endTime)
    document.getElementById('picker').style.display = 'inline'
    document.getElementById('apply').onclick = () => window.location.search = startField.value == undefined ? '' : `?time=${startField.value}${endField.value == undefined ? '' : `to${endField.value}`}&season=${season}`
    document.getElementById('reset').onclick = () => window.location.search = ''
    document.getElementById('all').onclick = () => window.location.search = `?time=all&season=${season}`

    progress.animate(1 / 3)
    show('retrieving leaderboard and metrics')

    let selected = undefined
    window.oncontextmenu = () => {
      if (selected == undefined) return true
      topConfig.data.datasets.forEach((set, index) => set.hidden = data.algos[index].id == selected ? false : true)
      top.update()
      window.history.pushState('focus', document.title, `${document.location.search.includes('focus') ? document.location.search.substring(0, document.location.search.indexOf('&focus')) : document.location.search}&focus=${selected}`)
      return false
    }

    let data = await (currentSeason ? request('get') : request('archived'))
    if (!(data instanceof Object)) return error(data)
    const topConfig = {
      type: 'line',
      data: {
        labels: [],
        datasets: []
      },
      options: {
        onHover: (event, item) => { selected = item.length > 0 && item[0]._chart.boxes[0].bottom < event.offsetY && event.offsetY < item[0]._chart.boxes[3].bottom ? data.algos[item[0]._datasetIndex].id : undefined },
        onClick: (event, item) => {
          if (item.length > 0 && item[0]._chart.boxes[0].bottom < event.offsetY && event.offsetY < item[0]._chart.boxes[3].bottom) window.open(`https://bcverdict.github.io/?id=${data.algos[item[0]._datasetIndex].id}`)
          if (document.location.search.includes('focus')) window.history.pushState('unfocus', document.title, document.location.search.substring(0, document.location.search.indexOf('&focus')))
        },
        responsive: true,
        title: {
          display: true,
          text: 'C1 Terminal Top 10 Algos over time'
        },
        tooltips: {
          mode: 'nearest',
          intersect: false,
          backgroundColor: 'rgba(137, 132, 194, .76)',
          displayColors: false
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
    }, metricsConfig = {
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
                labelString: 'Matches'
              },
              display: true,
              id: 'matches'
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
            },
            {
              scaleLabel: {
                display: true,
                labelString: 'Matches per Algo'
              },
              display: true,
              id: 'matches_per_algo',
              gridLines: {
                drawOnChartArea: false
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
    function metricsData(data) {
      metricsConfig.data = {
        labels: data.map((metric) => moment(metric.time).format(timeFormat)),
        datasets: [
          {
            label: 'Players Registered',
            borderColor: color = `hsl(42 38%67%)`,
            backgroundColor: color,
            data: data.map((metric) => { return { t: moment(metric.time).format(timeFormat), y: metric.players } }),
            yAxisID: 'players'
          },
          {
            label: 'Matches Played',
            borderColor: color = `hsl(233 38%67%)`,
            backgroundColor: color,
            data: data.map((metric) => { return { t: moment(metric.time).format(timeFormat), y: metric.matches } }),
            yAxisID: 'matches'
          },
          {
            label: 'Algos Uploaded',
            borderColor: color = `hsl(346 53%43%)`,
            backgroundColor: color,
            data: data.map((metric) => { return { t: moment(metric.time).format(timeFormat), y: metric.algos } }),
            yAxisID: 'algos'
          },
          {
            label: 'Matches Played over Algos Uploaded',
            borderColor: color = `hsl(181 42%49%)`,
            backgroundColor: color,
            data: data.map((metric) => { return { t: moment(metric.time).format(timeFormat), y: (metric.matches / metric.algos).toFixed(2) } }),
            yAxisID: 'matches_per_algo'
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
          }), borderColor: color = `hsl(${Math.random() * 360} ${Math.random() * 9 + 34}%${Math.random() * 11 + 51}%)`, backgroundColor: color,
          hidden: document.location.search.includes('focus') ? document.location.search.split('focus=')[1] == algo.id ? false : true : false
        }))
      }
    }
    progress.animate(2 / 3)
    if (currentSeason) show('old data fetched (metrics below leaderboard chart) and updating in the background')

    topData(data.algos)
    metricsData(data.metrics)
    const topField = document.getElementById('top'), metricsField = document.getElementById('metrics')
    topField.style.display = 'block'
    const top = new Chart(topField, topConfig)
    document.getElementById('invert').onclick = () => {
      topConfig.data.datasets.forEach((set) => set.hidden = !set.hidden)
      top.update()
    }
    metricsField.style.display = 'block'
    const metrics = new Chart(metricsField, metricsConfig)

    if (currentSeason) {
      data = await request('new')
      if (!(data instanceof Object)) return error(data)
      topData(data.algos)
      metricsData(data.metrics)
      top.update()
      metrics.update()
      show('(thanks for being a cron) new data received (scroll down to see metrics if not visible)')
    }
    progress.set(1)
    if (!currentSeason) show('archived data loaded successfully')
  })()
else {
  const other = new Date()
  other.setDate(other.getDate() - 7)
  const future = new Date()
  future.setDate(future.getDate() + 1)
  window.location.search = `?time=${other.toISOString()}to${future.toISOString()}&season=current`
}
