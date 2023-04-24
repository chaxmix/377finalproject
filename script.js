// Fetch data from USGS earthquake API
async function fetchData() {
    const response = await fetch('https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2023-01-01&endtime=2023-04-23');
    const data = await response.json();
    return data.features;
  }
  
  // Process the fetched data using array methods
  async function processData() {
    const data = await fetchData();
    const processedData = data
      .filter(feature => feature.properties.mag >= 5)
      .map(feature => ({
        magnitude: feature.properties.mag,
        location: feature.properties.place,
        coordinates: feature.geometry.coordinates,
      }))
      .sort((a, b) => b.magnitude - a.magnitude);
    return processedData;
  }
  
  // Use processed data in a visualization library
  async function displayData() {
    const processedData = await processData();
    console.log(processedData);
  }
  // IDK how to make this work with the html to make it visible 
  
  displayData();