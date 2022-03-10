let inCountry = document.getElementById('inCountry')
let selectCountry = document.getElementById('selectCountry')
let inInitialDate = document.getElementById('inInitialDate')
let inFinalDate = document.getElementById('inFinalDate')
let btnSubmit = document.getElementById('btnSubmit')

let country = 'brazil'
let initialDate = '2020-03-01'
let dateNow = new Date()
let finalDate = dateNow.toISOString().substring(0, 10)

let countries = []
let cases
let date

async function getCountries() {
  const urlCountries = 'https://api.covid19api.com/countries'

  const response = await fetch(urlCountries)
  const data = await response.json()

  data.forEach(element => {
    countries.push(element.Country)
  })

  const sortedCountries = countries.sort()

  sortedCountries.map(indice => {
    let opt = document.createElement('option')
    let optText = document.createTextNode(indice)
    opt.appendChild(optText)
    opt.value = indice
    selectCountry.appendChild(opt)

    if (indice == 'Brazil') {
      opt.selected = true
    }
  })
}

async function getApi() {
  const urlCases = `https://api.covid19api.com/country/${country}/status/confirmed?from=${initialDate}T00:00:00Z&to=${finalDate}T00:00:00Z`

  const response = await fetch(urlCases)
  const data = await response.json()

  cases = []
  date = []

  data.forEach(element => {
    let newDate = new Date(element.Date)
    let day = newDate.getUTCDate()
    let month = newDate.getUTCMonth() + 1
    let year = newDate.getUTCFullYear()

    day < 10 ? (day = '0' + day) : day
    month < 10 ? (month = '0' + month) : month

    let parsedDate = day + '/' + month + '/' + year

    date.push(parsedDate)
    cases.push(element.Cases)
  })

  myChart.data.datasets[0].data = cases
  myChart.data.labels = date
  myChart.data.datasets[0].label = `Cases of Covid in ${selectCountry.value}`
  myChart.update()
}

getCountries()
getApi()

const ctx = document.getElementById('myChart').getContext('2d')
const myChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: date,
    datasets: [
      {
        label: `Cases of Covid in ${country}`,
        data: cases,
        backgroundColor: 'rgba(103, 105, 235, 0.4)',
        borderColor: 'rgba(103, 105, 235, 1)',
        borderWidth: 1,
        radius: 0,
        fill: true
      }
    ]
  },
  options: {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      x: {
        ticks: {
          callback: function (val, index) {
            return index % 2 === 0 ? this.getLabelForValue(val) : ''
          }
        },
        grid: {
          color: 'rgba(106, 106, 110, 0.2)'
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(106, 106, 110, 0.2)'
        }
      }
    },
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  }
})

btnSubmit.addEventListener('click', e => {
  e.preventDefault()
  country = selectCountry.value.toLowerCase()
  initialDate = inInitialDate.value
  finalDate = inFinalDate.value
  getApi()
})

selectCountry.addEventListener('change', () => {
  country = selectCountry.value.toLowerCase()
  initialDate = inInitialDate.value
  finalDate = inFinalDate.value
  getApi()
})
