"use strict";
const form = document.querySelector('#form');
const error = document.querySelector('.errors');
const dark = document.querySelector('.dark-mode');
const temperature = document.querySelector('.temp');
const city = document.querySelector('.city');
const weatherIconContainer = document.querySelector('.weather-icon');
const infoContainer = document.querySelector('.info-container');
const submitBtn = document.querySelector('.submit-btn');
//Additional info
const windP = document.querySelector('.wind');
const visibilityP = document.querySelector('.visibility');
const humidityP = document.querySelector('.humidity');
const feelsLikeP = document.querySelector('.feels-like');
if (form) {
    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        if (temperature && city && weatherIconContainer && visibilityP && humidityP && feelsLikeP && windP) {
            temperature.textContent = '';
            city.textContent = '';
            weatherIconContainer.innerHTML = '';
            humidityP.textContent = '';
            visibilityP.textContent = '';
            humidityP.textContent = '';
            feelsLikeP.textContent = '';
            infoContainer?.classList.remove('opacity-1');
            infoContainer?.classList.add('opacity-0');
        }
        const form = new FormData(this);
        const cityName = form.get('city');
        if (cityName && typeof cityName === 'string' && cityName.trim()) {
            const data = await fetchWeather(cityName);
            console.log(data);
            if (!isWeatherInfo(data)) {
                if (error) {
                    showError(error, data.message);
                }
                return;
            }
            const { temp, humidity, feels_like } = data.main;
            const { speed: airSpeed } = data.wind;
            const { main: weather } = data.weather[0];
            const weatherIcon = data.weather[0].icon;
            if (temperature && city && weatherIconContainer) {
                temperature.textContent = `${temp.toFixed()} °C`;
                city.textContent = cityName.charAt(0).toUpperCase() + cityName.slice(1);
                weatherIconContainer.innerHTML = `
                    <div class="w-[100px]">
                        <img class="w-full" alt="weather icon" src="https://openweathermap.org/img/w/${weatherIcon}.png"></img>
                    </div>
                    <p class="mt-[-25px] text-center text-sm text-gray-500">${weather}</p>`;
            }
            if (visibilityP && humidityP && feelsLikeP && windP) {
                humidityP.textContent = `${humidity}%`;
                visibilityP.textContent = `${(data.visibility / 1000).toFixed(1)} km/h`;
                windP.textContent = `${airSpeed} m/s`;
                feelsLikeP.textContent = `${feels_like} °C`;
            }
            infoContainer?.classList.remove('opacity-0');
            infoContainer?.classList.add('opacity-1');
        }
        else {
            if (error) {
                showError(error, 'Please write a city name in the input above.');
            }
        }
    });
}
if (dark) {
    dark.addEventListener('click', function () {
        document.body.classList.toggle('bg-[#0b131e]');
        document.querySelector('main')?.classList.toggle('text-white');
        (infoContainer?.children[0]).classList.toggle('bg-[#202b3b]');
        (infoContainer?.children[1]).classList.toggle('bg-[#202b3b]');
        this.classList.toggle('text-white');
        submitBtn?.classList.toggle('bg-white');
        submitBtn?.classList.toggle('text-[#171724]');
        this.children[0].classList.toggle('hidden');
        this.children[1].classList.toggle('hidden');
    });
}
async function fetchWeather(cityName) {
    const data = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=43e800ab56470d9d19100d4c09d2da48`);
    const weather = await data.json();
    return weather;
}
function showError(el, message) {
    if (el.childElementCount >= 1) {
        return;
    }
    const errorEl = document.createElement('div');
    errorEl.style.padding = '5px 10px';
    errorEl.style.font = 'semibold';
    errorEl.style.fontSize = '20px';
    errorEl.style.borderRadius = '10px';
    errorEl.style.backgroundColor = 'hsla(0, 100%, 67%, 0.4)';
    errorEl.textContent = message;
    errorEl.style.color = 'hsl(0, 100%, 67%)';
    errorEl.style.textAlign = 'center';
    el.appendChild(errorEl);
    setTimeout(() => {
        el.removeChild(errorEl);
    }, 3000);
}
function isWeatherInfo(arg) {
    return Number(arg.cod) !== 404;
}
