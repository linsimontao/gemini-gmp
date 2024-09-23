import React, { useEffect, useState } from 'react'
import { ImageSlider } from '../imageSlider/ImageSlider'
import { Map } from '../map/Map'
import Collapsible from 'react-collapsible'
import './Panel.css'
export default function Panel({ placeDetail, nearby }) {
    // console.log(placeDetail)

    const getImgUrls = (place) => {
        if (place.photos?.length > 0) {
            return place.photos.map(photo => {
                const imgURL = `https://places.googleapis.com/v1/${photo.name}/media?key=${import.meta.env.VITE_GOOGLEMAPS_API_KEY}&maxHeightPx=400`
                // console.log(imgURL)
                return imgURL
            })
        }
        return []
    }
    return (
        placeDetail ?
            <div className='poi-panel'>
                <ImageSlider slides={getImgUrls(placeDetail)}></ImageSlider>
                <div className='poi-container'>
                    <p className='poi-name'>{placeDetail?.displayName?.text}</p>
                    <div className='poi-sub'>
                        <p className='poi-open'>Opening: {placeDetail?.currentOpeningHours?.openNow ? "Opening" : "Closed"}</p>
                        <div className='poi-rating'>
                            <p>Ratings: {placeDetail?.rating}</p>
                        </div>
                    </div>
                    <Collapsible trigger="Opening hours">
                        {
                            placeDetail?.currentOpeningHours?.weekdayDescriptions.map(d => <p className='poi-time-detail'>{d}</p>)
                        }
                    </Collapsible>
                    <Collapsible trigger="Nearby restaurants">
                        <Map placeDetail={placeDetail} nearby={nearby}/>
                    </Collapsible>
                    <Collapsible trigger="Reviews">
                        {
                            placeDetail?.reviews?.map((review) => {
                                return (<p className='review-text'>{`${review?.authorAttribution?.displayName}: ${review?.originalText?.text}`}</p>)
                            })
                        }
                    </Collapsible>
                </div>
            </div> :
            <></>
    )
}
