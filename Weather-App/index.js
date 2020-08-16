getLocation('London').then((loc) =>
  getWeather(loc).then((data) => console.log(getWeatherData(data)))
);
