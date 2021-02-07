  let lat, lon,health ,primary, code;

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
    "1000" : "/pictures/clear_day.svg",
    "1001" : "/pictures/cloudy.svg",
    "1100" : "/pictures/mostly_clear_day.svg",
    "1101" : "/pictures/partly_cloudy_day.svg",
    "1102" : "/pictures/mostly_cloudy.svg",
    "2000" : "/pictures/fog.svg",
    "2100" : "/pictures/fog_light.svg",
    "3000" : "/pictures/wi-windy.svg",
    "3001" : "/pictures/wi-windy.svg",
    "3002" : "/pictures/wi-strong-wind.svg",
    "4000" : "/pictures/drizzle.svg",
    "4001" : "/pictures/rain.svg",
    "4200" : "/pictures/rain_light.svg",
    "4201" : "/pictures/rain_heavy.svg",
    "5000" : "/pictures/snow.svg",
    "5001" : "/pictures/flurries.svg",
    "5100" : "/pictures/snow_light.svg",
    "5101" : "/pictures/snow_heavy.svg",
    "6000" : "/pictures/freezing_drizzle.svg",
    "6001" : "/pictures/freezing_rain.svg",
    "6200" : "/pictures/freezing_rain_light.svg",
    "6201" : "/pictures/freezing_rain_heavy.svg",
    "7000" : "/pictures/ice_pellets.svg",
    "7101" : "/pictures/ice_pellets_heavy.svg",
    "7102" : "/pictures/ice_pellets_light.svg",
    "8000" : "/pictures/tstorm.svg",
    };

    codeWeather = {
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

    function weatherImage(weatherCode, time){
      for (weather in code){
        if (weatherCode == weather){
          //if(weatherCode == "1000"){
            //if(7 <= time <= 19){}
            //else{}}
            return code[weather]
          }
        }
      };
    

  if ('geolocation' in navigator) {
    console.log('geolocation available');
    navigator.geolocation.getCurrentPosition(async position => {
      let lat, lon, weather, today, date, time, dateTime;
      try {
        lat = position.coords.latitude;
        lon = position.coords.longitude;
        
        const api_url = `weather/${lat},${lon}`;
        const response = await fetch(api_url);
        const json = await response.json();
        
        console.log(lat,lon);
        //today = new Date();
        //date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        //time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        //const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        //dateTime = date+' '+time +' '+tz;
        weather = json.weather.data.timelines[0].intervals[0];
        var dt = new Date();
        
        dt.setTime(dt.getTime()+dt.getTimezoneOffset()*60*1000);
        //console.log(dt.getHours());
        var offset = -300; //Timezone offset for EST in minutes.
        today = new Date(dt.getTime() + offset*60*1000);
        date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        dateTime = date+' '+time + ' Eastern Standard Time (EST)';

        var img = document.createElement("img");
        img.src = weatherImage(weather.values.weatherCode, dt.getHours());
        img.setAttribute("height","80%");
        img.setAttribute("width","75%");
        img.setAttribute("alt", "No Image");
        img.setAttribute("id", "weather");
        console.log(weatherImage(weather.values.weatherCode, dt.getHours()));
        var src = document.getElementById("circle");
        src.appendChild(img);

        
        console.log(json.weather); //For debugging
        document.getElementById('summary').textContent = codeWeather[weather.values.weatherCode];
        document.getElementById('temp').textContent = weather.values.temperatureApparent;
        document.getElementById('aq_date').textContent = dateTime;
        
        document.getElementById('aq_aqi').textContent = weather.values.epaIndex;
        document.getElementById('aq_health').textContent = health[weather.values.epaHealthConcern];
        document.getElementById('aq_primary').textContent = primary[weather.values.epaPrimaryPollutant];
        
        console.log(json.location.results);
        loc = json.location.results[4];
        document.getElementById('city').textContent = loc.formatted_address;

        } catch (error) {
        console.error(error);

        };

        const data = {lat, lon, weather, loc};
        const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
          },
        body: JSON.stringify(data)
        };
        const db_response = await fetch('/api', options);
        const db_json = await db_response.json();

        });
  } 
  else {
    console.log('geolocation not available');
  }

