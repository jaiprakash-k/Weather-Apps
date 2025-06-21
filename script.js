const apiKey = 'a098dd84820b25e918d1960b379378bc';

const cityInput = document.getElementById('city');
const weatherBox = document.getElementById('weather');
const searchBtn = document.getElementById('searchBtn');

searchBtn.addEventListener('click', getWeather);
cityInput.addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    getWeather();
  }
});

function getWeather() {
  const city = cityInput.value.trim();
  if (!city) return alert("Please enter a city name");

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then(res => {
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      return res.json();
    })
    .then(data => {
      if (data.cod === '404') {
        weatherBox.innerHTML = `
          <div class="error-box">
            <p>❌ Location not found! Try a nearby city or check spelling.</p>
          </div>`;
        return;
      }

      const icon = data.weather[0].icon;
      const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

      const options = { hour: 'numeric', minute: 'numeric', hour12: true };

      const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString([], options);
      const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString([], options);
      const lastUpdated = new Date().toLocaleTimeString([], options);

      const html = `
        <div class="weather-card">
          <h2>${data.name}, ${data.sys.country}</h2>
          <img src="${iconUrl}" alt="Weather Icon">
          <p><strong>🌡 Temperature:</strong> ${data.main.temp} °C</p>
          <p><strong>🥵 Feels Like:</strong> ${data.main.feels_like} °C</p>
          <p><strong>☁ Condition:</strong> ${capitalizeWords(data.weather[0].description)}</p>
          <p><strong>💧 Humidity:</strong> ${data.main.humidity}%</p>
          <p><strong>💨 Wind:</strong> ${(data.wind.speed * 3.6).toFixed(1)} km/h</p>
          <p><strong>🌅 Sunrise:</strong> ${sunrise}</p>
          <p><strong>🌇 Sunset:</strong> ${sunset}</p>
          <p><strong>🔄 Last Updated:</strong> ${lastUpdated}</p>
          <button onclick="getWeather()" class="refresh-btn">🔄 Refresh</button>
        </div>
      `;

      weatherBox.innerHTML = html;
    })
    .catch(err => {
      console.error(err);
      weatherBox.innerHTML = `
        <div class="error-box">
          <p>⚠️ Error fetching data. Please check your internet or try a nearby city.</p>
        </div>`;
    });
}

function capitalizeWords(str) {
  return str
    .split(' ')
    .map(word => word[0].toUpperCase() + word.slice(1))
    .join(' ');
}