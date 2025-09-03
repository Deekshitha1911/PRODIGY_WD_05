const apiKey ="004f0e3a07ae47239257c1c7e5de08e9"; 
const overlay = document.querySelector(".overlay");
const quoteElement = document.getElementById("quote");

// 🌤 Backgrounds by weather condition
const weatherBackgrounds = {
  foggy: [
    "https://cdn.wallpapersafari.com/38/18/ZO9Uhw.jpg"
  ],
  hot: [
    "https://t3.ftcdn.net/jpg/07/65/77/18/360_F_765771878_Pc1XZRm476BvNH1AlQewgxFivewox2vm.jpg"
  ],
  warm: [
    "https://i.dailymail.co.uk/1s/2018/11/05/01/5769996-6352825-image-a-16_1541380832044.jpg"
  ],
  cool: [
    "https://wallpapercave.com/wp/wp10294073.jpg"
  ],
  snow: [
    "https://www.wallpaperflare.com/static/861/598/512/winter-snow-dawn-footprints-wallpaper.jpg"
  ],
  freezing: [
    "https://wallpapers.com/images/hd/snow-iphone-1g6ibxhlimraabr5.jpg"
  ]
};

// 🌤 Custom icons for conditions
const customIcons = {
  Clear: "https://cdn-icons-png.flaticon.com/512/869/869869.png",   // Sun
  Clouds: "https://cdn-icons-png.flaticon.com/512/414/414825.png",  // Cloud
  Rain: "https://cdn-icons-png.flaticon.com/512/1163/1163624.png",  // Rain
  Drizzle: "https://cdn-icons-png.flaticon.com/512/3075/3075858.png", // Drizzle
  Thunderstorm: "https://cdn-icons-png.flaticon.com/512/1146/1146860.png", // Thunderstorm
  Snow: "https://cdn-icons-png.flaticon.com/512/642/642102.png",    // Snow
  Mist: "https://cdn-icons-png.flaticon.com/512/4005/4005901.png",   // Mist/Fog
};

async function getWeather() {
  const inputCity = document.getElementById("cityInput").value.trim();
  if (!inputCity) {
    alert("Please enter a city name!");
    return;
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputCity}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.cod !== 200) {
      document.getElementById("weatherInfo").innerHTML = `<p>❌ City not found or invalid API key!</p>`;
      quoteElement.textContent = "";
      quoteElement.classList.remove("show");
      return;
    }

    const temp = data.main.temp;
    const description = data.weather[0].description;
    const humidity = data.main.humidity;
    const mainCondition = data.weather[0].main;

    // Pick custom icon or fallback to OpenWeather icon
    const icon = customIcons[mainCondition] || `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    changeBackground(temp, humidity);
    showQuote(temp, humidity);

    document.getElementById("weatherInfo").innerHTML = `
      <h2>${data.name}, ${data.sys.country}</h2>
      <img class="weather-icon" src="${icon}" alt="${description}">
      <p>🌡 Temperature: ${temp} °C</p>
      <p>☁ Condition: ${description}</p>
      <p>💧 Humidity: ${humidity}%</p>
    `;
  } catch (error) {
    document.getElementById("weatherInfo").innerHTML = `<p>⚠ Error fetching weather data</p>`;
    quoteElement.textContent = "";
    quoteElement.classList.remove("show");
  }
}

function changeBackground(temp, humidity) {
  let category;

  if (humidity >= 80) {
    category = "foggy";
  } else if (temp >= 30) {
    category = "hot";
  } else if (temp >= 20) {
    category = "warm";
  } else if (temp >= 10) {
    category = "cool";
  } else if (temp >= 0) {
    category = "snow";
  } else {
    category = "freezing";
  }

  const images = weatherBackgrounds[category];
  const imageUrl = images[Math.floor(Math.random() * images.length)];

  const img = new Image();
  img.src = imageUrl;
  img.onload = () => {
    overlay.style.opacity = 0;
    setTimeout(() => {
      overlay.style.backgroundImage = `url('${imageUrl}')`;
      overlay.style.opacity = 1;
    }, 300);
  };
}

function showQuote(temp, humidity) {
  let quote;
  if (humidity >= 80) {
    quote = "🌫 Mist teaches patience and calmness.";
  } else if (temp >= 30) {
    quote = "🔥 The heat reminds us to slow down and stay hydrated.";
  } else if (temp >= 20) {
    quote = "🌞 Warmth brings energy and light to your day.";
  } else if (temp >= 10) {
    quote = "🍃 Cool breezes make everything feel calmer.";
  } else if (temp >= 0) {
    quote = "❄ Cold days remind us to stay cozy and warm.";
  } else {
    quote = "🌨 Even in freezing times, beauty shines through.";
  }

  quoteElement.textContent = quote;
  quoteElement.classList.remove("show");
  setTimeout(() => {
    quoteElement.classList.add("show");
  }, 100);
}
