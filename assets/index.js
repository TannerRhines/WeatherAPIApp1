
const cityInput = document.querySelector(".city-input");

const searchButton = document.querySelector(".search-btn");


const API_KEY = "4fdabe75c801b0fdd1fbc854ba76e26a" // api key from openweather api 

const getCityLocation = () => {
    const cityName = cityInput.value.trim(); 
    // remove any extra spaces when user enters city ^

    if (!cityName) return;

    const GEOCODING_API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${API_KEY}`

    fetch(GEOCODING_API_URL).then(res => res.json()).then(data => {
        console.log(data)
    }).catch(() => {
        alert("error occured when fetching coordinates");
    });
};



searchButton.addEventListener("click", getCityLocation);

