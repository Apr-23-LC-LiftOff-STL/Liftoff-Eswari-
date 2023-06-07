declare class RouteBoxer {
  constructor();
  box(path: google.maps.Polyline | google.maps.LatLng[], range: number): google.maps.LatLngBounds[];
}

export default RouteBoxer;
