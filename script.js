let backgroundImage = document.getElementById("background-image")
let city = document.getElementById("city")
let localTime = document.getElementById("local-time")
let weather = document.getElementById("weather")

fetch("citiesWithImages.json")
    .then(response => response.json())
    .then(cities => {
        var cityIndex = Math.floor(Math.random() * cities.length)
        city.innerHTML = cities[cityIndex].name + ", " + cities[cityIndex].country + "  "

        fetch("https://api.timezonedb.com/v2.1/get-time-zone?key=K4YO4O4ZMNM8&format=json&by=position&lat=" + cities[cityIndex].lat + "&lng=" + cities[cityIndex].lon).then(response => {
            response.json().then(timeData => {
                var datetime = timeData.formatted
                datetime = datetime.substr(10, 6)
                localTime.innerHTML = datetime + "   "
                var timestamp0 = parseInt(timeData.timestamp) + parseInt(timeData.gmtOffset)
                var gmt0 = new Date(timestamp0)

                fetch("https://api.weatherbit.io/v2.0/current?" + "lat=" + cities[cityIndex].lat + "&lon=" + cities[cityIndex].lon + "&key=4b51f1dc85e34ec996cd03a45ee95fc8").then(response => {
                    response.json().then(weatherData => {
                        var sr = parseInt(weatherData.data[0].sunrise.replace(":", ""))
                        var ss = parseInt(weatherData.data[0].sunset.replace(":", ""))
                        var ct = parseInt("" + gmt0.getHours() + gmt0.getMinutes())

                        if ((sr < ct && ct < ss && sr < ss) || ((sr < ct || ct < ss) && sr > ss)) {
                            document.body.style.backgroundImage = "url(images/" + cities[cityIndex].image + ")";
                        } else {
                            document.body.style.backgroundImage = "url(images/" + cities[cityIndex].night_image + ")";
                        }
                        weather.innerHTML = weatherData.data[0].temp + "C " + weatherData.data[0].weather.description
                    })
                }).catch(err => {
                    console.error(err);
                });

            })
        }).catch(err => {
            console.error(err);
        });
    });