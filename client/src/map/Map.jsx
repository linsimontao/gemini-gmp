import { Loader } from "@googlemaps/js-api-loader"
import { useRef, useEffect, useState, useCallback } from "react"
import "./Map.css"

const loader = new Loader({
    apiKey: import.meta.env.VITE_GOOGLEMAPS_API_KEY,
    version: "alpha",
    libraries: ["places", "marker", "maps3d"]
});

const mapOptions = {
    center: {
        lat: 37.422042876128415,
        lng: -122.08532894485894
    },
    mapTypeControl: false,
    fullscreenControl: false,
    zoom: 6,
    mapId: '4504f8b37365c3d0',
};

const createMarkerContent = (number, name) => {
    const content = document.createElement("div");

    content.classList.add("restaurant");
    content.innerHTML = `
    <div class="marker-label">
        ${number}
    </div>
    <div class="details">
        <div class="price">${name}</div>
    </div>
    `;
    return content;
}

const toggleHighlight = (markerView) => {
    if (markerView.content.classList.contains("highlight")) {
        markerView.content.classList.remove("highlight");
        markerView.zIndex = null;
    } else {
        markerView.content.classList.add("highlight");
        markerView.zIndex = 1;
    }
}

export const Map = ({ placeDetail, nearby, show3DButton }) => {
    const [map, setMap] = useState()
    const [map3d, setMap3d] = useState()
    const [mapContainer, setMapContainer] = useState(null);
    const containerRef = useCallback(
        (value) => setMapContainer(value),
        [setMapContainer]
    );
    const [b3D, setB3D] = useState(false)
    const [markerView, setMarkerView] = useState()
    const [google, setGoogle] = useState()
    const markerListRef = useRef([])
    const ref = useRef()

    const btnHandler = () => {
        setB3D(!b3D)
    }

    useEffect(() => {
        loader
            .load()
            .then(google => {
                setGoogle(google)
                const map = new window.google.maps.Map(ref.current, mapOptions);
                // console.log(window.google.maps)
                // const map3d = document.createElement('gmp-map-3d');
                const map3d = new window.google.maps.maps3d.Map3DElement()
                const markerView = new google.maps.marker.AdvancedMarkerElement({
                    map,
                    position: mapOptions.center,
                    title: 'poi',
                });
                setMap(map)
                setMap3d(map3d)
                setMarkerView(markerView)
            })
            .catch(e => {
                console.error(e)
            })
    }, [])

    useEffect(() => {
        if (map && placeDetail && markerView) {
            // console.log(placeDetail)
            if (placeDetail.location) {
                map.setCenter({ lat: placeDetail.location.latitude, lng: placeDetail.location.longitude })
                // console.log(`${placeDetail.location.latitude},${placeDetail.location.longitude}`)
                map.setZoom(16)
                markerView.position = { lat: placeDetail.location.latitude, lng: placeDetail.location.longitude }
            }
        }
    }, [map, placeDetail, markerView])

    useEffect(() => {

        google && nearby?.map((restaurant, idx) => {
            const marker = new google.maps.marker.AdvancedMarkerElement({
                map,
                position: { lat: restaurant.location.latitude, lng: restaurant.location.longitude },
                title: 'poi',
                content: createMarkerContent(idx + 1, restaurant.displayName.text),
                gmpClickable: true
            });
            marker.addListener("click", ({ domEvent, latLng }) => {
                toggleHighlight(marker);
            });
            markerListRef.current.push(marker)
        })
    }, [map, nearby, google])

    useEffect(() => {
        if (mapContainer && map3d && placeDetail) {
            map3d.center = {
                lat: placeDetail.location.latitude,
                lng: placeDetail.location.longitude,
                altitude: 400
            };
            // map.heading = 60.39;
            // map3d.tilt = 20;
            map3d.roll = 20;
            map3d.range = 400;
            mapContainer.appendChild(map3d);
        }
    }, [mapContainer, map3d, placeDetail])

    return show3DButton ?
        <>
            <button id="switch" onClick={btnHandler}>{b3D ? "2D" : "3D"}</button>
            {/* <div ref={b3D? containerRef: ref} id="map3d" /> */}
            <div className={b3D ? "show" : "noshow"} ref={containerRef} id="map3d" />
            <div className={b3D ? "noshow" : "show"} ref={ref} id="map2d" />
        </> :
        <>
            <div className="embeded" ref={ref} />
        </>
}
