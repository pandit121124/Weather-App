import { Oval } from 'react-loader-spinner';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFrown } from '@fortawesome/free-solid-svg-icons';
import './App.css';

function GfGWeatherApp() {
  const [input, setInput] = useState('');
  const [weather, setWeather] = useState({
    loading: false,
    data: null,
    error: false,
  });
  const [satelliteImageUrl, setSatelliteImageUrl] = useState('');
  const [backgroundImage, setBackgroundImage] = useState(null);

  const toDateFunction = () => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ];
    const WeekDays = [
      'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
    ];
    const currentDate = new Date();
    const date = `${WeekDays[currentDate.getDay()]} ${currentDate.getDate()} ${months[currentDate.getMonth()]}`;
    return date;
  };

  useEffect(() => {
    if (weather.data) {
      const { lon, lat } = weather.data.coord;
      

      axios.get('https://api.nasa.gov/planetary/earth/imagery', {
        params: {
          lon,
          lat,
          date: new Date().toISOString().split('T')[0],
          dim: 0.1,
          api_key: nasaApiKey,
        },
      }).then(response => {
        setSatelliteImageUrl(response.data.url);
      }).catch(error => {
        console.error('NASA API call error:', error);
        setSatelliteImageUrl('');
      });

     
      const weatherCondition = weather.data.weather[0].main.toLowerCase();
    
    }
  }, [weather.data]);

  const fetchWeatherData = async (city) => {
    const weatherApiKey = 'f00c38e0279b7bc85480c3fe775d518c';

    try {
      const weatherResponse = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
        params: {
          q: city,
          units: 'metric',
          appid: weatherApiKey,
        },
      });
      const weatherData = weatherResponse.data;
      setWeather({ data: weatherData, loading: false, error: false });
    } catch (error) {
      console.error('OpenWeatherMap API call error:', error);
      setWeather({ data: null, loading: false, error: true });
    }
  };

  const search = async (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      setInput('');
      setWeather({ loading: true, data: null, error: false });
      await fetchWeatherData(input);
    }
  };

  return (
    <div className="App" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <h1 className="app-name">
        Weather App
      </h1>
      <div className="search-bar">
        <input
          type="text"
          className="city-search"
          placeholder="Enter City Name.."
          name="query"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyPress={search}
        />
      </div>
      {weather.loading && (
        <>
          <br />
          <br />
          <Oval type="Oval" color="black" height={100} width={100} />
        </>
      )}
      {weather.error && (
        <>
          <br />
          <br />
          <span className="error-message">
            <FontAwesomeIcon icon={faFrown} />
            <span style={{ fontSize: '20px' }}>City not found</span>
          </span>
        </>
      )}
      {weather.data && (
        <div>
          <div className="city-name">
            <h2>
              {weather.data.name}, <span>{weather.data.sys.country}</span>
            </h2>
          </div>
          <div className="date">
            <span>{toDateFunction()}</span>
          </div>
          <div className="local-time">
            <span>Local Time: {new Date().toLocaleTimeString()}</span>
          </div>
          <div className="icon-temp">
            <img
              className=""
              src={`https://openweathermap.org/img/wn/${weather.data.weather[0].icon}@2x.png`}
              alt={weather.data.weather[0].description}
            />
            {Math.round(weather.data.main.temp)}
            <sup className="deg">°C</sup>
          </div>
          <div className="des-wind">
            <p>{weather.data.weather[0].description.toUpperCase()}</p>
            <p>Wind Speed: {weather.data.wind.speed}m/s</p>
            {/* Additional weather details */}
            <p>Humidity: {weather.data.main.humidity}%</p>
            <p>Pressure: {weather.data.main.pressure} hPa</p>
            <p>Sunrise: {new Date(weather.data.sys.sunrise * 1000).toLocaleTimeString()}</p>
            <p>Sunset: {new Date(weather.data.sys.sunset * 1000).toLocaleTimeString()}</p>
          </div>
          <div className="country-flag">
            <img src={`https://flagcdn.com/64x48/${weather.data.sys.country.toLowerCase()}.png`} alt="Country Flag" />
            <span>{weather.data.sys.country}</span>
            
          </div>
          <div className='jitendra'>
          Developed by Jitendra Sharma
          </div>
          {satelliteImageUrl && (
            <div className="satellite-image">
              <img src={satelliteImageUrl} alt="Satellite View" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default GfGWeatherApp;
