const searchbox = document.querySelector('.search-box');
const key = '8199d1cabcec8adf710f70c4a334dc32';
searchbox.addEventListener('keypress', setQuery);

class Weather {
  constructor(date, temp, minTemp, maxTemp, title, titleAbbr, city, country) {
    this.date = new Date(date[0], date[1], date[2]);
    this.temp = temp;
    this.min_temp = minTemp;
    this.max_temp = maxTemp;
    this.title = title;
    this.titleAbbr = titleAbbr;
    this.city = city;
    this.country = country;
  }
}

async function getLocation(loc) {
  try {
    const result = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?&q=London&appid=${key}`
    );

    const data = await result.json();

    return data[0].woeid;
  } catch (err) {
    console.log(err);
  }
}

async function getWeather(loc) {
  try {
    const result = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?&q=${loc}&appid=${key}`
    );

    const weatherData = await result.json();

    return weatherData;
  } catch (err) {
    alert(err);
  }
}

function getWeatherData(data) {
  const today = new Weather(
    data.consolidated_weather[0].applicable_date.split('-'),
    Math.round(data.consolidated_weather[0].the_temp),
    Math.round(data.consolidated_weather[0].min_temp),
    Math.round(data.consolidated_weather[0].max_temp),
    data.consolidated_weather[0].weather_state_name,
    data.consolidated_weather[0].weather_state_abbr,
    data.title,
    data.parent.title
  );

  const tomorrow = new Weather(
    data.consolidated_weather[1].applicable_date,
    Math.round(data.consolidated_weather[1].the_temp),
    Math.round(data.consolidated_weather[1].min_temp),
    Math.round(data.consolidated_weather[1].max_temp),
    data.consolidated_weather[1].weather_state_name,
    data.consolidated_weather[1].weather_state_abbr,
    data.title,
    data.parent.title
  );

  const afterTomorrow = new Weather(
    data.consolidated_weather[2].applicable_date,
    Math.round(data.consolidated_weather[2].the_temp),
    Math.round(data.consolidated_weather[2].min_temp),
    Math.round(data.consolidated_weather[2].max_temp),
    data.consolidated_weather[2].weather_state_name,
    data.consolidated_weather[2].weather_state_abbr,
    data.title,
    data.parent.title
  );

  return [today, tomorrow, afterTomorrow];
}

function setQuery(evt) {
  if (evt.keyCode == 13) {
    //console.log(searchbox.value);
    getResults(searchbox.value);
  }
}

function getResults(query) {
  if (/^[a-zA-Z]/.test(query.trim(' ')) && query) {
    //console.log(loc);
    getWeather(query).then((data) => {
      //console.log(data);
      //console.log(getWeatherData(data));
      displayResults(getWeatherData(data)[0]);
    });
  }
}

function displayResults(weather) {
  let city = document.querySelector('.location .city');
  city.innerText = `${weather.city}, ${weather.country}`;

  let date = document.querySelector('.location .date');
  date.innerText = dateBuilder(weather.date);

  let temp = document.querySelector('.current .temp');
  temp.innerHTML = `${Math.round(weather.temp)}<span>°c</span>`;

  let weather_el = document.querySelector('.current .weather');
  weather_el.innerText = weather.title;

  let hilow = document.querySelector('.hi-low');
  hilow.innerText = `${Math.round(weather.min_temp)}°c / ${Math.round(
    weather.max_temp
  )}°c`;

  console.log(weather.titleAbbr);
  document.body.style.backgroundImage = `url('img/${weather.titleAbbr}.jpg')`;
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

function weatherBalloon(cityID) {
  fetch()
    .then(function (resp) {
      return resp.json();
    }) // Convert data to json
    .then(function (data) {
      console.log(data);
    })
    .catch(function () {
      // catch any errors
    });
}

window.onload = function () {
  weatherBalloon(6167865);
};
