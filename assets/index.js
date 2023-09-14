const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const locationButton = document.querySelector(".location-btn");
const API_KEY = "4fdabe75c801b0fdd1fbc854ba76e26a";

const currentWeatherDiv = document.querySelector(".current-weather");
const weatherCardsDiv = document.querySelector(".weather-cards");
const historyList = document.querySelector('.history-list');


// updated city history in local storage
const updateCityHistory = (cityName) => {
    let cityHistory = JSON.parse(localStorage.getItem('cityHistory')) || [];
    if (!cityHistory.includes(cityName)) {
        cityHistory.push(cityName);
        localStorage.setItem('cityHistory', JSON.stringify(cityHistory));
    }
    displayHistory();
};


// gets city names out of local storage
const displayHistory = () => {
    historyList.innerHTML = '';  // Clear old history
    let cityHistory = JSON.parse(localStorage.getItem('cityHistory')) || [];

    cityHistory.forEach(city => {
        const historyItem = document.createElement('li');
        historyItem.textContent = city;
        historyItem.addEventListener('click', () => getCityLocation(city));
        historyList.appendChild(historyItem);
    });
};


// creates the weather cards that will be displayed with a city 
const createWeatherCard = (cityName, weatherItem, index) => {
    const readableDate = new Date(weatherItem.dt_txt).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const temp = (weatherItem.main.temp - 273.15).toFixed(2);
    const windSpeed = weatherItem.wind.speed;
    const humidity = weatherItem.main.humidity;
    const icon = weatherItem.weather[0].icon;
    const description = weatherItem.weather[0].description;

    if (index === 0) {
        return `
            <div class="details">
                <h2>${cityName} ${readableDate}</h2>
                <h4>Temperature: ${temp} °C</h4>
                <h4>Wind: ${windSpeed} m/s</h4>
                <h4>Humidity: ${humidity} %</h4>
            </div>
            <div class="icon">
                <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="weather-icon">
                <h4>${description}</h4>
            </div>`;
    } else {
        return `
            <li class="card">
                <h3>${readableDate}</h3>
                <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="weather-icon">
                <h4>Temp: ${temp} °C</h4>
                <h4>Wind: ${windSpeed} m/s</h4>
                <h4>Humidity: ${humidity} %</h4>
            </li>`;
    }
};


// get the 5 day forecast details
const getWeatherDetails = (cityName, lat, lon) => {
    const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    fetch(WEATHER_API_URL)
        .then(res => res.json())
        .then(data => {
            const uniqueForecastDays = new Set();
            const fiveDaysForecast = [];

            data.list.forEach(forecast => {
                const forecastDate = new Date(forecast.dt_txt).getDate();
                if (!uniqueForecastDays.has(forecastDate) && uniqueForecastDays.size < 6) {
                    uniqueForecastDays.add(forecastDate);
                    fiveDaysForecast.push(forecast);
                }
            });

            updateCityHistory(cityName);

            currentWeatherDiv.innerHTML = "";
            weatherCardsDiv.innerHTML = "";

            fiveDaysForecast.forEach((weatherItem, index) => {
                const cardHTML = createWeatherCard(cityName, weatherItem, index);
                if (index === 0) {
                    currentWeatherDiv.insertAdjacentHTML("beforeend", cardHTML);
                } else {
                    weatherCardsDiv.insertAdjacentHTML("beforeend", cardHTML);
                }
            });
        })
        .catch(() => {
            alert("Error occurred while fetching forecast");
        });
};


// get city location
const getCityLocation = (cityNameInput) => {
    const cityName = cityNameInput || cityInput.value.trim();
    if (!cityName) return;

    const GEOCODING_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;
    fetch(GEOCODING_API_URL)
        .then(res => res.json())
        .then(data => {
            if (!data.length) return alert(`No coordinates found for ${cityName}`);
            const { name, lat, lon } = data[0];
            getWeatherDetails(name, lat, lon);
        })
        .catch(() => {
            alert("Error occurred while fetching coordinates");
        });
};


// get user coordinates
const getUserCoordinates = () => {
    navigator.geolocation.getCurrentPosition(
        position => {
            const { latitude, longitude } = position.coords;
            const REVERSE_GEOCODING_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;

            fetch(REVERSE_GEOCODING_URL)
                .then(res => res.json())
                .then(data => {
                    const { name } = data[0];
                    getWeatherDetails(name, latitude, longitude);
                })
                .catch(() => {
                    alert("Error occurred while fetching coordinates");
                });
        },
        error => {
            console.log(error);
        }
    );
};

searchButton.addEventListener("click", () => getCityLocation());
locationButton.addEventListener("click", getUserCoordinates);

// display the search history
displayHistory();
