// Variables 
var searchButton = $(".searchButton");
var apiKey = "d4aabbc22010699a566d5734e851e414";
var savedCity = 0;

// Search button click event
searchButton.click(function () {

    var searchInput = $(".searchInput").val();
    var getCurrent = "https://api.openweathermap.org/data/2.5/weather?q=" + searchInput + "&Appid=" + apiKey + "&units=metric";
    var getFiveDay = "https://api.openweathermap.org/data/2.5/forecast?q=" + searchInput + "&Appid=" + apiKey + "&units=metric";

    if (searchInput == "") {
        console.log(searchInput);
    } else {
        $.ajax({
            url: getCurrent,
            method: "GET"
        }).then(function (response) {
            var cityName = $(".list-group").addClass("list-group-item");
            cityName.append("<li>" + response.name + "</li>");
            // save city name to storage
            var local = localStorage.setItem(savedCity, response.name);
            savedCity = savedCity + 1;
            
            var currentCard = $(".currentCard").append("<div>").addClass("card-body");
            currentCard.empty();
            // append city name to card
            var currentName = currentCard.append("<p>");
            currentCard.append(currentName);
            // adjust date
            var timeUTC = new Date(response.dt * 1000);
            currentName.append(response.name + " " + timeUTC.toLocaleDateString("en-US"));
            currentName.append(`<img src="https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png">`);
            // append current weather to card
            var currentTemp = currentName.append("<p>");
            currentName.append(currentTemp);
            currentTemp.append("<p>" + "Temperature: " + response.main.temp + " °C</p>");
            currentTemp.append("<p>" + "Humidity: " + response.main.humidity + " %</p>");
            currentTemp.append("<p>" + "Wind Speed: " + response.wind.speed + "</p>");

            // uv index
            var getUv = `https://api.openweathermap.org/data/2.5/uvi?appid=d4aabbc22010699a566d5734e851e414&lat=${response.coord.lat}&lon=${response.coord.lon}`;
            $.ajax({
                url: getUv,
                method: "GET"
            }).then(function (response) {
                var currentUV = currentTemp.append("<p>" + "UV Index: " + response.value + "</p>").addClass("card-text");
                currentUV.addClass("UV");
            });
        });

        // 5-day forecast 
        $.ajax({
            url: getFiveDay,
            method: "GET"
        }).then(function (response) {
            var day = [0, 8, 15, 23, 31];
            var fiveDayCard = $(".fiveDayCard").addClass("card-body");
            var fiveDayDiv = $(".fiveDayOne").addClass("card-text");
            fiveDayDiv.empty();
            day.forEach(function (i) {
                var FiveDayTimeUTC1 = new Date(response.list[i].dt * 1000);
                FiveDayTimeUTC1 = FiveDayTimeUTC1.toLocaleDateString("en-US");

                fiveDayDiv.append("<div class=fiveDayColor>" + "<p>" + FiveDayTimeUTC1 + "</p>" + `<img src="https://openweathermap.org/img/wn/${response.list[i].weather[0].icon}@2x.png">` + "<p>" + "Temperature: " + response.list[i].main.temp + "</p>" + "<p>" + "Humidity: " + response.list[i].main.humidity + "%" + "</p>" + "</div>");
            })
        });
    }
});

// retrieve localStorage data for history section
for (var i = 0; i < localStorage.length; i++) {
    var city = localStorage.getItem(i);
    var cityName = $(".list-group").addClass("list-group-item btn btn-light");

    cityName.append("<li>" + city + "</li>");
}