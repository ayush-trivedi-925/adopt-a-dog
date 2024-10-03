maptilersdk.config.apiKey = maptilerApiKey;

const map = new maptilersdk.Map({
  container: "map",
  style: maptilersdk.MapStyle.BRIGHT,
  center: dog.geometry.coordinates, // starting position [lng, lat]
  zoom: 10, // starting zoom
});

new maptilersdk.Marker()
  .setLngLat(dog.geometry.coordinates)
  .setPopup(
    new maptilersdk.Popup({ offset: 25 }).setHTML(
      `<h3>${dog.name}</h3><p>${dog.location}</p>`
    )
  )
  .addTo(map);
