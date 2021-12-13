let cityElement = document.getElementById("city")
let localTimeElement = document.getElementById("local-time")
let tempElement = document.getElementById("temp")
let weatherElement = document.getElementById("weather")
let backgroundImage = document.getElementById("background-image")

let city = {
    "name": "",
    "country": "",
    "image": "day_image0.jpg",
    "night_image": "night_image0.jpg",
    "lat": "",
    "lon": ""
}

setPeramsAndUpdate()

function setPeramsAndUpdate() {
    backgroundImage.scrollIntoView();
    var url = document.URL
    if (url.includes("cityIndex=")) {
        fetch("cities.json")
            .then(response => response.json())
            .then(cities => {
                city = cities[parseInt(url.split("cityIndex=")[1])]
                update()
            }).catch(err => {
                console.error(err);
            });
    } else if (url.includes("lnglat=")) {
        var lnglat = url.split("lnglat=")[1].split(",")
        city.lon = lnglat[0]
        city.lat = lnglat[1]
        update()
    } else if (url.includes("local=true")) {
        navigator.geolocation.getCurrentPosition(position => {
            city.lat = position.coords.latitude;
            city.lon = position.coords.longitude;
            update()
        })
    } else {
        fetch("cities.json")
            .then(response => response.json())
            .then(cities => {
                var randomUpdate = function() {
                    var cityIndex = Math.floor(Math.random() * cities.length)
                    city = cities[cityIndex]
                    update()
                }
                randomUpdate()
                setInterval(() => {
                    randomUpdate()
                }, 1000 * 60 * 5);

            }).catch(err => {
                console.error(err);
            });
    }

}

function updateTime() {
    fetch("https://api.timezonedb.com/v2.1/get-time-zone?key=K4YO4O4ZMNM8&format=json&by=position&lat=" + city.lat + "&lng=" + city.lon).then(response => {
        response.json().then(timeData => {
            var datetime = timeData.formatted.substr(10, 6)
            localTimeElement.innerHTML = datetime
        })
    }).catch(err => {
        console.error(err);
    });
}

function update() {
    fetch("https://api.timezonedb.com/v2.1/get-time-zone?key=K4YO4O4ZMNM8&format=json&by=position&lat=" + city.lat + "&lng=" + city.lon).then(response => {
        response.json().then(timeData => {
            var datetime = timeData.formatted.substr(10, 6)
            localTimeElement.innerHTML = datetime

            var gmt0 = new Date(timeData.formatted)
            gmt0.setSeconds(gmt0.getMinutes() - parseInt(timeData.gmtOffset))

            fetch("https://api.weatherbit.io/v2.0/current?" + "lat=" + city.lat + "&lon=" + city.lon + "&key=4b51f1dc85e34ec996cd03a45ee95fc8").then(response => {
                response.json().then(weatherData => {
                    if (city.name == "" && city.country == "") {
                        city.name = weatherData.data[0].city_name;
                        city.country = weatherData.data[0].country_code;
                    }
                    cityElement.innerHTML = city.name + ", " + city.country

                    var sr = parseInt(weatherData.data[0].sunrise.replace(":", ""))
                    var ss = parseInt(weatherData.data[0].sunset.replace(":", ""))
                    var ct = parseInt("" + gmt0.getHours() + gmt0.getMinutes())

                    if ((sr < ct && ct < ss && sr < ss) || ((sr < ct || ct < ss) && sr > ss)) {
                        backgroundImage.src = "images/" + city.image
                    } else {
                        backgroundImage.src = "images/" + city.night_image
                    }


                    var flip = true
                    var temp = weatherData.data[0].temp
                    setTemp()
                    tempElement.addEventListener("click", setTemp)

                    function setTemp() {
                        if (!flip) {
                            tempElement.innerHTML = temp + "°C"
                            flip = true
                        } else {
                            tempElement.innerHTML = Math.round((temp * 9 / 5) + 32) + "°F"
                            flip = false
                        }
                    }


                    weatherElement.innerHTML = weatherData.data[0].weather.description
                })
            }).catch(err => {
                console.error(err);
            });

        })
    }).catch(err => {
        console.error(err);
    });
}