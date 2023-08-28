const searchButton = document.querySelector(".search-btn");

const cityInput = document.querySelector(".search-btn");


const getCityLocation = () => {
    const cityName = cityInput.value.trim(); 
    // remove any extra spaces when user enters city ^

    if (cityName) return;

    console.log(cityName);
}


searchButton.addEventListener("click", getCityLocation);

