// Base URLs for APIs
const OPEN_METEO_API_BASE_URL = 'https://api.open-meteo.com/v1/forecast';
const GEOLOCATION_API_URL = 'https://geocoding-api.open-meteo.com/v1/search'; // Open-Meteo's geocoding API
const JSON_SERVER_API_URL = 'http://localhost:3000/favoriteCities';

// DOM Elements
const cityInput = document.getElementById('city-input');
const searchForm = document.getElementById('city-search-form');
const currentCityNameSpan = document.getElementById('current-city-name');
const weatherIconContainer = document.getElementById('weather-icon-container');
const temperatureSpan = document.getElementById('temperature');
const conditionsSpan = document.getElementById('conditions');
const humiditySpan = document.getElementById('humidity');
const windSpeedSpan = document.getElementById('wind-speed');
const pressureSpan = document.getElementById('pressure');
const addFavoriteButton = document.getElementById('add-favorite-button');
const dailyForecastContainer = document.getElementById('daily-forecast-container');
const favoriteCitiesList = document.getElementById('favorite-cities-list');
const themeToggle = document.getElementById('theme-toggle');

let currentCityData = null; // To store data of the currently displayed city for adding to favorites

// Helper function to map weather codes to icons/descriptions (simplified example)
function getWeatherIcon(weatherCode) {
    // See Open-Meteo Weather Codes: https://www.open-meteo.com/en/docs
    const weatherIcons = {
        0: '<i class="fas fa-sun"></i> Clear sky',
        1: '<i class="fas fa-cloud-sun"></i> Mainly clear',
        2: '<i class="fas fa-cloud-sun"></i> Partly cloudy',
        3: '<i class="fas fa-cloud"></i> Overcast',
        45: '<i class="fas fa-smog"></i> Fog',
        48: '<i class="fas fa-smog"></i> Depositing rime fog',
        51: '<i class="fas fa-cloud-showers-heavy"></i> Drizzle',
        53: '<i class="fas fa-cloud-showers-heavy"></i> Drizzle',
        55: '<i class="fas fa-cloud-showers-heavy"></i> Drizzle',
        56: '<i class="fas fa-cloud-meatball"></i> Freezing Drizzle',
        57: '<i class="fas fa-cloud-meatball"></i> Freezing Drizzle',
        61: '<i class="fas fa-cloud-showers-heavy"></i> Rain',
        63: '<i class="fas fa-cloud-showers-heavy"></i> Rain',
        65: '<i class="fas fa-cloud-showers-heavy"></i> Rain',
        66: '<i class="fas fa-cloud-meatball"></i> Freezing Rain',
        67: '<i class="fas fa-cloud-meatball"></i> Freezing Rain',
        71: '<i class="fas fa-snowflake"></i> Snow fall',
        73: '<i class="fas fa-snowflake"></i> Snow fall',
        75: '<i class="fas fa-snowflake"></i> Snow fall',
        77: '<i class="fas fa-snowflake"></i> Snow grains',
        80: '<i class="fas fa-cloud-showers-heavy"></i> Rain showers',
        81: '<i class="fas fa-cloud-showers-heavy"></i> Rain showers',
        82: '<i class="fas fa-cloud-showers-heavy"></i> Rain showers',
        85: '<i class="fas fa-snowflake"></i> Snow showers',
        86: '<i class="fas fa-snowflake"></i> Snow showers',
        95: '<i class="fas fa-bolt"></i> Thunderstorm',
        96: '<i class="fas fa-bolt"></i> Thunderstorm with hail',
        99: '<i class="fas fa-bolt"></i> Thunderstorm with hail'
    };
    return weatherIcons[weatherCode] || '<i class="fas fa-question-circle"></i> Unknown';
}

// Function to fetch weather data from Open-Meteo
async function fetchWeatherData(latitude, longitude) {
  try {
    // Request current weather, hourly temperature (for detailed view), and daily forecast
    const response = await fetch(`${OPEN_METEO_API_BASE_URL}?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m,pressure_msl,weathercode&daily=weathercode,temperature_2m_max,temperature_2m_min&temperature_unit=celsius&wind_speed_unit=kmh&precipitation_unit=mm&timezone=auto`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    alert("Could not fetch weather data. Please try again.");
    return null;
  }
}

// Function to get Lat/Lon for a city name (using Open-Meteo's Geocoding API)
async function getCoordinatesForCity(cityName) {
  try {
    const response = await fetch(`${GEOLOCATION_API_URL}?name=${cityName}&count=1&language=en&format=json`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      const city = data.results[0];
      return {
        name: city.name,
        latitude: city.latitude,
        longitude: city.longitude
      };
    } else {
      alert(`City "${cityName}" not found. Please check spelling.`);
      return null;
    }
  } catch (error) {
    console.error("Error fetching city coordinates:", error);
    alert("Could not find city. Please check your internet connection.");
    return null;
  }
}

// Function to render current weather data
function renderCurrentWeather(weatherData, cityName) {
  if (!weatherData || !weatherData.current_weather) {
    currentCityNameSpan.textContent = 'N/A';
    weatherIconContainer.innerHTML = '';
    temperatureSpan.textContent = '';
    conditionsSpan.textContent = '';
    humiditySpan.textContent = '';
    windSpeedSpan.textContent = '';
    pressureSpan.textContent = '';
    addFavoriteButton.style.display = 'none'; // Hide if no data
    return;
  }

  const {
    temperature,
    windspeed,
    weathercode
  } = weatherData.current_weather;
  const currentHourlyIndex = weatherData.hourly.time.findIndex(time => new Date(time).getHours() === new Date(weatherData.current_weather.time).getHours());
  const humidity = weatherData.hourly.relative_humidity_2m[currentHourlyIndex];
  const pressure = weatherData.hourly.pressure_msl[currentHourlyIndex];

  currentCityNameSpan.textContent = cityName;
  weatherIconContainer.innerHTML = getWeatherIcon(weathercode); // Use the helper
  temperatureSpan.textContent = `${temperature}°C`;
  conditionsSpan.textContent = getWeatherIcon(weathercode).split('>')[1].trim(); // Extract description
  humiditySpan.textContent = `${humidity}%`;
  windSpeedSpan.textContent = `${windspeed} km/h`;
  pressureSpan.textContent = `${pressure} hPa`;

  // Store current city data for "Add to Favorites" button
  currentCityData = {
    name: cityName,
    latitude: weatherData.latitude,
    longitude: weatherData.longitude
  };
  addFavoriteButton.style.display = 'inline-block'; // Show button
}


// Function to render 7-day forecast (using array iteration: map)
function renderSevenDayForecast(weatherData) {
  dailyForecastContainer.innerHTML = ''; // Clear previous forecast

  if (!weatherData || !weatherData.daily) {
    dailyForecastContainer.innerHTML = '<p>No 7-day forecast available.</p>';
    return;
  }

  weatherData.daily.time.forEach((dateString, index) => {
    const day = new Date(dateString);
    const dayName = day.toLocaleDateString('en-US', {
      weekday: 'short'
    });
    const maxTemp = weatherData.daily.temperature_2m_max[index];
    const minTemp = weatherData.daily.temperature_2m_min[index];
    const weatherCode = weatherData.daily.weathercode[index];
    const weatherDescription = getWeatherIcon(weatherCode);

    const forecastCard = document.createElement('div');
    forecastCard.classList.add('daily-forecast-card');
    forecastCard.innerHTML = `
            <p class="day">${dayName}</p>
            <p>${weatherDescription}</p>
            <p class="temp-high">High: ${maxTemp}°C</p>
            <p class="temp-low">Low: ${minTemp}°C</p>
        `;
    dailyForecastContainer.appendChild(forecastCard);
  });
}

// --- JSON Server Interactions (Favorite Cities) ---

// Function to fetch favorite cities from json-server
async function fetchFavoriteCities() {
  try {
    const response = await fetch(JSON_SERVER_API_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const cities = await response.json();
    renderFavoriteCities(cities);
  } catch (error) {
    console.error("Error fetching favorite cities:", error);
    favoriteCitiesList.innerHTML = '<li>Could not load favorite cities.</li>';
  }
}

// Function to render favorite cities (using array iteration: forEach)
function renderFavoriteCities(cities) {
  favoriteCitiesList.innerHTML = ''; // Clear previous list

  if (cities.length === 0) {
    favoriteCitiesList.innerHTML = '<li>No favorite cities added yet.</li>';
    return;
  }

  cities.forEach(city => {
    const listItem = document.createElement('li');
    listItem.innerHTML = `
            <span data-latitude="${city.latitude}" data-longitude="${city.longitude}" class="favorite-city-name">${city.name}</span>
            <button class="remove-favorite-button" data-id="${city.id}">Remove</button>
        `;
    favoriteCitiesList.appendChild(listItem);
  });
}

// Function to add a city to favorites via json-server
async function addFavoriteCity(cityData) {
  // Check if city is already in favorites
  const existingFavoritesResponse = await fetch(JSON_SERVER_API_URL);
  const existingFavorites = await existingFavoritesResponse.json();
  const isDuplicate = existingFavorites.some(city => city.name === cityData.name);

  if (isDuplicate) {
    alert(`${cityData.name} is already in your favorites!`);
    return;
  }

  try {
    const response = await fetch(JSON_SERVER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...cityData,
        addedDate: new Date().toISOString()
      }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    await fetchFavoriteCities(); // Re-fetch and render updated list
    alert(`${cityData.name} added to favorites!`);
  } catch (error) {
    console.error("Error adding favorite city:", error);
    alert("Could not add city to favorites. Please ensure json-server is running.");
  }
}

// Function to remove a city from favorites via json-server
async function removeFavoriteCity(cityId) {
  try {
    const response = await fetch(`${JSON_SERVER_API_URL}/${cityId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    await fetchFavoriteCities(); // Re-fetch and render updated list
    alert("City removed from favorites!");
  } catch (error) {
    console.error("Error removing favorite city:", error);
    alert("Could not remove city from favorites.");
  }
}


// --- Event Listeners ---

// 1. Event Listener: Submit event on the search form
searchForm.addEventListener('submit', async function(event) {
  event.preventDefault(); // Prevent default form submission (page reload)
  const cityName = cityInput.value.trim();
  if (cityName) {
    const cityCoords = await getCoordinatesForCity(cityName);
    if (cityCoords) {
      const weatherData = await fetchWeatherData(cityCoords.latitude, cityCoords.longitude);
      renderCurrentWeather(weatherData, cityCoords.name);
      renderSevenDayForecast(weatherData);
    }
  } else {
    alert("Please enter a city name.");
  }
  cityInput.value = ''; // Clear input field
});


// 2. Event Listener: Click event on "Add to Favorites" button
addFavoriteButton.addEventListener('click', function() {
  if (currentCityData) {
    addFavoriteCity(currentCityData);
  } else {
    alert("Please search for a city first!");
  }
});

// 3. Event Listener: Click event on the Favorite Cities List (event delegation)
// This handles clicks on individual city names and remove buttons within the list
favoriteCitiesList.addEventListener('click', async function(event) {
  if (event.target.classList.contains('favorite-city-name')) {
    // Clicked on a city name to view its weather
    const latitude = event.target.dataset.latitude;
    const longitude = event.target.dataset.longitude;
    const cityName = event.target.textContent;
    const weatherData = await fetchWeatherData(latitude, longitude);
    renderCurrentWeather(weatherData, cityName);
    renderSevenDayForecast(weatherData);
  } else if (event.target.classList.contains('remove-favorite-button')) {
    // Clicked on a "Remove" button
    const cityId = event.target.dataset.id;
    removeFavoriteCity(cityId);
  }
});

// 4. Event Listener: Click event for Theme Toggle (Distinct functionality, good to add)
themeToggle.addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
});


// Initial App Load
document.addEventListener('DOMContentLoaded', async () => {
  // Try to get user's current location by default
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const {
        latitude,
        longitude
      } = position.coords;
      // You'd typically reverse geocode to get city name here,
      // but for simplicity, we'll just display coords or a generic "Your Location"
      const weatherData = await fetchWeatherData(latitude, longitude);
      renderCurrentWeather(weatherData, "Your Current Location"); // Or fetch city name from a reverse geocoding API
      renderSevenDayForecast(weatherData);
    }, async (error) => {
      console.warn("Geolocation denied or unavailable:", error);
      // Fallback to a default city if geolocation fails
      const defaultCityCoords = await getCoordinatesForCity("Mombasa"); // Default city in Kenya
      if (defaultCityCoords) {
        const weatherData = await fetchWeatherData(defaultCityCoords.latitude, defaultCityCoords.longitude);
        renderCurrentWeather(weatherData, defaultCityCoords.name);
        renderSevenDayForecast(weatherData);
      }
    });
  } else {
    console.warn("Geolocation not supported by this browser.");
    // Fallback to a default city if geolocation not supported
    const defaultCityCoords = await getCoordinatesForCity("Mombasa");
    if (defaultCityCoords) {
      const weatherData = await fetchWeatherData(defaultCityCoords.latitude, defaultCityCoords.longitude);
      renderCurrentWeather(weatherData, defaultCityCoords.name);
      renderSevenDayForecast(weatherData);
    }
  }

  // Load favorite cities from json-server on page load
  fetchFavoriteCities();
});

