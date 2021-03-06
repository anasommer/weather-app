// Global variables
let apiKey = `3ea6115fe9b400fd4e84271df155a977`;
let form = document.querySelector("#form");
let temperature = null
let tempEl = document.querySelector('#showTemp')
let celsius = document.querySelector('#celsius')
let weatherIcon = document.querySelector('#weatherIcon')

function showDate() {
  let date = document.querySelector("#date");
  let now = new Date();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];
  let hours = now.getHours();
  if (now.getHours() < 10) {
    hours = `0${hours}`;
  }

  let minutes = now.getMinutes();
  if (now.getMinutes() < 10) {
    minutes = `0${minutes}`;
  }

  date.innerHTML = `${days[now.getDay()]} ${hours}:${minutes}`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000)
  let day = date.getDay()
  let days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return days[day]
}


//Show weather of a searched city
function showWeather(response) {
  temperature = response.data.main.temp
  document.querySelector('#city').innerHTML = response.data.name
  tempEl.innerHTML = Math.round(temperature)
  document.querySelector('#humidity').innerHTML = response.data.main.humidity
  document.querySelector('#wind').innerHTML = Math.round(response.data.wind.speed)
  document.querySelector('#description').innerHTML = response.data.weather[0].main
  weatherIcon.setAttribute('src', `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`)
  weatherIcon.setAttribute('alt', `${response.data.weather[0].main}`)

  getForecast(response.data.coord)
}

function showForecast(response) {
  let forecast = response.data.daily
  let forecastEl = document.querySelector('#forecast')
  let forecastHtml = `<div class='row'>`

  forecast.forEach(function (day, index) {
    if (index < 5) {
      forecastHtml = forecastHtml + `<div class="col-2">
  <h3>${formatDay(day.dt)}</h3>
  <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png"
  alt=""
  width="42"'>
  <span class='max-temp'>${Math.round(day.temp.max)}??</span>
  <span class='min-temp'>${Math.round(day.temp.min)}??</span>
</div>
`
    }
  });

  forecastHtml = forecastHtml + `</div>`
  forecastEl.innerHTML = forecastHtml
}

function getForecast(coordinates) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`
  axios.get(apiUrl).then(showForecast)
}

// Search for the entered city
function searchCity(city) {
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
  axios.get(url).then(showWeather)
}

function handleSubmit(event) {
  event.preventDefault()
  let cityName = document.querySelector('#search-bar')
  searchCity(cityName.value)
}

// Show the entered city on a submit
form.addEventListener("submit", handleSubmit);

// Find current location
function searchLocation(position) {
  let lat = position.coords.latitude
  let lon = position.coords.longitude
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  axios.get(url).then(showWeather)
}

function getCurrentLocation(event) {
  event.preventDefault()
  navigator.geolocation.getCurrentPosition(searchLocation)
}

let currentLocationBtn = document.querySelector('#currentCityBtn')
currentLocationBtn.addEventListener('click', getCurrentLocation)



showDate();
searchCity('New York')