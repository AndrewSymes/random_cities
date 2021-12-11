mapboxgl.accessToken = 'pk.eyJ1IjoiYW5kcmV3c3ltZXMiLCJhIjoiY2p3Y3phZ2F5MGR4dzN5bzgzNjFlc2JjOCJ9.nlgO5nCjwo8RqxsdYa65SQ';
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10',
    center: [-96, 37.8],
    zoom: 2
});

map.on('load', () => {
    fetch("cities.json")
        .then(response => response.json())
        .then(cities => {
            for (city in cities) {

                var mark = new mapboxgl.Marker()
                    .setLngLat([cities[city].lon, cities[city].lat])
                    .addTo(map)
                var label = document.createElement("p")
                label.innerHTML = cities[city].name
                label.classList.add("city-mark-label")
                mark.getElement().append(label)
                mark.getElement().addEventListener('click', function(index) {

                    return function() {
                        window.event.cancelBubble = true
                        window.location.href = "cityPage.html#?cityIndex=" + index;
                    };
                }(city));
            }
        }).catch(err => {
            console.error(err);
        });
})

map.on('click', (e) => {
    var mark = new mapboxgl.Marker()
        .setLngLat([e.lngLat.lng, e.lngLat.lat])
        .addTo(map)
    var label = document.createElement("p")
    label.innerHTML = "View Location"
    label.classList.add("city-mark-label")
    mark.getElement().append(label)
    mark.getElement().addEventListener('click', function() {
        window.event.cancelBubble = true
        window.location.href = "cityPage.html#?lnglat=" + e.lngLat.lng + "," + e.lngLat.lat;
    });
});