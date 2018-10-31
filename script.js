const progress = new ProgressBar.Line('#progress', { easing: 'easeOut', from: { color: '#4d3c3f' }, to: { color: '#a3a3d3' }, duration: 3728, trailWidth: .734, step: function (state, bar, _) { bar.path.setAttribute('stroke', state.color) } })
function show(message) { document.getElementById('content').innerText = message }
if (window.location.href.includes('leaderboard'))
  (async function () {
    const timeFormat = 'DD/MM/YYYY HH:mm'
    async function request(endpoint) {
      const response = await fetch(`https://c1-terminal.herokuapp.com/leaderboard/${endpoint}`)
      const text = await response.text()
      if (response.status != 200 || text == 'done')
        return text
      else
        return JSON.parse(text)
    }

    function error(message) {
      progress.set(0)
      show(message)
    }

    progress.animate(1 / 3)
    show('gathering..')
    let data = await request('history')
    if (!(data instanceof Array)) return error(data)
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
        }
      }
    }
    function make(algo) {
      return {
        label: algo.name, data: algo.elo.map((elo) => {
          Math.seedrandom(algo.name)
          return { t: moment(elo.time).format(timeFormat), y: elo.elo }
        }), borderColor: color = `hsl(${Math.random() * 360} ${Math.random() * 9 + 34}%${Math.random() * 11 + 51}%)`, backgroundColor: color
      }
    }
    function label(algos) {
      const labels = []
      algos.forEach((algo) => algo.elo.forEach((elo) => labels.push(moment(elo.time).format(timeFormat))))
      return labels
    }
    config.data.labels = label(data)
    config.data.datasets = data.map((algo) => make(algo))
    const top = new Chart(document.getElementById('top'), config)
    data = await request('update')
    if (data != 'done')
      error(data)
    else {
      progress.animate(2.1 / 3)
      data = await request('history')
      if (!(data instanceof Array)) return error(data)
      config.data.labels = label(data)
      config.data.datasets = data.map((algo) => make(algo))
      top.update()
      progress.animate(2.56 / 3)
      show('successfully updated (thanks for being a cron) and waiting for metrics')
      data = await request('metrics')
      if (!(data instanceof Array)) return error(data)
      new Chart(document.getElementById('metrics'), {
        type: 'line',
        data: {
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
        },
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
          }
        }
      })
      progress.animate(1)
      show('all data fetched (scroll down to see metrics if not visible)')
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