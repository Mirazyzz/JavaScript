fetch(
  'https://cors-anywhere.herokuapp.com/https://www.metaweather.com/api/location/44418/'
)
  .then((result) => {
    console.log(result);
    return result.json();
  })
  .then((data) => {
    console.log(data);
  })
  .catch((error) => console.log(error));
