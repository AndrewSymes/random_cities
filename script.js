let backgroundImage = document.getElementById("background-image")
let cityElement = document.getElementById("city-element")
let localTime = document.getElementById("local-time")
let weather = document.getElementById("weather")
let information = document.getElementById("information")

fetch("citiesWithImages.json")
    .then(response => response.json())
    .then(cities => {
        var cityIndex = Math.floor(Math.random() * cities.length)
            // cityIndex = 10
        information.innerHTML += cities[cityIndex].name + ", " + cities[cityIndex].country + "  "
        document.body.style.backgroundImage = "url(images/" + cities[cityIndex].image + ")";

        fetch("https://api.timezonedb.com/v2.1/get-time-zone?key=K4YO4O4ZMNM8&format=json&by=position&lat=" + cities[cityIndex].lat + "&lng=" + cities[cityIndex].lon).then(response => {
            response.json().then(json => {
                console.log(json)
                var datetime = json.formatted
                datetime = datetime.substr(10, 6)
                information.innerHTML += datetime + "   "


                fetch("https://api.weatherbit.io/v2.0/current?" + "lat=" + cities[cityIndex].lat + "&lon=" + cities[cityIndex].lon + "&key=4b51f1dc85e34ec996cd03a45ee95fc8").then(response => {
                    response.json().then(json => {
                        console.log(json.data[0])
                        var sr = parseInt(json.data[0].sunrise.replace(":", ""))
                        var ss = parseInt(json.data[0].sunset.replace(":", ""))
                        var ct = parseInt(datetime.replace(":", ""))

                        console.log(sr, ss, ct)
                        if (sr < ct || ct < ss) {
                            document.body.style.backgroundImage = "url(images/" + cities[cityIndex].image + ")";
                        } else {
                            document.body.style.backgroundImage = "url(images/" + cities[cityIndex].night_image + ")";
                        }
                        information.innerHTML += json.data[0].temp + "C " + json.data[0].weather.description


                    })
                }).catch(err => {
                    console.error(err);
                });

            })
        }).catch(err => {
            console.error(err);
        });
    });