const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const API_KEY = "4fdabe75c801b0fdd1fbc854ba76e26a";  // API key from OpenWeather API



const createWeatherCard = (weatherItem) => {
    return `<li class="card">
            <h3>(${weatherItem.dt_txt.split(" ")[0]}) </h3>
            <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="weather-icon">
            <h4>Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)} °C </h4>
            <h4>Wind: ${weatherItem.wind.speed} m/s</h4>
            <h4>Humidity: ${weatherItem.main.humidity}</h4>
            </li>`;
}

const getWeatherDetails = (cityName, lat, lon) => {
    const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

    fetch(WEATHER_API_URL)
    .then(res => res.json())
    .then(data => {
        const uniqueForecastDays = new Set();
        const fiveDaysForecast = [];

        // Populate the uniqueForecastDays Set and fiveDaysForecast array
        data.list.forEach(forecast => {
            const forecastDate = new Date(forecast.dt_txt).getDate(); 

            if (!uniqueForecastDays.has(forecastDate) && uniqueForecastDays.size < 6) {
                uniqueForecastDays.add(forecastDate);
                fiveDaysForecast.push(forecast);
            }
        });

        console.log(fiveDaysForecast);

        fiveDaysForecast.forEach(weatherItem => {
            createWeatherCard(weatherItem);
        })
    })
    .catch(() => {
        alert("Error occurred while fetching forecast");
    });
};


const getCityLocation = () => {
    const cityName = cityInput.value.trim(); // Remove any extra spaces when user enters city
    if (!cityName) return;
    const GEOCODING_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`; // Use HTTPS
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

searchButton.addEventListener("click", getCityLocation);
