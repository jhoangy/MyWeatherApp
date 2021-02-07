const express = require('express');
const Datastore = require('nedb');
const fetch = require('node-fetch');
require('dotenv').config();
require('console.json')

console.log(process.env);

const app = express(); 
app.listen(3000, () => console.log('listening at 3000'));
app.use(express.static('public'));
app.use(express.json({limit: '1mb'}));

const database = new Datastore('database.db');
database.loadDatabase();

app.get('/api', (request, response) => {
    database.find({},(err, data) => {
        if(err){
            response.end();
            return;
        }
        response.json(data);
    });
});

app.post('/api',(request, response) => {
    console.log('I got a request!');
    const data = request.body;
    const timestamp = Date.now();
    data.timestamp = timestamp;
    database.insert(data);
    response.json(data);
});

app.get('/weather/:latlon', async (request, response) => {
    console.log(request.params);
    const latlon = request.params.latlon.split(',');
    console.log(latlon);
    const lat = latlon[0];
    const lon = latlon[1];
    console.log(lat,lon);
    const weather_api_key = process.env.WEATHER_API_KEY;
    const location_api_key = process.env.LOCATION_API_KEY;

    const weather_url = `https://data.climacell.co/v4/timelines?location=${lat}%2C${lon}&fields=weatherCode%2CtemperatureApparent%2CepaIndex%2CepaPrimaryPollutant%2CepaHealthConcern%2C&timesteps=1h&units=metric&apikey=${weather_api_key}`;

    const weather_response = 
    await fetch(weather_url, {
        "method": "GET",
        "headers": {
            "content-type": "application/json"
        }
      });
    const weather_json = await weather_response.json();

    const loc_url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${location_api_key}`;

    const loc_response = await fetch(loc_url);
    const loc_json = await loc_response.json();
    
    const data ={
        weather: weather_json,
        location: loc_json
    };

    response.json(data);
});