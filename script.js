let backgroundImage = document.getElementById("background-image")
let cityElement = document.getElementById("city-element")

fetch("citiesWithImages.json")
    .then(response => response.json())
    .then(cities => {
        var cityIndex = Math.floor(Math.random() * cities.length)
        document.body.style.backgroundImage = "url(images/" + cities[cityIndex].night_image + ")";
        cityElement.innerText = cities[cityIndex].name + ", " + cities[cityIndex].country

        fetch("https://api.weatherbit.io/v2.0/current?" + "lat=" + cities[cityIndex].lat + "&lon=" + cities[cityIndex].lon + "&key=4b51f1dc85e34ec996cd03a45ee95fc8").then(response => {
            response.json().then(json => {
                console.log(json)
            })
        }).catch(err => {
            console.error(err);
        });
    });