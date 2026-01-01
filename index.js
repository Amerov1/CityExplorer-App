google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);

//HTML Elements
const btn = document.getElementById("iconSearch");
const inOne = document.getElementById("inputId");
const content = document.querySelector("#WeatherCard");
const mySearchEngine = document.querySelector(".mySearchEngine");
const suggestions = document.querySelector("#suggestions");
const iconWeather = document.querySelector("#iconWeather");
const tempID = document.querySelector("#tempID");
const windID = document.querySelector("#windID");
const descriptionWeather = document.querySelector("#descriptionID");
const img= document.getElementById("CityImg");
const Info= document.getElementById("MoreInfo");
const mode= document.getElementById("mode");
const myframe= document.getElementById("myframe");

// API keys
const WeatherKey= "your Key";//openweathermap API
const ImgKey="your Key";//pixabay API
const PopulationKey="your Key"//API Ninjas API

 /*   inOne.addEventListener("keydown",async event =>{
    
       if(event.key=="Enter")
       {
            const city= inOne.value;
            inOne.value="";
            if(city)
            {
            const  weatherData= await getWeatherData(city);
            displayWeatherData(weatherData);
            }else{
                
            displayErrorMessage("Please Enter a city Name");
            return null;
            }
        }
                                                    });*/

    /*
    * Handles user input for city search.
    * Fetches city suggestions from the Photon API
    * and displays them dynamically while typing.
    */
    inOne.addEventListener("input",async()=>{
        const query= inOne.value.trim();

        if(query.length<2)
        {
            suggestions.style.display ="none";
            suggestions.innerHTML="";
            return;
        }
        else{
            suggestions.style.display ="block";
        }
        const url = `https://photon.komoot.io/api/?q=${query}&limit=5`;
        const resp= await fetch(url);
        const data= await  resp.json();
        showSuggestions(data.features);
        

    });
        /*
    *after Hiting the search icon
    it will call the function display the result
    */
    btn.addEventListener("click",async () =>{
        const city= inOne.value;
        GetImage(city);
        setframe(city);
        await getCityText(city.split(", ")[0])
        getCountryCurrency(city.split(", ")[1]);
        inOne.value="";
        if(city)
        {
        const  weatherData= await getWeatherData(city);
        displayWeatherData(weatherData);
        GetPopulation(city.split(", ")[1])
        }else{
            
        displayErrorMessage("Please Enter a city Name");
        return null;
        }
    });
    //switch between light and dark mode
    mode.addEventListener("click",()=>{
            document.getElementById("body").className[0]==null? enableDarkmode():disableDarkmode();
    })
    function enableDarkmode()
    {
        document.getElementById("body").classList.add("darkmode");
    }
    function disableDarkmode()
    {
        document.getElementById("body").classList.remove("darkmode");
    }
    // Updates the iframe to show the Google Maps location of the specified city.
    function setframe(city)
    {
    myframe.src=`https://www.google.com/maps?q=${city.split(", ")[0]}&output=embed`;
    }
    / Fetches a photo of the specified city from the Pixabay API and sets it as the source of the img element.
    function GetImage(cityname)
    {
        const url= `https://pixabay.com/api/?key=${ImgKey}&q=${cityname}, &image_type=photo`;
        fetch(url)
        .then(response => response.json())
        .then(data=>{
            img.src=data.hits[0].webformatURL;
                    } )
        .catch (err =>console.error("Error:",err))
    }
 // Retrieves currency information and the national flag for a given country using the Rest Countries API.
// Then calls showCurrency() to display the results.
    function getCountryCurrency(countryName) {
    const url = `https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}`;

    fetch(url)
        .then(res => res.json())
        .then(data => {
        const country = data[0];

        const currencies = country.currencies;
        const currencyCode = Object.keys(currencies)[0];
        const currency = currencies[currencyCode];
// Pass currency details and flag image to the display function
        showCurrency(
            currency.name,
            currency.symbol,
            currencyCode,
            country.flags.png
        );
        })
        .catch(err => console.error("Country not found", err));
    }
function showCurrency(name, symbol, code, flag) {
document.getElementById("flag").src = flag;
document.getElementsByClassName("currency-name")[0].textContent=name;
document.getElementsByClassName("currency-symbol")[0].textContent=symbol;
}
//Displays a dropdown list of autocomplete suggestions as the user types.
function showSuggestions(results) {
    suggestions.innerHTML = "";
        results.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item.properties.name + ", " + item.properties.country;
        li.addEventListener("click", () => {
            inOne.value = item.properties.name + ", " + item.properties.country;
            suggestions.innerHTML = "";
            suggestions.style.display="none";
        });
        suggestions.appendChild(li);
    });}
  // Returns a Bootstrap icon class for the given weather ID.
    function getWeatherEmoji(id) {
        switch (true) {
            case (id >= 200 && id < 300):
                return "bi bi-lightning-charge"; // Blitz
            case (id >= 300 && id < 500): 
                return "bi bi-cloud-lightning-rain"; // Regen mit Blitz
            case (id >= 500 && id < 600):
                return "bi bi-cloud-drizzle"; // Regen
            case (id >= 600 && id < 700):
                return "bi bi-snow2"; // Schnee
            case (id > 700 && id <= 800):
                return "bi bi-brightness-high"; // Klarer Himmel
            case (id > 800 && id < 900):
                return " bi bi-cloud-sun "; // Bewölkt
            default:
        //      console.log(id);
                return "❓"; // Unbekannt
        }
    }
 // Fetches current weather data for a city from OpenWeatherMap API
    async function getWeatherData(city)
    {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WeatherKey}&units=metric`;
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
    content.style.display= "block";
    const {name:city,main:{temp},wind:{speed} ,weather:[{description,id}]}=data;
    iconWeather.className= getWeatherEmoji(id);
    tempID.textContent=`${temp} °C`; 
    windID.textContent =`Wind: ${speed} m/s`; 
    descriptionWeather.textContent=`${description}`; 
    }

    function displayErrorMessage(message)
    {
        content.style.display= "block";
        iconWeather.className= "bi bi-exclamation-triangle"
        descriptionWeather.textContent=message;
    }

    function GetPopulation(city)
    {
    const url = `https://api.api-ninjas.com/v1/population?country=${city}`;
                fetch(url,
                            {
                            headers: {
                                "X-Api-Key": `${PopulationKey}`
                            }
                            }
                        ).then(res =>res.json())
                         .then(data=>{console.log(data.historical_population);
                                drawChart(data.historical_population, city)})
                         .catch(err=>console.error("Error: ",err));
            
    }
    function drawChart(datapopulation,country) {

        const dataArray = [['Year', 'Population']];
        datapopulation.slice(0, 5).forEach(item => {
                        dataArray.push([item.year, item.population]);
                        });
            var data = google.visualization.arrayToDataTable(dataArray);
            var options = {
                            title: `${country} Population over Years`,
                            curveType: 'function',
                            legend: { position: 'bottom' }
                        };

        var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

        chart.draw(data, options);
    }
    // Fetches information about a city from the Wikipedia API.
    async function getCityText(city) {
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(city)}`;
    const res = await fetch(url);
    const data = await res.json();
    Info.textContent=`${data.extract}`;
    }
