

let map;

async function initMap() {
    // The location of Uluru
    const position = { lat: -25.344, lng: 131.031 };
    // Request needed libraries.
    //@ts-ignore
    const { Map } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerView } = await google.maps.importLibrary("marker");

    // The map, centered at Uluru
    map = new Map(document.getElementById("map"), {
        zoom: 4,
        center: position,
        mapId: "DEMO_MAP_ID",
    });

    // The marker, positioned at Uluru
    const marker = new AdvancedMarkerView({
        map: map,
        position: position,
        title: "Uluru",
    });
}

initMap();

// geocode function
//geocode()

let locationForm = document.getElementById("location-form")

locationForm.addEventListener('submit', geocode)

function geocode(e) {
    e.preventDefault();

    let location = document.getElementById('location-input').value;
    axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
            address: location,
            key: 'AIzaSyB2X3kIDgVjzB4oBpL02fB0VMeuIg2t7b4'
        }
    })
        .then(function (response) {
            console.log(response)
            //formatted addres
            let formattedAddress = response.data.results[0].formatted_address;
            let formattedAddressOutput = `
            <ul class="list-group">
                <li class ="list-group-item">${formattedAddress}</li>
            `
            //address components
            let addressComponents = response.data.results[0].address_components;
            let addressComponentsOutput = '<ul class="list-group';
            for (let i = 0; i < addressComponents.length; i++) {
                addressComponentsOutput +=
                    `
                <li class="list-group-item"><strong>${addressComponents[i].types[0]}</strong>: ${addressComponents[i].long_name}</li>
                `
            }
            addressComponentsOutput += '</ul>'
            //geometry
            let lat = response.data.results[0].geometry.location.lat;
            let lng = response.data.results[0].geometry.location.lng;
            let geometryOutput = `
                <ul class="list-group">
                    <li class="list-group-item"><strong>latitude</strong>:
                    ${lat}</li>
                    <li class="list-group-item"><strong>longitude</strong>:
                    ${lng}</li>
                    
                    `

            // output to app
            document.getElementById("formatted-address").innerHTML =
                formattedAddressOutput;
            document.getElementById("address-components").innerHTML =
                addressComponentsOutput;
            document.getElementById("geometry").innerHTML =
                geometryOutput;
        })
        .catch(function (error) {
            console.log(error)
        })
}






(g => { var h, a, k, p = "The Google Maps JavaScript API", c = "google", l = "importLibrary", q = "__ib__", m = document, b = window; b = b[c] || (b[c] = {}); var d = b.maps || (b.maps = {}), r = new Set, e = new URLSearchParams, u = () => h || (h = new Promise(async (f, n) => { await (a = m.createElement("script")); e.set("libraries", [...r] + ""); for (k in g) e.set(k.replace(/[A-Z]/g, t => "_" + t[0].toLowerCase()), g[k]); e.set("callback", c + ".maps." + q); a.src = `https://maps.${c}apis.com/maps/api/js?` + e; d[q] = f; a.onerror = () => h = n(Error(p + " could not load.")); a.nonce = m.querySelector("script[nonce]")?.nonce || ""; m.head.append(a) })); d[l] ? console.warn(p + " only loads once. Ignoring:", g) : d[l] = (f, ...n) => r.add(f) && u().then(() => d[l](f, ...n)) })
    ({ key: "AIzaSyB2X3kIDgVjzB4oBpL02fB0VMeuIg2t7b4", v: "beta" });