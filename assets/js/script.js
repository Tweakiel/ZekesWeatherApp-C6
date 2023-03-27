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
var apiKey = "2a285d52250ef104b297fef03b98f070";

let searchBtn = document.getElementById("searchButton");
let userInput = document.getElementById("cityInput");
let userHistory = document.getElementById("search-history");
let currentWeatherDiv = document.getElementById("current-weather");

//weather

let getweatherData = async function (city) {
  var cityUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;
  try {
    const response = await fetch(cityUrl);
    const data = await response.json();
    if (data.cod === "200") {
      console.log(data);
      return data;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

//create a weather class to store the data
//this stores the data from the api
class Weather {
  constructor(city, date, temp, humidity, wind) {
    this.city = city;
    this.date = date;
    this.temp = temp;
    this.humidity = humidity;
    this.wind = wind;
  }

  //create a function to update the current weather
  updateCurrentWeather = function (data) {
    const icon = document.createElement("img");
    icon.src = `https://openweathermap.org/img/wn/${data.list[0].weather[0].icon}@2x.png`;
    //this.currentWeatherDiv.style.border = "solid 1px black";

    this.city = data.city.name;
    this.date = new Date(data.list[0].dt_txt);
    this.temp = data.list[0].main.temp;
    this.humidity = data.list[0].main.humidity;
    this.wind = data.list[0].wind.speed;

    console.log(this.city);
    console.log(this.date);
    console.log(this.temp);
    console.log(this.humidity);
    console.log(this.wind);

    const month = this.date.getMonth() + 1;
    const day = this.date.getDate();
    const year = this.date.getFullYear();

    console.log(month, day, year);
    // convert temp from K to C
    const tempCelsius = this.temp - 273.15;

    // create city and date elements
    let cityElement = document.querySelector("#city");
    if (!cityElement) {
      cityElement = document.createElement("h3");
      cityElement.id = "city";
      currentWeatherDiv.appendChild(cityElement);
    }
    cityElement.textContent = `${this.city} (${month}/${day}/${year})`;
    cityElement.appendChild(icon);

    // create temp element
    let tempElement = document.querySelector("#temp");
    if (!tempElement) {
      tempElement = document.createElement("p");
      tempElement.id = "temp";
      currentWeatherDiv.appendChild(tempElement);
    }
    tempElement.textContent = `Temperature: ${tempCelsius.toFixed(1)} °C`;

    // create humidity element
    let humidityElement = document.querySelector("#humidity");
    if (!humidityElement) {
      humidityElement = document.createElement("p");
      humidityElement.id = "humidity";
      currentWeatherDiv.appendChild(humidityElement);
    }
    humidityElement.textContent = `Humidity: ${this.humidity}%`;

    // create wind element
    let windElement = document.querySelector("#wind");
    if (!windElement) {
      windElement = document.createElement("p");
      windElement.id = "wind";
      currentWeatherDiv.appendChild(windElement);
    }
    windElement.textContent = `Wind Speed: ${this.wind} MPH`;
  }; //end of update current weather

  //create a function to update the forecast
  updateForecast = function (data) {
    // filter the data to get the forecast for 12:00pm
    const filteredData = data.list.filter((item) =>
      item.dt_txt.includes("12:00:00")
    );
    console.log(filteredData);

    //create a for loop to create the forecast cards but also check if it exists before creating it
    for (let i = 0; i < filteredData.length; i++) {
      let forecastDiv = document.getElementById(`forecast${i}`);
      if (!forecastDiv) {
        forecastDiv = document.createElement("div");
        forecastDiv.classList.add("card", "col-2", "m-2");
        forecastDiv.id = `forecast${i}`;
        document.querySelector("#forecast").appendChild(forecastDiv);
      }

      // create date element and check if it exists before creating it
      let forecastDate = document.getElementById(`date${i}`);
      if (!forecastDate) {
        forecastDate = document.createElement("h5");
        forecastDate.id = `date${i}`;
        forecastDiv.appendChild(forecastDate);
      }
      forecastDate.textContent = new Date(
        filteredData[i].dt_txt
      ).toLocaleDateString();

      // create icon element and check if it exists before creating it
      let forecastIcon = document.getElementById(`icon${i}`);
      if (!forecastIcon) {
        forecastIcon = document.createElement("img");
        forecastIcon.id = `icon${i}`;
        forecastDiv.appendChild(forecastIcon);
      }
      forecastIcon.src = `https://openweathermap.org/img/wn/${filteredData[i].weather[0].icon}.png`;

      // create temp element and check if it exists before creating it and set the temp to C
      let forecastTemp = document.getElementById(`temp${i}`);
      if (!forecastTemp) {
        forecastTemp = document.createElement("p");
        forecastTemp.id = `temp${i}`;
        forecastDiv.appendChild(forecastTemp);
      }
      forecastTemp.textContent = `Temp: ${(
        filteredData[i].main.temp - 273.15
      ).toFixed(1)} °C`;

      // create humidity element and check if it exists before creating it
      let forecastHumidity = document.getElementById(`humidity${i}`);
      if (!forecastHumidity) {
        forecastHumidity = document.createElement("p");
        forecastHumidity.id = `humidity${i}`;
        forecastDiv.appendChild(forecastHumidity);
      }
      forecastHumidity.textContent = `Humidity: ${filteredData[i].main.humidity}%`;
    }
  }; //end of update forecast
} //end of weather class

//event listener for search button
searchBtn.addEventListener("click", function (event) {
  event.preventDefault();
  let city = userInput.value;
  getweatherData(city).then((data) => {
    let weather = new Weather(data);
    weather.updateCurrentWeather(data);
    weather.updateForecast(data);
    userInput.value = "";
  });

  //create a button for the search history
  let searchHistoryBtn = document.createElement("button");
  searchHistoryBtn.classList.add("btn", "btn-primary", "m-2");
  searchHistoryBtn.textContent = city;
  searchHistoryBtn.addEventListener("click", function (event) {
    event.preventDefault();
    let city = searchHistoryBtn.textContent;
    getweatherData(city).then((data) => {
      let weather = new Weather(data);
      weather.updateCurrentWeather(data);
      weather.updateForecast(data);
    });
  });
  userHistory.appendChild(searchHistoryBtn);

  // add history to local storage
  let history = JSON.parse(localStorage.getItem("history")) || [];
  history.push(city);
  localStorage.setItem("history", JSON.stringify(history));
});
