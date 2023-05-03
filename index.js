function initMap() {
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 4,
        center: { lat: -24.345, lng: 134.46 }, // Australia.
    });
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
    document.getElementById("submit-button").addEventListener("click", () => {
        const origin = document.getElementById("origin-input").value;
        const destination = document.getElementById("destination-input").value;

        displayRoute(
            origin, destination, directionsService, directionsRenderer
        );
    })
    const initialOrigin = "New York City";
    const initialDestination = "Los Angeles";
    displayRoute(initialOrigin, initialDestination, directionsService, directionsRenderer);
}

function displayRoute(origin, destination, service, display) {
    service
        .route({
            origin: origin,
            destination: destination,
            waypoints: [

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



window.initMap = initMap;