const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const API_KEY = "4fdabe75c801b0fdd1fbc854ba76e26a";  // API key from OpenWeather API





const getWeatherDetails = (cityName, lat, lon) => {
    const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;


    fetch(WEATHER_API_URL)
    .then(res => res.json())
    .then(data => {
       

        const uniqueForecastDays = [];
        const fiveDaysForecast = data.list.filter(forecast => {

            const forecastDate = new Date(forecast.td_txt).getDate();
            if(!uniqueForecastDays.includes(forecastDate)) {
                return uniqueForecastDays.push(forecastDate);
            }

        })
        console.log(fiveDaysForecast);
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
