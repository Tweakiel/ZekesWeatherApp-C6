/*GIVEN a weather dashboard with form inputs
WHEN I search for a city
THEN I am presented with current and future conditions for that city and that city is added to the search history
WHEN I view current weather conditions for that city
THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, and the wind speed
WHEN I view future weather conditions for that city
THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
WHEN I click on a city in the search history
THEN I am again presented with current and future conditions for that city*/

//set variables
//api key
var apiKey="2a285d52250ef104b297fef03b98f070";

//template literals for later GLOBAL

var cityUrl=`http://api.openweathermap.org/geo/1.0/direct?q=${cityInput}&appid=${apiKey}`
cityInput=$('cityInput').val();
var searchBtn=document.getElementById('searchButton');


$(searchBtn).on('click', function (){


    fetchCity();
}) 

function fetchCity() {

    fetch(cityUrl, { method: 'GET' })
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        if (data.list[0]!==undefined) {

          const { lat, lon } = data.list[0].coord;
          cityLat = lat;
          cityLon = lon;

          console.log(this)

        } else {
          alert('City not found, please try again.');
        }
      });
  }







