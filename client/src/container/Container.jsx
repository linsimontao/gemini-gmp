import React, { useEffect, useState } from 'react'
import { ImageSlider } from '../imageSlider/ImageSlider'
import { FaStar, FaWheelchair, FaBeer, FaWineBottle, } from 'react-icons/fa'
import { Map } from '../map/Map'
import Panel from '../panel/Panel'
import Photo from "../photo/Photo"

import './Container.css'
export default function Container() {
    const [poi, setPoi] = useState()
    const [placeDetail, setPlaceDetail] = useState()
    const [nearby, setNearby] = useState([])
    const getDetails = poi => {
        const body = {
            "textQuery": `${poi.locationName} in ${poi.country}`
        }
        // console.log(body)
        const response = fetch(
            'https://places.googleapis.com/v1/places:searchText', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'X-Goog-Api-Key': import.meta.env.VITE_GOOGLEMAPS_API_KEY,
                'X-Goog-FieldMask': '*'
            },
            body: JSON.stringify(body)
        })
            .then(res => res.json())
            .then(json => {
                if (json.places.length > 0) {
                    setPlaceDetail(json.places[0])
                    // console.log(placeDetail)
                }
            })
    }
    const getNearby = (place) => {
        const body = {
            "includedTypes": ["restaurant"],
            "locationRestriction": {
                "circle": {
                    "center": {
                        "latitude": place.location.latitude,
                        "longitude": place.location.longitude
                    },
                    "radius": 500.0
                }
            },
            "maxResultCount": 10
            // "rankPreference": "POPULARITY" // by default
        }
        // console.log(body)
        const response = fetch(
            'https://places.googleapis.com/v1/places:searchNearby', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'X-Goog-Api-Key': import.meta.env.VITE_GOOGLEMAPS_API_KEY,
                'X-Goog-FieldMask': '*'
            },
            body: JSON.stringify(body)
        })
            .then(res => res.json())
            .then(json => {
                console.log(json)
                if (json.places.length > 0) {
                    setNearby(json.places)
                    // console.log(placeDetail)
                }
            })
    }
    useEffect(() => {
        if (poi) {
            // console.log(poi)
            getDetails(poi)
        } else {
            setPlaceDetail(null)
        }
    }, [poi])

    useEffect(() => {
        if (placeDetail) {
            console.log(placeDetail)
            getNearby(placeDetail)
        } else {
            setNearby([])
        }
    }, [placeDetail])

    return (
        <div id='container'>
            <Photo poi={poi} setPoi={setPoi} />
            {
                placeDetail ? <Map placeDetail={placeDetail} show3DButton={true} /> : <></>
            }

            {
                poi ? <Panel placeDetail={placeDetail} nearby={nearby} /> : <></>
            }
        </div>

    )
}
