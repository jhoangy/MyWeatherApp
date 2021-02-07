let health,primary,code;
health = {
    "0" : "Good (0-50)",
    "1" : "Moderate (51-100)",
    "2" : "Unhealthy for Sensitive Groups (101-150)",
    "3" : "Unhealthy (151-200)",
    "4" : "Very Unhealthy (201-300)",
    "5" : "Hazardous (>301)",
    };

    primary = {
    "0" : "PM2.5",
    "1" : "PM10",
    "2" : "O3",
    "3" : "NO2",
    "4" : "CO",
    "5" : "SO2",
    };

    code = {
    "0" :"Unknown",
    "1000" : "Clear",
    "1001" : "Cloudy",
    "1100" : "Mostly Clear",
    "1101" : "Partly Cloudy",
    "1102" : "Mostly Cloudy",
    "2000" : "Fog",
    "2100" : "Light Fog",
    "3000" : "Light Wind",
    "3001" : "Wind",
    "3002" : "Strong Wind",
    "4000" : "Drizzle",
    "4001" : "Rain",
    "4200" : "Light Rain",
    "4201" : "Heavy Rain",
    "5000" : "Snow",
    "5001" : "Flurries",
    "5100" : "Light Snow",
    "5101" : "Heavy Snow",
    "6000" : "Freezing Drizzle",
    "6001" : "Freezing Rain",
    "6200" : "Light Freezing Rain",
    "6201" : "Heavy Freezing Rain",
    "7000" : "Ice Pellets",
    "7101" : "Heavy Ice Pellets",
    "7102" : "Light Ice Pellets",
    "8000" : "Thunderstorm",
    };

    // This example displays a marker at the center of Australia.
// When the user clicks the marker, an info window opens.
function initMap() {
    const CN_TOWER = { lat: 43.642567, lng: -79.387054 };
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 6,
      center: CN_TOWER,
    });
    map.setOptions({ minZoom: 5, maxZoom: 21 });
    getData(map);
    
  }

async function getData(map){
    const response = await fetch('/api')
    const data = await response.json();
    console.log(data);
    for (item of data){
        const location = {lat: parseFloat(item.lat), lng: parseFloat(item.lon)};
        const contentString =
    
        `<div>` +
        '<div>' +
        '</div>' +
        `<h1>${item.loc.formatted_address}</h1>` +
        '<div>' +
        `<p>I'm sitting out here at <b>${item.loc.formatted_address}</b> on
        this <b>${code[item.weather.values.weatherCode]}</b> day and it feels like <b>${item.weather.values.temperatureApparent}</b>&deg;C
        outside.<br /><br />
        <span id="air">
          The AQI of <b>${item.loc.formatted_address}</b>
           is <b>${item.weather.values.epaIndex}</b> with a health concern of <b>${health[item.weather.values.epaHealthConcern]}</b> and a primary pollutant of
          <b>${primary[item.weather.values.epaPrimaryPollutant]}</b>.
        </span></p>` +
        `<p>(${item.weather.startTime}).</p>` +
        "</div>" +
        "</div>";
        const infowindow = new google.maps.InfoWindow({
        content: contentString,
        });
        const marker = new google.maps.Marker({
        position: location,
        map,
        title: `${item.loc.formatted_address}`,
        });
        marker.addListener("click", () => {
            infowindow.open(map, marker);
            });
        }
    }