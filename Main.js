/* =====================
Leaflet Configuration
===================== */
$('#previousButton').hide();

var map = L.map('map', {
  center: [38.912908, -77.023256],
  zoom: 12
});

/*
var Stamen_TonerLite = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 20,
  ext: 'png'
}).addTo(map);
*/

var CartoDB_DarkMatter = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 19
}).addTo(map);

/* =====================
Specify Data
===================== */

var dataset = "https://raw.githubusercontent.com/jc020207/Midterm/master/Grocery_Store_Locations.geojson";
var featureGroup;

/* =====================
Custom symbols
===================== */

var geojsonMarkerOptions = {
    radius: 8,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};

var smallIcon = new L.Icon({
    iconSize: [27, 27],
    iconAnchor: [13, 27],
    popupAnchor:  [1, -24],
    iconUrl: 'cart4.png'
});

/* =====================
Load Initial Slide
===================== */
$(document).ready(function() {
  $.ajax(dataset).done(function(data) {
    var parsedData = JSON.parse(data);
    featureGroup = L.geoJson(parsedData, {
      style: myStyle,
      //filter: myFilter
      pointToLayer: function (feature, latlng) {
         return L.marker(latlng, {icon: smallIcon});
      //  return L.circleMarker(latlng, geojsonMarkerOptions);
    },
      onEachFeature: function (feature, layer) {
 layer.bindPopup('<h2>'+feature.properties.STORENAME+'</h2><p>Active: '+feature.properties.PRESENT18+'</p>');
}
    }).addTo(map);
    // quite similar to _.each
    //featureGroup.eachLayer(eachFeatureFunction);
  });
});

/* =====================
Specify style
===================== */
var myStyle = function(feature) {
};

/* =====================
Define Filters
===================== */

// filters stores that are active in 1990
var filter90 = function(feature) {
  if(feature.properties.PRESENT90 == "Yes"){
  return true;}
  map.flyTo([38.912908, -77.023256],12);
};

// filters stores that opens after 1990
var filter00 = function(feature) {
  if(feature.properties.PRESENT90 == "No"){
  return true;}
  map.flyTo([38.912908, -77.023256],12);
};


// filters trader joe's
var traderfilter = function(feature) {
  if(feature.properties.STORENAME == "Trader Joe's"){
  return true;}
  map.flyTo([38.905577,-77.030000],13.5);
};

//filter whole foods
var wholefilter = function(feature) {
  if(feature.properties.STORENAME == "Whole Foods"){
  return true;}
  map.flyTo([38.927488,-77.057880],13);
};


/* =====================
Slide Models
===================== */
var slides = [
  { title: "Grocery Stores in Washington DC", description: "According to the news report from Washingtonian, now is the “Golden Age of DC Grocery Shopping”. In the past, people in Washington DC did not have many choices when it comes grocery shopping. But now, they have many! The map shows all grocery stores in Washington DC from 1990 to 2018." },
  { title: "Grocery Stores in 1990", description: "In 1990, there are only 9 grocery stores in Washington DC. And nearly all of them are Safeway Inc. It is also interesting that most of the grocery stores are concentrated on the affluent (northwest) part of the city.",
   color: "#ECF3F3" , filter: filter90},
  { title: "Grocery Stores Opened After 1990", description: "This map shows all the grocery shops opened after 1990. We can see there was a major expansion in grocery stores, and customers now have various choices.", filter:filter00},
  { title: "Trader Joe's in DC", description: "Let’s look at one of the most popular grocery shops nowadays – Trader Joe’s. There are 4 Trader Joe’s in Washington DC and they all scatter around the downtown area. This may because they have a wider range of customers.",filter:traderfilter},
  { title: "Whole Foods in DC", description: "As for Whole Foods, 4 out of 5 of them are located at the affluent (northwest) part of the city. It is likely because their target customers are people with higher income. ", filter:wholefilter }
];

var currentSlide = 0;


/* =====================
Load slide function
===================== */
var loadSlide = function(slide) {
  //remove previous layer when load
  map.removeLayer(featureGroup);
  //load slides
  $(document).ready(function() {
    $.ajax(dataset).done(function(data) {
      var parsedData = JSON.parse(data);
      featureGroup = L.geoJson(parsedData, {
        style: myStyle,
        filter: slide.filter,
        //use custom symbol
        pointToLayer: function (feature, latlng) {
           return L.marker(latlng, {icon: smallIcon});
        //  return L.circleMarker(latlng, geojsonMarkerOptions);
      },
      //define popup
        onEachFeature: function (feature, layer) {
   layer.bindPopup('<h2>'+feature.properties.STORENAME+'</h2><p>Active: '+feature.properties.PRESENT18+'</p>');
  }
      }).addTo(map);
      let i = -2;
      map.eachLayer(function(){ i=i+1; });
  $('#count').text(i);
    });
  });
  //replace titles and descriptions
  $('#title').text(slide.title);
  $('#description').text(slide.description);
  $('#sidebar').css("background-color", slide.color);
};

/* =====================
click button function
===================== */
// next function
var next = function() {
    if (currentSlide < slides.length-1){
    $('#nextButton').show();
    $('#previousButton').show();
    currentSlide = currentSlide + 1;
    loadSlide(slides[currentSlide]);}
  if (currentSlide == slides.length-1) {
    $('#nextButton').hide();
  }
};

//previous function
var previous = function() {
  if (currentSlide > 0){
  $('#previousButton').show();
  $('#nextButton').show();
  currentSlide = currentSlide - 1;
  loadSlide(slides[currentSlide]);}

if (currentSlide === 0) {
  $('#previousButton').hide();
}
};

/* =====================
run function when the button is clicked
===================== */

$('#nextButton').click(function(e) {
  next();
});
$('#previousButton').click(function(e) {
  previous();
});
