document.addEventListener('DOMContentLoaded', function() {
    // Hide the main content
    document.body.style.opacity = '0';
  
    // Ensure the overlay is visible
    document.getElementById('animation-overlay').style.display = 'flex';
  
    // Show the main content after the animation
    setTimeout(() => {
      document.body.style.opacity = '1';
      document.body.style.transition = 'opacity 1s ease-in-out';
      // Hide the overlay after the animation
      document.getElementById('animation-overlay').style.display = 'none';
    }, 1000); // 6 seconds total (3s delay + 3s animation)
  
    lucide.createIcons();


    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Fade-in animation
    const fadeInElements = document.querySelectorAll('.fade-in');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {     
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    fadeInElements.forEach(element => {
        observer.observe(element);
    });
    // Market Data Functionality
    function initMarketData() {
        const marketSubmit = document.getElementById('market-submit');
        const marketSelect = document.getElementById('market-select');

        if (marketSubmit && marketSelect) {
            marketSubmit.addEventListener('click', function() {
                const selectedMarket = marketSelect.value;

                const marketFiles = {
                        'apple': 'Market data/Apple.xls',
                        'banana': 'Market data/Banana.xls',
                        'bengal_gram': 'Market data/Bengal_gram.xls',
                        'black_gram': 'Market data/Black_gram.xls',
                        'chili_red': 'Market data/Chili_red.xls',
                        'cotton': 'Market data/Cotton.xls',
                        'garlic': 'Market data/Garlic.xls',
                        'ginger_dry': 'Market data/Ginger_dry.xls',
                        'grapes': 'Market data/Grapes.xls',
                        'green_gram': 'Market data/Green_gram.xls',
                        'groundnut': 'Market data/Groundnut.xls',
                        'jowar': 'Market data/Jowar.xls',
                        'jute': 'Market data/Jute.xls',
                        'maize': 'Market data/Maize.xls',
                        'mango': 'Market data/Mango.xls',
                        'mustard': 'Market data/Mustard.xls',
                        'onion': 'Market data/Onion.xls',
                        'orange': 'Market data/Orange.xls',
                        'paddy': 'Market data/Paddy.xls',
                        'pineapple': 'Market data/Pineapple.xls',
                        'potato': 'Market data/Potato.xls',
                        'red_gram': 'Market data/Red_gram.xls',
                        'rice': 'Market data/Rice.xls',
                        'sesamum': 'Market data/Sesamum.xls',
                        'soyabean': 'Market data/Soyabean.xls',
                        'sunflower': 'Market data/Sunflower.xls',
                        'wheat': 'Market data/Wheat.xls'
                    
                };

                if (marketFiles[selectedMarket]) {
                    window.open(marketFiles[selectedMarket], '_blank');
                }
            });
        }
    }
    // Government Policies Functionality
    function initGovernmentPolicies() {
        const policyContent = document.getElementById('policy-content');
        const policyLoading = document.getElementById('policy-loading');
        const policyApiUrl = 'https://api.example.com/indian-government-policies';

        function fetchGovernmentPolicies() {
            policyContent.classList.add('hidden');
            policyLoading.classList.remove('hidden');

            fetch(policyApiUrl)
                .then(response => response.json())
                .then(policyData => {
                    displayGovernmentPolicies(policyData);
                    policyLoading.classList.add('hidden');
                    policyContent.classList.remove('hidden');
                })
                .catch(error => {
                    console.error('Error fetching government policies:', error);
                    policyLoading.classList.add('hidden');
                });
        }

        function displayGovernmentPolicies(data) {
            policyContent.innerHTML = '';

            data.policies.forEach(policy => {
                const policyElement = document.createElement('div');
                policyElement.classList.add('policy-item');
                policyElement.innerHTML = `
                    <h3>${policy.title}</h3>
                    <p>${policy.description}</p>
                    <a href="${policy.link}" target="_blank">Read more</a>
                `;
                policyContent.appendChild(policyElement);
            });
        }

        // Fetch policies on page load
        fetchGovernmentPolicies();
    }

    // Initialize Government Policies
    initGovernmentPolicies();

    // Weather Functionality
    function initWeatherData() {
        const locationSelect = document.getElementById('location-select');
        const weatherContent = document.getElementById('weather-content');
        const weatherLoading = document.getElementById('weather-loading');
        const weatherApiKey = '9d7cde1f6d07ec55650544be1631307e';

        if (locationSelect) {
            locationSelect.addEventListener('change', function() {
                fetchWeatherData(this.value);
            });
        }

        function fetchWeatherData(location) {
            weatherContent.classList.add('hidden');
            weatherLoading.classList.remove('hidden');

            fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${weatherApiKey}`)
                .then(response => response.json())
                .then(geoData => {
                    if (geoData.length > 0) {
                        const lat = geoData[0].lat;
                        const lon = geoData[0].lon;
                        return fetchWeatherByLatLon(lat, lon);
                    } else {
                        throw new Error('Location not found');
                    }
                })
                .catch(error => {
                    console.error('Error fetching location data:', error);
                    weatherLoading.classList.add('hidden');
                });
        }

        function fetchWeatherByLatLon(lat, lon) {
            fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,alerts&units=metric&appid=${weatherApiKey}`)
                .then(response => response.json())
                .then(weatherData => {
                    displayWeatherData(weatherData);
                    weatherLoading.classList.add('hidden');
                    weatherContent.classList.remove('hidden');
                })
                .catch(error => {
                    console.error('Error fetching weather data:', error);
                    weatherLoading.classList.add('hidden');
                });
        }

        function displayWeatherData(data) {
            const currentWeather = data.current;
            const todayForecast = data.daily[0];

            document.getElementById('current-temp').textContent = `${Math.round(currentWeather.temp)}°C`;
            document.getElementById('current-description').textContent = currentWeather.weather[0].description;
            document.getElementById('current-high').textContent = `${Math.round(todayForecast.temp.max)}°C`;
            document.getElementById('current-low').textContent = `${Math.round(todayForecast.temp.min)}°C`;
            document.getElementById('current-humidity').textContent = `${currentWeather.humidity}%`;
            document.getElementById('current-rain-chance').textContent = `${Math.round(todayForecast.pop * 100)}%`;

            updateWeatherIcon('current-weather-icon', currentWeather.weather[0].main);

            const weatherForecastContainer = document.getElementById('weather-forecast');
            weatherForecastContainer.innerHTML = '';

            data.daily.slice(1, 6).forEach(day => {
                const dayElement = document.createElement('div');
                dayElement.className = 'text-center p-2 bg-gray-100 rounded-lg';
                const date = new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' });
                const description = day.weather[0].description;

                dayElement.innerHTML = `
                    <p class="text-sm font-semibold text-gray-600">${date}</p>
                    <i data-lucide="${getWeatherIcon(description)}" class="w-8 h-8 mx-auto ${getWeatherIconColor(description)}"></i>
                    <p class="text-lg font-semibold text-gray-800">${Math.round(day.temp.day)}°C</p>
                    <p class="text-xs text-gray-600">H: ${Math.round(day.temp.max)}°C L: ${Math.round(day.temp.min)}°C</p>
                    <p class="text-xs text-gray-600">Rain: ${Math.round(day.pop * 100)}%</p>
                `;
                weatherForecastContainer.appendChild(dayElement);
            });

            // Display hourly forecast
            const hourlyForecastContainer = document.getElementById('hourly-forecast');
            hourlyForecastContainer.innerHTML = '';

            data.hourly.slice(0, 12).forEach(hour => {
                const hourElement = document.createElement('div');
                hourElement.className = 'text-center p-2 bg-gray-100 rounded-lg';
                const time = new Date(hour.dt * 1000).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
                const description = hour.weather[0].description;

                hourElement.innerHTML = `
                    <p class="text-sm font-semibold text-gray-600">${time}</p>
                    <i data-lucide="${getWeatherIcon(description)}" class="w-8 h-8 mx-auto ${getWeatherIconColor(description)}"></i>
                    <p class="text-lg font-semibold text-gray-800">${Math.round(hour.temp)}°C</p>
                    <p class="text-xs text-gray-600">Rain: ${Math.round(hour.pop * 100)}%</p>
                `;
                hourlyForecastContainer.appendChild(hourElement);
            });

            lucide.createIcons();
        }

        function updateWeatherIcon(iconId, description) {
            const iconElement = document.getElementById(iconId);
            iconElement.setAttribute('data-lucide', getWeatherIcon(description));
            iconElement.className = `w-10 h-10 ${getWeatherIconColor(description)} mr-4`;
            lucide.createIcons();
        }

        function getWeatherIcon(description) {
            if (description.toLowerCase().includes('clear')) return 'sun';
            if (description.toLowerCase().includes('cloud')) return 'cloud';
            if (description.toLowerCase().includes('rain')) return 'cloud-rain';
            if (description.toLowerCase().includes('snow')) return 'cloud-snow';
            if (description.toLowerCase().includes('thunder')) return 'cloud-lightning';
            return 'cloud';
        }

        function getWeatherIconColor(description) {
            if (description.toLowerCase().includes('clear')) return 'text-yellow-500';
            if (description.toLowerCase().includes('cloud')) return 'text-gray-400';
            if (description.toLowerCase().includes('rain')) return 'text-blue-500';
            if (description.toLowerCase().includes('snow')) return 'text-blue-200';
            if (description.toLowerCase().includes('thunder')) return 'text-yellow-600';
            return 'text-gray-500';
        }

        // Initial weather fetch
        fetchWeatherData(locationSelect.value);
    }
    // Dark mode functionality
    function initDarkMode() {
        const darkModeToggle = document.getElementById('dark-mode-toggle');
        const htmlElement = document.documentElement;
        const darkModeIcon = darkModeToggle.querySelector('[data-lucide]');
    
        // Check for saved dark mode preference
        if (localStorage.getItem('darkMode') === 'enabled') {
            enableDarkMode();
        }
    
        darkModeToggle.addEventListener('click', () => {
            if (htmlElement.classList.contains('dark')) {
                disableDarkMode();
            } else {
                enableDarkMode();
            }
        });
    
        function enableDarkMode() {
            htmlElement.classList.add('dark');
            localStorage.setItem('darkMode', 'enabled');
            darkModeIcon.setAttribute('data-lucide', 'sun');
            lucide.createIcons();
        }
    
        function disableDarkMode() {
            htmlElement.classList.remove('dark');
            localStorage.setItem('darkMode', 'disabled');
            darkModeIcon.setAttribute('data-lucide', 'moon');
            lucide.createIcons();
        }
    }

    // Initialize all functionalities
    initMarketData();
    initWeatherData();
    initDarkMode();
});
