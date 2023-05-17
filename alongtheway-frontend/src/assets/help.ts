import polyline from "google-polyline";

let waypoints: number[][] = [];
let map: google.maps.Map;
let service: google.maps.places.PlacesService;

function initMap() {
  const directionsService = new google.maps.DirectionsService();
  const directionsRenderer = new google.maps.DirectionsRenderer();

  const mapOptions: google.maps.MapOptions = {
    zoom: 7,
    center: { lat: 19.07596, lng: 72.87764 },
  };

  map = new google.maps.Map(document.getElementById("map")!, mapOptions);

  const request: google.maps.DirectionsRequest = {
    origin: "mumbai",
    destination: "pune",
    travelMode: "DRIVING",
  };

  directionsService.route(request, function (result, status) {
    if (status === google.maps.DirectionsStatus.OK) {
      directionsRenderer.setDirections(result);
      waypoints = polyline.decode(result.routes[0].overview_polyline) as number[][];
    }

    const PolygonCoords = PolygonPoints();
    const PolygonBound = new google.maps.Polygon({
      paths: PolygonCoords,
      strokeColor: "#FF0000",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#FF0000",
      fillOpacity: 0.35,
    });

    PolygonBound.setMap(map);

    service = new google.maps.places.PlacesService(map);
    for (let j = 0; j < waypoints.length; j += 40) {
      service.nearbySearch(
        {
          location: { lat: waypoints[j][0], lng: waypoints[j][1] },
          radius: '20000',
          type: ['restaurant']
        },
        callback
      );

      function callback(results: google.maps.places.PlaceResult[], status: google.maps.places.PlacesServiceStatus) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          for (let i = 0; i < results.length; i++) {
            if (google.maps.geometry.poly.containsLocation(results[i].geometry!.location!, PolygonBound)) {
              new google.maps.Marker({
                position: results[i].geometry!.location!,
                map,
                title: "Hello World!"
              });
            }
          }
        }
      }
    }
  });

  directionsRenderer.setMap(map);
}

function PolygonPoints() {
  let polypoints = waypoints;
  let PolyLength = polypoints.length;

  let UpperBound: google.maps.LatLngLiteral[] = [];
  let LowerBound: google.maps.LatLngLiteral[] = [];

  for (let j = 0; j <= PolyLength - 1; j++) {
    let NewPoints = PolygonArray(polypoints[j][0]);
    UpperBound.push({ lat: NewPoints[0], lng: polypoints[j][1] });
    LowerBound.push({ lat: NewPoints[1], lng: polypoints[j][1] });
  }
  let reversebound = LowerBound.reverse();

  let FullPoly = UpperBound.concat(reversebound);

  return FullPoly;
}

function PolygonArray(latitude: number) {
  const R = 6378137;
  const pi = 3.14;
  //distance in meters
  const upper_offset = 300;
  const lower_offset = -300;

  const Lat_up = upper_offset / R;
  const Lat_down = lower_offset / R;
  //OffsetPosition, decimal degrees
  const lat_upper = latitude + (Lat_up * 180) / pi;
  const lat_lower = latitude + (Lat_down * 180) / pi;

  return [lat_upper, lat_lower];
}

const script = document.createElement("script");
script.src = "https://maps.googleapis.com/maps/api/js?key=&callback=initMap&libraries=places";
script.defer = true;
window.initMap = function () {
  initMap();
};
document.head.appendChild(script);
