//json url
let link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson"

// Creating the map object
let myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 4
  });

// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Fetch the GeoJSON data
d3.json(link).then(function(data) {
    createMarkers(data.features);
});

// Function to create markers for each earthquake
function createMarkers(earthquakeData) {
    earthquakeData.forEach(feature => {
        let coords = feature.geometry.coordinates;
        let magnitude = feature.properties.mag;
        let depth = coords[2];

        // Set marker size based on magnitude
        let radius = magnitude * 4; 

        // Set marker color based on depth
        let color;
        if (depth < 10) {
            color = "green";
        } else if (depth < 30) {
            color = "yellow";
        } else if (depth < 50) {
            color = "orange";
        } else {
            color = "red";
        }

        // Create a circle marker
        L.circleMarker([coords[1], coords[0]], {
            radius: radius,
            fillColor: color,
            color: color,
            fillOpacity: 0.4,
            weight: 1
        })
        .bindPopup(`<strong>Location:</strong> ${feature.properties.place}<br><strong>Magnitude:</strong> ${magnitude}<br><strong>Depth:</strong> ${depth} km`)
        .addTo(myMap);
    });

// Add the legend to the map
addLegend();
}

// Function to add a legend to the map
function addLegend() {
    let legend = L.control({ position: 'bottomright' });

    legend.onAdd = function () {
        let div = L.DomUtil.create('div', 'legend');
        div.innerHTML += '<strong>Depth (km)</strong><br>';
        div.innerHTML += '<i style="background: green; width: 20px; height: 20px; display: inline-block;"></i> < 10<br>';
        div.innerHTML += '<i style="background: yellow; width: 20px; height: 20px; display: inline-block;"></i> 10 - 30<br>';
        div.innerHTML += '<i style="background: orange; width: 20px; height: 20px; display: inline-block;"></i> 30 - 50<br>';
        div.innerHTML += '<i style="background: red; width: 20px; height: 20px; display: inline-block;"></i> > 50<br>';
        return div;
    };

    legend.addTo(myMap);
}