var API_KEY = "pk.eyJ1IjoiY2FtaWxhYmNvaXMiLCJhIjoiY2sxNnpvdGRhMDQ2cjNvb2NpejJveWc2YyJ9.GOCEShJ6Gb7AUZ_GKYd8TA";

// Creating map object
var map = L.map("map", {
  center: [41.8341216635, -87.623664172],
  zoom: 10
});

// Adding tile layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(map);

// Boundaries for Chicago by wards 
d3.json("../db/boundaries.geojson", function (hoodData) {
  L.geoJson(hoodData).addTo(map);
});


// Cooridates and geojson data for mosquitos in Chicago 
var link = "../db/WNV2019.geojson";


// Create icons for the map
var MosquitoIcon = L.Icon.extend({
  options: {
    iconSize: [31, 21],
  }
});

var infectedIcons = L.Icon.extend({
  options: {
    iconSize: [45, 35],
  }
});

// Create specific icons
var normalIcon = new MosquitoIcon({ iconUrl: 'https://cdn.pixabay.com/photo/2019/07/06/22/04/cartoon-4321357_960_720.png' });
var infectedIcon = new infectedIcons({ iconUrl: 'http://www.transparentpng.com/thumb/circle/Hjd1yl-circle-clipart-hd.png' });


// Get GeoJSON and put on it on the map when it loads
d3.json(link, function (data) {
  // set mosquitoTraps to the dataset, and add the rodent violation GeoJSON layer to the map
  mosquitoTraps = L.geoJson(data, {
    onEachFeature: function (feature, layer) {
      layer.bindPopup('Block: ' + feature.properties.BLOCK + '<br/>' + 'Ward: ' + feature.properties.Wards);
    }, pointToLayer: function (feature, latlng) {
      if (feature.properties.RESULT == "negative") {
        var marker = L.marker(latlng, { icon: normalIcon });
      } else {
        var marker = L.marker(latlng, { icon: infectedIcon });
      };
      return marker;
    }
  }).addTo(map);
});
