// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script
// src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">
const originInput = document.getElementById("origin-input");
const destinationInput = document.getElementById("destination-input");
const modeSelector = document.getElementById("mode-selector");


function initMap() {
    const map = new google.maps.Map(document.getElementById("map"), {
        mapTypeControl: false,
        center: { lat: -33.8688, lng: 151.2195 },
        zoom: 1,
    });

    new AutocompleteDirectionsHandler(map);
}


class AutocompleteDirectionsHandler {
    map;
    originPlaceId;
    destinationPlaceId;
    travelMode;
    directionsService;
    directionsRenderer;
    constructor(map) {
        this.map = map;
        this.originPlaceId = "";
        this.destinationPlaceId = "";
        this.travelMode = google.maps.TravelMode.WALKING;
        this.directionsService = new google.maps.DirectionsService();
        this.directionsRenderer = new google.maps.DirectionsRenderer();
        this.directionsRenderer.setMap(map);


        // Specify just the place data fields that you need.
        const originAutocomplete = new google.maps.places.Autocomplete(
            originInput,
            { fields: ["place_id"] }
        );
        // Specify just the place data fields that you need.
        const destinationAutocomplete = new google.maps.places.Autocomplete(
            destinationInput,
            { fields: ["place_id"] }
        );
        const directionsService = new google.maps.DirectionsService();
        const directionsRenderer = new google.maps.DirectionsRenderer({
            draggable: true,
            map,
            panel: document.getElementById("panel"),
        });
        directionsRenderer.addListener("directions_changed", () => {
            const directions = directionsRenderer.getDirections();
            if (directions) {
                computeTotalDistance(directions);
            }
        });

        //geocode();



        originInput.addEventListener("submit", geocode)


        function geocode(e) {
            e.preventDefault();
            let location = document.getElementById("location-input").value

            axios.get("https://maps.googleapis.com/maps/api/geocode/json", {
                params: {
                    address: location,
                    key: "AIzaSyB2X3kIDgVjzB4oBpL02fB0VMeuIg2t7b4"
                }
            })
                .then(function (response) {
                    let formattedAddress = response.data.results[0].formatted_address;
                    let formattedAddressOutput = `
                    <ul class="list-group">
                    <li class = "list-group-item">${formattedAddress}</li>
                    </ul>`;

                    let addressComponents = response.data.results[0].address_components
                    let addressComponentsOutput = `<ul class="list-group">`;
                    for (let i = 0; i < addressComponents.length; i++) {
                        addressComponentsOutput += `<li class = "list-group-item"><strong>${addressComponents[i].types[0]}</strong>: ${addressComponents[i].long_name}</li>
                        `;
                    }
                    addressComponentsOutput += '</ul>'

                    //geometry
                    let lat = response.data.results[0].geometry.location.lat;
                    let lng = response.data.results[0].geometry.location.lng;

                    let geometryOutput = `
                    <ul class="list-group">
                    <li class = "list-group-item">Latitude:${lat}</li>
                    <li class = "list-group-item">Longitude::${lng}</li>
                    </ul>`;
                    //output to app
                    document.getElementById('formatted-address').innerHTML = formattedAddressOutput;
                    document.getElementById('address-components').innerHTML = addressComponentsOutput;
                    document.getElementById('geometry').innerHTML = geometryOutput;


                })
                .catch(function (error) {
                    console.log(error)
                })
        }

        displayRoute(
            "stl",
            "dallas",
            directionsService,
            directionsRenderer
        );

        function displayRoute(origin, destination, service, display) {
            service
                .route({
                    origin: origin,
                    destination: destination,
                    waypoints: [
                        { location: "kansas city, MO" },

                    ],
                    travelMode: google.maps.TravelMode.DRIVING,
                    avoidTolls: true,
                })
                .then((result) => {
                    display.setDirections(result);
                })
                .catch((e) => {
                    alert("Could not display directions due to: " + e);
                });
        }



        function computeTotalDistance(result) {
            let total = 0;
            const myroute = result.routes[0];

            if (!myroute) {
                return;
            }

            for (let i = 0; i < myroute.legs.length; i++) {
                total += myroute.legs[i].distance.value;
            }

            total = total / 1000;
            document.getElementById("total").innerHTML = total + " km";
        }


        this.setupClickListener(
            "changemode-walking",
            google.maps.TravelMode.WALKING
        );
        this.setupClickListener(
            "changemode-transit",
            google.maps.TravelMode.TRANSIT
        );
        this.setupClickListener(
            "changemode-driving",
            google.maps.TravelMode.DRIVING
        );
        this.setupPlaceChangedListener(originAutocomplete, "ORIG");
        this.setupPlaceChangedListener(destinationAutocomplete, "DEST");
        this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(originInput);
        this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(
            destinationInput
        );
        this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(modeSelector);
    }
    // Sets a listener on a radio button to change the filter type on Places
    // Autocomplete.
    setupClickListener(id, mode) {
        const radioButton = document.getElementById(id);

        radioButton.addEventListener("click", () => {
            this.travelMode = mode;
            this.route();
        });
    }
    setupPlaceChangedListener(autocomplete, mode) {
        autocomplete.bindTo("bounds", this.map);
        autocomplete.addListener("place_changed", () => {
            const place = autocomplete.getPlace();

            if (!place.place_id) {
                window.alert("Please select an option from the dropdown list.");
                return;
            }

            if (mode === "ORIG") {
                this.originPlaceId = place.place_id;
            } else {
                this.destinationPlaceId = place.place_id;
            }

            this.route();
        });
    }
    route() {
        if (!this.originPlaceId || !this.destinationPlaceId) {
            return;
        }

        const me = this;

        this.directionsService.route(
            {
                origin: { placeId: this.originPlaceId },
                destination: { placeId: this.destinationPlaceId },
                travelMode: this.travelMode,
            },
            (response, status) => {
                if (status === "OK") {
                    me.directionsRenderer.setDirections(response);
                } else {
                    window.alert("Directions request failed due to " + status);
                }
            }
        );
    }
}


window.initMap = initMap;