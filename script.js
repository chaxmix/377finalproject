$(document).ready(function() {
  const url = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2023-01-01&endtime=2023-04-30&minmagnitude=2.5&limit=500";

  $.get(url, function(response) {
    const earthquakes = response.features;

    const markers = [];
    const map = L.map('map').setView([38.98, -76.93], 13);

    for (let i = 0; i < earthquakes.length; i++) {
      const earthquake = earthquakes[i];
      const coordinates = earthquake.geometry.coordinates;
      const magnitude = earthquake.properties.mag;

      const marker = L.circleMarker([coordinates[1], coordinates[0]], {
        radius: magnitude * 5,
        fillColor: "#f00",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      });

      markers.push(marker);
    }

    const earthquakeLayer = L.layerGroup(markers);
    earthquakeLayer.addTo(map);
  });
});