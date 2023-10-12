function formatDate(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];
  return `${day} ${hours}:${minutes}`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let day = date.getDay();
  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;

  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `
              <div class="col-2">
                <div class="weather-forecast-date">${formatDay(
                  forecastDay.time
                )}</div>
                <img
                  src="http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${
                    forecastDay.condition.icon
                  }.png"
                  alt=""
                  width="42"
                />
                <div class="weather-forecast-temperatures">
                  <span class="weather-forecast-temperature-max maximum" > ${Math.round(
                    forecastDay.temperature.maximum
                  )}° </span>
                  <span class="weather-forecast-temperature-min minimum" > ${Math.round(
                    forecastDay.temperature.minimum
                  )}° </span>
                </div>
              </div>`;

      maxCelsius = forecastDay.temperature.maximum;
      minCelsius = forecastDay.temperature.minimum;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apiKey = "0b46at2a4oea675f7c0b2d74a911c630";

  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?lon=${coordinates.longitude}&lat=${coordinates.latitude}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function displayWeather(response) {
  document.querySelector("#temperature").innerHTML = Math.round(
    response.data.temperature.current
  );
  document.querySelector("#feels-like").innerHTML =
    Math.round(response.data.temperature.feels_like) + "C°";
  document.querySelector("#city").innerHTML = response.data.city;
  document.querySelector("#description").innerHTML =
    response.data.condition.description;
  document.querySelector("#humidity").innerHTML =
    response.data.temperature.humidity;
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );
  document.querySelector("#date").innerHTML = formatDate(
    response.data.time * 1000
  );

  feelsC = response.data.temperature.feels_like;
  celsiusTemp = response.data.temperature.current;
  document
    .querySelector("#icon")
    .setAttribute(
      "src",
      `http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${response.data.condition.icon}.png`
    );
  document
    .querySelector("#icon")
    .setAttribute("alt", response.data.condition.description);

  getForecast(response.data.coordinates);
}

function search(city) {
  let apiKey = "0b46at2a4oea675f7c0b2d74a911c630";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;
  axios(apiUrl).then(displayWeather);
}

function handleSubmit(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#city-input");
  search(cityInputElement.value);
}

function displayFahrenheitTemp(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  fahrenheitLink.classList.add("active");
  celsiusLink.classList.remove("active");
  let fahrenheitTemp = (celsiusTemp * 9) / 5 + 32;
  temperatureElement.innerHTML = Math.round(fahrenheitTemp);
}

function displayCelsiusTemp(event) {
  event.preventDefault();

  let temperatureElement = document.querySelector("#temperature");
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  temperatureElement.innerHTML = Math.round(celsiusTemp);
}

function displayFahrenheitFeels(event) {
  event.preventDefault();

  let tempElement = document.querySelector("#feels-like");
  fahrenheitLink.classList.add("active");
  celsiusLink.classList.remove("active");
  let feelsF = (feelsC * 9) / 5 + 32;
  tempElement.innerHTML = Math.round(feelsF) + "F°";
}

function displayCelsiusFeels(event) {
  event.preventDefault();

  let tempElement = document.querySelector("#feels-like");
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  tempElement.innerHTML = Math.round(feelsC) + "C°";
}

function displayFahrenheitForecast() {
  let tempMaxElement = document.querySelectorAll("maximum");
  let tempMinElement = document.querySelectorAll("minimum");

  fahrenheitLink.classList.add("active");
  celsiusLink.classList.remove("active");

  let maxFahrenheit = (maxCelsius * 9) / 5 + 32;
  let minFahrenheit = (minCelsius * 9) / 5 + 32;
  tempMaxElement.innerHTML = Math.round(maxFahrenheit);
  tempMinElement.innerHTML = Math.round(minFahrenheit);
}

function displayCelsiusForecast() {
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  let tempMaxElement = document.querySelectorAll("maximum");
  let tempMinElement = document.querySelectorAll("minimum");

  tempMaxElement.innerHTML = Math.round(maxCelsius);
  tempMinElement.innerHTML = Math.round(minCelsius);
}

let feelsC = null;
let celsiusTemp = null;
let maxCelsius = null;
let minCelsius = null;

let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemp);
fahrenheitLink.addEventListener("click", displayFahrenheitFeels);
fahrenheitLink.addEventListener("click", displayFahrenheitForecast);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsiusTemp);
celsiusLink.addEventListener("click", displayCelsiusFeels);
celsiusLink.addEventListener("click", displayCelsiusForecast);

search("Paris");
