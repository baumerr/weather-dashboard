const searchButton = document.querySelector('#search-button');
const historyList = document.querySelector('.history');
const history = JSON.parse(window.localStorage.getItem('history')) || [];
const today = document.querySelector('#today');
const forecast = document.querySelector('#forecast');
const reco = document.querySelector('#recommend');

function search () {
    var searchValue = document.querySelector('#search-value').value;

    document.querySelector('#search-value').value = '';

    searchWeather(searchValue);
}

function prevCity(city) {
    const list = city.textContent;
    
    searchWeather(list);
}

function historyRow(text) {
    var li = document.createElement('li');
    li.setAttribute('class', 'list-group-item list-group-item-action');
    li.setAttribute('onclick', 'prevCity(this)');
    li.setAttribute('style', 'background-color: rgba(189, 194, 199, 0.795)')
    li.textContent = text;
    
    historyList.appendChild(li);
}

function searchWeather(searchValue) {
    fetch(`http://api.openweathermap.org/data/2.5/weather?q=${searchValue}&appid=b6edcad52145ba562d4248798a2bd53a&units=imperial`)
      .then((response) => {
          if(response.ok) {
              response.json().then((data) => {
                if(history.indexOf(searchValue) === -1) {
                    history.push(searchValue);
                    window.localStorage.setItem('history', JSON.stringify(history));
    
                    historyRow(searchValue);
                }
                today.innerHTML = '';

                const card = document.createElement('div');
                card.setAttribute('class', 'card');
                card.setAttribute('style', 'background-color: rgba(189, 194, 199, 0.795)')

                const cardBody = document.createElement('div');
                cardBody.setAttribute('class', 'card-body');
    
                const title = document.createElement('h3');
                title.setAttribute('class', 'card-title');
                title.textContent = `${data.name} ( ${new Date().toLocaleDateString()} )`;

                const icon = document.createElement('img');
                icon.src =  `http://openweathermap.org/img/w/${data.weather[0].icon}.png`

                const wind = document.createElement('p');
                wind.setAttribute('class', 'card-text');
                wind.textContent = `Wind speed: ${data.wind.speed}mph`;

                const humidity = document.createElement('p');
                humidity.setAttribute('class', 'card-text');
                humidity.textContent = `Humidity: ${data.main.humidity}%`;

                const temperature = document.createElement('p');
                const temp = (data.main.temp - 32) * 0.5556;
                temperature.setAttribute('class', 'card-text');
                temperature.textContent = `Temperature: ${temp.toFixed()} °C`;

                title.appendChild(icon);
                cardBody.appendChild(title);
                cardBody.appendChild(temperature);
                cardBody.appendChild(humidity);
                cardBody.appendChild(wind);
                card.appendChild(cardBody);

                today.appendChild(card);

                if(temp < 5) {
                    reco.textContent = 'Better bundle up!'
                } else if (temp < 20) {
                    reco.textContent = 'A light jacket should do you fine.'
                } else {
                    reco.textContent = 'Shorts and T-Shirts, baby!'
                }

                getForecast(searchValue);
                getUV(data.coord.lat, data.coord.lon);
              })
            
          } else {
            return alert('Error: Not Found');
          }
      })
}

function getForecast(searchValue) {
    fetch(`http://api.openweathermap.org/data/2.5/forecast?q=${searchValue}&appid=b6edcad52145ba562d4248798a2bd53a&units=imperial`)
      .then(response => {
          if(response.ok) {
            response.json().then(data => {
                forecast.innerHTML = `<h4 class='mt-3'>5-Day Forecast: </h4>`;

                const rowDiv = document.createElement('div');
                rowDiv.setAttribute('class', 'row');
                forecast.appendChild(rowDiv);

                for(let i =0; i < data.list.length; i++) {
                    if(data.list[i].dt_txt.indexOf("15:00:00") !== -1) {
                        const col = document.createElement('div');
                        col.setAttribute('class', 'col-md-2');

                        const card = document.createElement('div');
                        card.setAttribute('class', 'card');

                        const body = document.createElement('div');
                        body.setAttribute('class', 'card-body p-2');

                        const title = document.createElement('h5');
                        title.setAttribute('class', 'card-title');
                        title.textContent = `${new Date(data.list[i].dt_txt).toLocaleDateString()}`;

                        const icon = document.createElement('img');
                        icon.src = `http://openweathermap.org/img/w/${data.list[i].weather[0].icon}.png`

                        const temperature = document.createElement('p');
                        const temp = (data.list[i].main.temp_max - 32) * 0.5556;
                        temperature.setAttribute('class', 'card-text');
                        temperature.textContent = `Temp: ${temp.toFixed()} °C`;

                        const humidity = document.createElement('p');
                        humidity.setAttribute('class', 'card-text');
                        humidity.textContent = `Humidity: ${data.list[i].main.humidity}%`;

                        body.appendChild(title);
                        body.appendChild(icon);
                        body.appendChild(temperature);
                        body.appendChild(humidity);
                        
                        card.appendChild(body);
                        
                        col.appendChild(card);

                        rowDiv.appendChild(col);

                        if(temp < 5) {
                            card.setAttribute('style', 'background-color: rgba(86, 88, 179, 0.788)');
                        } else if (temp < 20) {
                            card.setAttribute('style', 'background-color: rgb(189, 171, 9)');
                        } else {
                            card.setAttribute('style', 'background-color: rgb(192, 71, 1)');
                        }
                    }
                }
            })
          } else {
            return alert('Error: Not Found');
          }
      })
}

function getUV(lat, lon) {
    fetch(`http://api.openweathermap.org/data/2.5/uvi?&appid=b6edcad52145ba562d4248798a2bd53a&lat=${lat}&lon=${lon}`)
      .then(response => {
          if(response.ok) {
            response.json().then(data => {
                const uv = document.createElement('p');
                uv.textContent = 'UV Index: ';
                uv.setAttribute('style', 'background-color: rgba(189, 194, 199, 0.795)');
                uv.setAttribute('class', 'mt-2 p-4');

                const span = document.createElement('span');
                span.textContent = data.value;

                uv.appendChild(span);
                today.appendChild(uv);
            })
          } else {
            return alert('Error: Not Found');
          }
      })
}

if(history.length > 0) {
    searchWeather(history[history.length-1]);
}

for (let i = 0; i < history.length; i++) {
    historyRow(history[i]);
}

searchButton.addEventListener('click', search);