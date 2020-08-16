class Weather {
  constructor(date, temp, minTemp, maxTemp, weatherTitle, city, country) {
    this.date = date;
    this.temp = temp;
    this.minTemp = minTemp;
    this.maxTemp = maxTemp;
    this.weatherTitle = weatherTitle;
    this.city = city;
    this.country = country;
  }
}

async function getLocation(loc) {
  try {
    const result = await fetch(
      `https://cors-anywhere.herokuapp.com/https://www.metaweather.com/api/location/search/?query=${loc}`
    );
    const data = await result.json();
    console.log(data);

    getWeather(data[0].woeid);
  } catch (err) {
    console.log(err);
  }
}

async function getWeather(woeid) {
  try {
    const result = await fetch(
      `https://cors-anywhere.herokuapp.com/https://www.metaweather.com/api/location/${woeid}/`
    );
    const data = await result.json();
    console.log(data);
    console.log(getWeatherData(data));
  } catch (err) {
    alert(err);
  }
}

function getWeatherData(data) {
  const today = new Weather(
    data.consolidated_weather[0].applicable_date,
    Math.round(data.consolidated_weather[0].the_temp),
    Math.round(data.consolidated_weather[0].min_temp),
    Math.round(data.consolidated_weather[0].max_temp),
    data.consolidated_weather[0].weather_state_name,
    data.title,
    data.parent.title
  );

  const tomorrow = new Weather(
    data.consolidated_weather[1].applicable_date,
    Math.round(data.consolidated_weather[1].the_temp),
    Math.round(data.consolidated_weather[1].min_temp),
    Math.round(data.consolidated_weather[1].max_temp),
    data.consolidated_weather[1].weather_state_name,
    data.title,
    data.parent.title
  );

  const afterTomorrow = new Weather(
    data.consolidated_weather[2].applicable_date,
    Math.round(data.consolidated_weather[2].the_temp),
    Math.round(data.consolidated_weather[2].min_temp),
    Math.round(data.consolidated_weather[2].max_temp),
    data.consolidated_weather[2].weather_state_name,
    data.title,
    data.parent.title
  );

  return [today, tomorrow, afterTomorrow];
}

getLocation('London');
/*
const api = {
  key: 'afaf9f8d48cff6cafd32e23220bcfdbf',
  base: 'https://api.openweathermap.org/data/2.5/',
};

const searchbox = document.querySelector('.search-box');
searchbox.addEventListener('keypress', setQuery);

function setQuery(evt) {
  if (evt.keyCode == 13) {
    getResults(searchbox.value);
  }
}

function getResults(query) {
  fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
    .then((weather) => {
      return weather.json();
    })
    .then(displayResults);
}

function displayResults(weather) {
  let city = document.querySelector('.location .city');
  city.innerText = `${weather.name}, ${weather.sys.country}`;

  let now = new Date();
  let date = document.querySelector('.location .date');
  date.innerText = dateBuilder(now);

  let temp = document.querySelector('.current .temp');
  temp.innerHTML = `${Math.round(weather.main.temp)}<span>°c</span>`;

  let weather_el = document.querySelector('.current .weather');
  weather_el.innerText = weather.weather[0].main;

  let hilow = document.querySelector('.hi-low');
  hilow.innerText = `${Math.round(weather.main.temp_min)}°c / ${Math.round(
    weather.main.temp_max
  )}°c`;
}

function dateBuilder(d) {
  let months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  let days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  let day = days[d.getDay()];
  let date = d.getDate();
  let month = months[d.getMonth()];
  let year = d.getFullYear();

  return `${day} ${date} ${month} ${year}`;
}
*/
