import React, { useState, useRef } from "react";
import {
    GoogleMap,
    useLoadScript,
    Marker,
    Autocomplete,
} from "@react-google-maps/api";
import { TextField } from "@mui/material";

const Map: React.FC = () => {
    const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult | null>(null);
    const [searchLngLat, setSearchLngLat] = useState<google.maps.LatLngLiteral | null>(null);
    const [currentLocation, setCurrentLocation] = useState<google.maps.LatLngLiteral | null>(null);
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
    const [address, setAddress] = useState("");

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
        libraries: ["places"],
    });

    if (!isLoaded) return <div>Loading....</div>;

    const center: google.maps.LatLngLiteral = { lat: 51.509865, lng: -0.118092 };

    const handlePlaceChanged = () => {
        if (autocompleteRef.current) {
            const place = autocompleteRef.current.getPlace();
            setSelectedPlace(place);
            setSearchLngLat({
                lat: place.geometry?.location?.lat() || 0,
                lng: place.geometry?.location?.lng() || 0,
            });
            setCurrentLocation(null);
        }
    };

    const handleGetLocationClick = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setSelectedPlace(null);
                    setSearchLngLat({ lat: latitude, lng: longitude });
                    setCurrentLocation({ lat: latitude, lng: longitude });
                },
                (error) => {
                    console.log(error);
                }
            );
        } else {
            console.log("Geolocation is not supported by this browser.");
        }
    };

    const onMapLoad = (map: any) => {
        const controlDiv = document.createElement("div");
        const controlUI = document.createElement("div");
        controlUI.innerHTML = "Get Location";
        controlUI.style.backgroundColor = "white";
        controlUI.style.color = "black";
        controlUI.style.width = "100%";
        // ... (rest of your controlUI styles)
        controlUI.addEventListener("click", handleGetLocationClick);
        controlDiv.appendChild(controlUI);

        map.controls[google.maps.ControlPosition.TOP_CENTER].push(controlDiv);
    };

    return (
        <div style={{ width: '100%' }}>
            <Autocomplete
                onLoad={(autocomplete) => {
                    autocompleteRef.current = autocomplete;
                }}
                onPlaceChanged={handlePlaceChanged}
                options={{ fields: ["address_components", "geometry", "name"] }}
            >
                <input type="text" placeholder="Search for a location" />
            </Autocomplete>

            <GoogleMap
                zoom={currentLocation || selectedPlace ? 18 : 12}
                center={currentLocation || searchLngLat || center}
                mapContainerClassName="map"
                mapContainerStyle={{ position: "relative", width: "100%", height: "600px", margin: "auto" }}
                onLoad={onMapLoad}
            >
                {selectedPlace && searchLngLat && <Marker position={searchLngLat} />}
                {currentLocation && <Marker position={currentLocation} />}
            </GoogleMap>
        </div>
    );
};

export default Map;
