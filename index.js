const btn= document.getElementById("btn");
const inOne= document.getElementById("inOne");
const content= document.getElementById("content");
const container=document.getElementById("container");
const apiKey= "977bd3f7a50bcdb8c858c601775bd500";

container.addEventListener("submit",async event =>{
    event.preventDefault();
const city= inOne.value;
if(city)
{
 const  weatherData= await getWeatherData(city);
 displayWeatherData(weatherData);

}else{
    
displayErrorMessage("Please Enter a city Name");
return null;
}
});

function getWeatherEmoji(id) {
    switch (true) {
        case (id >= 200 && id < 300):
            return "⚡"; // Gewitter
        case (id >= 300 && id < 500): 
             return "☔"; // Regen
        case (id >= 500 && id < 600):
            return "☔"; // Regen
        case (id >= 600 && id < 700):
            return "❄"; // Schnee
        case (id > 700 && id <= 800):
            return "🌞"; // Klarer Himmel
        case (id > 800 && id < 900):
            return " ⛅"; // Bewölkt
        default:
      //      console.log(id);
            return "❓"; // Unbekannt
    }
}

async function getWeatherData(city)
{
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const response= await fetch(url);
    console.log(response);
    if(!response.ok)
    {
        displayErrorMessage("Failed to fetch the data 😕");
        return null;
    }else{
    const data=await response.json();
  //  console.log(data);
    return data;
}
}
function displayWeatherData(data)
{
   const {name:city,main:{temp,humidity},weather:[{description,id}]}=data;
   content.textContent  = " ";
   const name=document.createElement("h1")
   const tempratur=document.createElement("p");
   const humi=document.createElement("p");
   const weatherEmoji=document.createElement("p");
   const weatherDescription=document.createElement("p");
   name.textContent.textContent=city;
   tempratur.textContent=`Tempratur: ${temp}`;
   humi.textContent=`Humidity: ${humidity}`;
   weatherDescription.textContent=description;
   weatherEmoji.textContent=  getWeatherEmoji(id);
   tempratur.classList.add("text1");
   humi.classList.add("text1");
   weatherEmoji.classList.add("text1");
   weatherDescription.classList.add("text1");
   content.appendChild(name);
   content.appendChild(tempratur);
   content.appendChild(humi);
   content.appendChild(weatherEmoji);
   content.appendChild(weatherDescription);
}
function displayErrorMessage(message)
{
    const errorMsg= document.createElement("P");
    errorMsg.textContent=message;
    errorMsg.classList.add("text1");
    content.appendChild(errorMsg);
}