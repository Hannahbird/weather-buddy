const myAPIKey = "f7f892d9d77561663b2b4d372eb3311d";
var searchButtonEl = document.getElementById("searchBtn");
var saveSearchEl = document.querySelector(".saveSearch");
var cityArr = [];
var retrieveData = function (city) {
	// retrieve weather in imperial
	var apiURL =
		"https://api.openweathermap.org/data/2.5/weather?q=" +
		city +
		"&appid=" +
		myAPIKey +
		"&units=imperial";
	// fetch api
	fetch(apiURL)
		.then(function (response) {
			if (response.ok) {
				response.json().then(function (data) {
					var lat = data.coord.lat;
					var lon = data.coord.lon;
					// UV stat
					var url2 =
						"https://api.openweathermap.org/data/2.5/onecall?lat=" +
						lat +
						"&lon=" +
						lon +
						"&appid=" +
						myAPIKey +
						"&units=imperial";
					fetch(url2)
						.then(function (response) {
							if (response.ok) {
								response.json().then(function (data) {
									// input todays forcast
									displayToday(data, city);
								});
							} else {
								alert("City Not Found");
							}
						})
						.catch(function (error) {
							alert("Cannot Reach Open Weather");
						});
					// forecast info
					var url3 =
						"https://api.openweathermap.org/data/2.5/forecast/?lat=" +
						lat +
						"&lon=" +
						lon +
						"&appid=" +
						myAPIKey +
						"&units=imperial";
					fetch(url3)
						.then(function (response) {
							if (response.ok) {
								response.json().then(function (data) {
									// call function to display forecast
									displayForecast(data, city);
								});
							} else {
								alert("City Not Found");
							}
						})
						.catch(function (error) {
							alert("Cannot Reach Open Weather");
						});
				});
			} else {
				alert("City Not Found");
			}
		})
		.catch(function (error) {
			alert("Unable to connect to Open Weather");
		});
};
var displayForecast = function (data, city) {
	var headerEl = document.querySelector("h3");
	headerEl.innerHTML = "<strong>5-Day Forecast:</strong>";
	var forecastEl = $(".nextDay");
	forecastEl.children("p").remove();
	forecastEl.children("h6").remove();
	// loop through first five days of forecast
	for (var i = 0; i < forecastEl.length; i++) {
		// extract info for next 5 days
		var date = moment(data.list[i].date_text)
			.add(i + 1, "days")
			.format("MM" + "/" + "DD" + "/" + "YYYY");
		var humidity = "Humidity: " + data.list[i].main.humidity + " %";
		var temp = "Temperature: " + data.list[i].main.temp + "°F";
		var wind = "Wind Speed: " + data.list[i].wind.speed + " MPH";
		var icon = data.list[i].weather[0].icon;
		// create elements for each data value
		var dateEl = document.createElement("h6");
		dateEl.classList = "card-title";
		dateEl.textContent = date;
		forecastEl[i].appendChild(dateEl);
		// icon for weather depiction 
		var iconEl = document.createElement("p");
		iconEl.classList = "card-text";
		iconEl.innerHTML =
			"<img src='http://openweathermap.org/img/wn/" + icon + ".png'/>";
		forecastEl[i].appendChild(iconEl);
		// temperature
		var tempEl = document.createElement("p");
		tempEl.classList = "card-text";
		tempEl.textContent = temp;
		forecastEl[i].appendChild(tempEl);
		// wind 
		var windEl = document.createElement("p");
		windEl.textContent = wind;
		windEl.classList = "card-text";
		forecastEl[i].appendChild(windEl);
		// humidity 
		var humidityEl = document.createElement("p");
		humidityEl.textContent = humidity;
		humidityEl.style.paddingBottom = "1vh";
		humidityEl.classList = "card-text";
		forecastEl[i].appendChild(humidityEl);
	}
};
var displayToday = function (data, city) {
	// removes current display to make room for new city call
	headerRemove();
	dayTempRemove();
	saveCity(city);
	var temp = data.current.temp;
	var date = moment(data.current.date_text).format(
		"MM" + "/" + "DD" + "/" + "YYYY"
	);
	var city = city;
	var wind = data.current.wind_speed;
	var icon = data.current.weather[0].icon;
	var humidity = data.current.humidity;
	var uvi = data.current.uvi;
	headerAppend(date, city, icon);
	dayTempAppend(temp, wind, humidity, uvi);
};
var headerRemove = function () {
	$(".cityHeader").remove();
};
var headerAppend = function (date, city, icon) {
	var rowDivEl = document.querySelector(".currentWeather");
	rowDivEl.style.opacity = "1";
	var divColHeaderEl = document.querySelector(".col-header");
	var headerEl = document.createElement("h2");
	headerEl.classList = "cityHeader text-capitalize";
	headerEl.textContent = city + " (" + date + ") ";
	headerEl.innerHTML =
		"<strong>" +
		headerEl.textContent +
		"<img src='http://openweathermap.org/img/wn/" +
		icon +
		".png'/></strong>";
	divColHeaderEl.appendChild(headerEl);
};
var dayTempRemove = function () {
	$(".list-group").remove();
};
var dayTempAppend = function (temp, wind, humidity, uvi) {
	var tempValsEl = document.querySelector(".col-tempValues");
	var listEl = document.createElement("ul");
	listEl.classList = "list-group";
	var dataList = [temp, wind, humidity, uvi];
	//loop through data 
	for (var i = 0; i < dataList.length; i++) {
		var itemListEl = document.createElement("li");
		itemListEl.classList = "list-group-item";
		if (i === 0) {
			itemListEl.textContent = "Temp: " + dataList[i] + "°F";
		} else if (i === 1) {
			itemListEl.textContent = "Wind: " + dataList[i] + " MPH";
		} else if (i === 2) {
			itemListEl.textContent = "Humidity: " + dataList[i] + " %";
		} else {
			if (parseInt(dataList[i]) <= 2) {
				itemListEl.innerHTML =
					"UV Index:<button class='Good'>" + uvi + "</button>";
			} else if (parseInt(dataList[i]) <= 5) {
				itemListEl.innerHTML =
					"UV Index:<button class='Medium'>" + uvi + "</button>";
			} else if (7.0 < parseInt(dataList[i])) {
				itemListEl.innerHTML =
					"UV Index:<button class='High'>" + uvi + "</button>";
			}
		}
		listEl.appendChild(itemListEl);
	}
	tempValsEl.appendChild(listEl);
};
var historyButtons = function (city) {
	// add current city to local storage
	var cityButtonEl = document.createElement("button");
	cityButtonEl.setAttribute("type", "search");
	cityButtonEl.classList = "btn btn-secondary text-capitalize";
	cityButtonEl.textContent = city;
	saveSearchEl.appendChild(cityButtonEl);
};
var saveCity = function (city) {
	if (cityArr.indexOf(city) === -1) {
		cityArr.push(city);
		// save to local
		historyButtons(city);
	}
	localStorage.setItem("city", cityArr);
};
var loadCities = function () {
	// get the city
	cityArr = localStorage.getItem("city");
	if (cityArr === null) {
		cityArr = [];
		return;
	}
	cityArr = cityArr.split(",");
	// histpry
	for (var i = 0; i < cityArr.length; i++) {
		historyButtons(cityArr[i]);
	}
};
var getCityForecast = function (event) {
	var city = $(this).siblings(".form-control").val().trim();
	// retrieves forcast info
	getForecast(city);
};
var getCity = function (event) {
	// obtains text 'city' from user and gets city data
	var city = $(this).siblings(".form-control").val().trim();
	// calls city data
	retrieveData(city);
};
// load past searches upon page load
loadCities();
// when search is clicked getCity func is activated
searchButtonEl.addEventListener("click", getCity);
// when city in search is clicked retrieve forcast for the city
$(".saveSearch").on("click", ".btn-secondary", function (event) {
	var city = event.target.textContent;
	retrieveData(city);
});