$(document).ready(function () {
  toggleTabs();
  vehicleChart();
  drawMap();
  handleDropdown();
});

/**
 * Handles the opening and closing of dropdown menus.
*/
function handleDropdown() {
  // on open
  $('[open-menu]').click(function(){
    var root = $(this).parents('[menu-root]'),
    isOpened = root.hasClass('active');

    $('[menu-root].active').removeClass('active');
    if (!isOpened) {
      root.toggleClass('active');
    }
  })
  // on close
  $('[menu-name] a').click(function(){
    $(this).parents('[menu-root]').removeClass('active');
  })
}

/**
 * Toggles tabs based on the specified attributes and classes.
*/
function toggleTabs() {
  $("[toggle]").click(function () {
    var eSelector = $(this).attr("toggle");
    var allTabs = eSelector.substr(0, 3);

    var allBtns = $("[toggle^=" + allTabs + "]");
    $(allBtns).removeClass("active");

    var btn = $("[toggle=" + eSelector + "]");
    $(btn).toggleClass("active");

    var elList = $("[data-toggle-tab^=" + allTabs + "]");
    var element = $("[data-toggle-tab=" + eSelector + "]");

    if (element.hasClass("active")) {
      elList.slideUp().removeClass("active");
      btn.removeClass("active");
    } else {
      elList.slideUp().removeClass("active");
      element.slideDown().addClass("active");
    }
  });
}

/**
 * Generates a pie chart displaying the distribution of active and in-active vehicles.
*/
function vehicleChart() {
  anychart.onDocumentReady(function () {
    var chartData = [
      ["Active Vehicles", 60],
      ["In-Active Vehicles", 40],
    ];
    var chart = anychart.pie(chartData);

    chart.palette(["#CAE4FA", "#1070C5"]);

    chart.labels().position("outside");

    chart
      .labels()
      .useHtml(true)
      .format(function () {
        var index = this.index;
        if (index >= 0 && index < chartData.length) {
          return `${chartData[index]}%`;
        }
        return this.value;
      });

    chart
      .legend()
      .enabled(false)
      .position("center-bottom")
      .itemsLayout("horizontal")
      .align("center");

    // Get hovered state.
    var state = chart.hovered();

    state.fill("#1785c6");

    chart.container("vehicle-chart");
    chart.draw();
    chart.hover([1]);
  });
}

/**
 * Draws a map with a path, pins, and custom popups.
*/
function drawMap() {
  // Define the path coordinates
  var pathCoordinates = [
    [24.4538, 54.377],
    [24.4536, 54.3771],
    [24.4537, 54.3774],
    [24.45398, 54.3773],
    [24.45398, 54.37714],
  ];
  var map = L.map("map", {
    maxZoom: 20, 
    zoomControl: false, 
    dragging: false
  }).setView(pathCoordinates[0], 20);

  // Disable scroll wheel zoom
  map.scrollWheelZoom.disable();

  // Add the tile layer
  L.tileLayer("http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}", {
    subdomains: ["mt0", "mt1", "mt2", "mt3"],
    maxZoom: 20,
  }).addTo(map);

  var pinIcons = {
    normal: "map-pin",
    first: "map-first-pin",
    last: "map-last-pin",
  };

  // Create a polyline for the path
  var path = L.polyline(pathCoordinates, { color: "#008AD2" }).addTo(map);
  var polygon = L.polygon(pathCoordinates, {
    color: "#008AD331",
    fillOpacity: 0.5,
  }).addTo(map);

  // Create clickable pins
  pathCoordinates.forEach(function (coord, index) {
    var pinIcon, pathUrl;

    if (index === 0) {
      pathUrl = pinIcons.first;
    } else if (index === pathCoordinates.length - 1) {
      pathUrl = pinIcons.last;
    } else {
      pathUrl = pinIcons.normal;
    }
    pinIcon = L.icon({
      iconUrl: "layout/images/" + pathUrl + ".png",
      iconSize: [45, 55],
      iconAnchor: [21, 35],
    });

    var marker = L.marker(coord, { icon: pinIcon }).addTo(map);

    // Add click event listener to each pin
    marker.on("click", function () {
      var popupContent = `<div class="custom-pin-modal">
      <button><img src="layout/images/map-icon-1.png" /></button>
      <button><img src="layout/images/map-icon-2.png" /></button>
      <button><img src="layout/images/map-icon-3.png" /></button>
    </div>`;
    
      
      marker.bindPopup(popupContent).openPopup();
    });
  });
}
