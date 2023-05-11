$(document).ready(function() {
  const localStorageKey = 'earthquakeData';

  function saveDataToLocalStorage(data) {
    localStorage.setItem(localStorageKey, JSON.stringify(data));
  }

  function getDataFromLocalStorage() {
    const data = localStorage.getItem(localStorageKey);
    return data ? JSON.parse(data) : null;
  }

  function fetchData(location, date, magnitude) {
    const formattedDate = date && date instanceof Date && !isNaN(date) ? date.toISOString().split('T')[0] : '';
    const url = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${formattedDate}&endtime=${formattedDate}&minmagnitude=${magnitude}&limit=500`;
    console.log("Fetching data from API...");

    $.get(url, function(response) {
      const earthquakes = response.features;

      console.log("Received earthquake data:", earthquakes);

      saveDataToLocalStorage(earthquakes);
      renderMarkers(earthquakes);
    });
  }

  function renderMarkers(earthquakes) {
    console.log("Rendering markers on the map...");
  
    const markers = [];
    const mapElement = document.getElementById('map');
    
    let map;
    if (mapElement.hasChildNodes()) {
      map = mapElement._leaflet_map;
    } else {
      map = L.map('map').setView([38.98, -76.93], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(map);
    } 

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
      
      if (map && map.addLayer) {
        earthquakeLayer.addTo(map);
      }
    }

    $('#search-form').submit(function(e) {
      e.preventDefault();
      const location = $('#location-input').val();
      const date = new Date($('#date-input').val());
      const magnitude = parseFloat($('#magnitude-input').val()) || 0;
      fetchData(location, date, magnitude);
    });

    function init() {
      console.log("Initializing the application...");

      const savedData = getDataFromLocalStorage();
      if (savedData && savedData.length > 0) {
        console.log("Using saved earthquake data from local storage:", savedData);
        renderMarkers(savedData);
      } else {
        console.log("No saved data found. Fetching fresh data from API...");
        fetchData();
      }
    }
  
    init();
  
    $('#refresh-btn').click(function() {
      fetchData();
    });
  });