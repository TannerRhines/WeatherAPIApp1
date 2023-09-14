
const cityInput = document.querySelector(".city-input");

const searchButton = document.querySelector(".search-btn");


const API_KEY = "4fdabe75c801b0fdd1fbc854ba76e26a" // api key from openweather api 


const getWeatherDetails = (cityName, lat, lon) => {
    const WEATHER_API_URL = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
}

const getCityLocation = () => {
    const cityName = cityInput.value.trim(); 
    // remove any extra spaces when user enters city ^

    if (!cityName) return;

    const GEOCODING_API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`


    // enter city coordinates from API response
    fetch(GEOCODING_API_URL).then(res => res.json()).then(data => {
        if (!data.length) return alert(`no coordinates found for ${cityName}`);

        const { name, lat, lon } = data[0];
        getWeatherDetails(name, lat, lon);
    }).catch(() => {
        
    });
};



searchButton.addEventListener("click", getCityLocation);

