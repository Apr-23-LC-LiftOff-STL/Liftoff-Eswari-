"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.push(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.push(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppComponent = void 0;
var core_1 = require("@angular/core");
var AppComponent = exports.AppComponent = function () {
    var _classDecorators = [(0, core_1.Component)({
            selector: 'app-root',
            templateUrl: './app.component.html',
            styleUrls: ['./app.component.css']
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AppComponent = _classThis = /** @class */ (function () {
        function AppComponent_1() {
            this.title = 'alongtheway-frontend';
        }
        AppComponent_1.prototype.ngAfterViewInit = function () {
            var _this = this;
            this.loadGoogleMapsApi().then(function () {
                _this.initMap();
            });
        };
        AppComponent_1.prototype.loadGoogleMapsApi = function () {
            return new Promise(function (resolve, reject) {
                if (typeof google !== 'undefined') {
                    resolve();
                    return;
                }
                var script = document.createElement('script');
                script.src = 'https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places';
                script.async = true;
                script.defer = true;
                script.onload = function () {
                    resolve();
                };
                script.onerror = function (error) {
                    reject(error);
                };
                document.body.appendChild(script);
            });
        };
        AppComponent_1.prototype.initMap = function () {
            var _this = this;
            var _a;
            var map = new google.maps.Map(document.getElementById("map"), {
                zoom: 4,
                center: { lat: -24.345, lng: 134.46 }, // Australia.
            });
            var directionsService = new google.maps.DirectionsService();
            var directionsRenderer = new google.maps.DirectionsRenderer({
                draggable: true,
                map: map,
                panel: document.getElementById("panel"),
            });
            directionsRenderer.addListener("directions_changed", function () {
                var directions = directionsRenderer.getDirections();
                if (directions) {
                    _this.computeTotalDistance(directions);
                }
            });
            (_a = document.getElementById("submit-button")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function () {
                var origin = document.getElementById("origin-input").value;
                var destination = document.getElementById("destination-input").value;
                _this.displayRoute(origin, destination, directionsService, directionsRenderer);
            });
            var initialOrigin = "New York City";
            var initialDestination = "Los Angeles";
            this.displayRoute(initialOrigin, initialDestination, directionsService, directionsRenderer);
        };
        AppComponent_1.prototype.displayRoute = function (origin, destination, service, display) {
            service
                .route({
                origin: origin,
                destination: destination,
                waypoints: [],
                travelMode: google.maps.TravelMode.DRIVING,
                avoidTolls: true,
            })
                .then(function (result) {
                display.setDirections(result);
            })
                .catch(function (e) {
                alert("Could not display directions due to: " + e);
            });
        };
        AppComponent_1.prototype.computeTotalDistance = function (result) {
            var total = 0;
            var myroute = result.routes[0];
            if (!myroute) {
                return;
            }
            for (var i = 0; i < myroute.legs.length; i++) {
                total += myroute.legs[i].distance.value;
            }
            total = total / 1000;
            document.getElementById("total").innerHTML = total + " km";
        };
        return AppComponent_1;
    }());
    __setFunctionName(_classThis, "AppComponent");
    (function () {
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name }, null, _classExtraInitializers);
        AppComponent = _classThis = _classDescriptor.value;
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AppComponent = _classThis;
}();
