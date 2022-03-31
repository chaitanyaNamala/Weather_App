// api key : 2fd749856fad42c987cf4facaeb3f4bb

//Select Elements
const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temperature-value p");
const descElement = document.querySelector(".temperature-description");
const locationElement = document.querySelector(".location p");
const notificationElement = document.querySelector(".notification");

//App data
const weather = {};

weather.temperature = {
    unit : "celsius"
}

//App Consts and vars
const KELVIN = 273;
//API Key
const key = "2fd749856fad42c987cf4facaeb3f4bb";

//Check if Browser supports Geolocation
if('geolocation' in navigator){
    navigator.geolocation.getCurrentPosition(setPosition, showError);
}else{
    notificationElement.style.display = "block";
    notificationElement.innerHTML = "<p>Browser doesn't Support Geolocation</p>";
}

//Set User's Position
function setPosition(position){
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

     getWeather(latitude,longitude);
}

//Show Error when there is an issue with Geolocaion service
function showError(error){
    notificationElement.style.display = "block";
    notificationElement.innerHTML = `<p> ${error.message}</p>`;
}

//Get Weather from api provider
function getWeather(latitude,longitude){
    let api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;
   
    //console.log(api);

    fetch(api)
       .then(function(response){
           let data = response.json();
           return data;
        })
        .then(function(data){
            weather.temperature.value = Math.floor(data.main.temp - KELVIN);
            weather.description = data.weather[0].description;
            weather.iconId = data.weather[0].icon;
            weather.city = data.name;
            weather.country = data.sys.country;        
        })
        .catch((err)=> console.log(err))
        .then(function(){
            displayweather();
        });
}

//Display weather to UI
function displayweather(){
    iconElement.innerHTML = `<img src="icons/${weather.iconId}.png"/>`;
    tempElement.innerHTML = `${weather.temperature.value}&deg<span>C</span>`;
    descElement.innerHTML = weather.description;
    locationElement.innerHTML = `${weather.city},${weather.country}`; 
}

// C to F conversion
function celsiusToFahrenheit(temperature){
     return (temperature * 9/5) + 32;
}

//When the user clicks on the temperature element
tempElement.addEventListener("click", function(){
   if(weather.temperature.value === undefined) return;

   if(weather.temperature.unit == "celsius"){
       let fahrenheit = celsiusToFahrenheit(weather.temperature.value);
       fahrenheit = Math.floor(fahrenheit);

       tempElement.innerHTML =`${fahrenheit}&deg<span>F</span>`;
       weather.temperature.unit = "fahrenheit";
   }else{
       tempElement.innerHTML = `${weather.temperature.value}&deg<span>C</span>`;
   }
});