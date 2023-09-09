import { Marker, Popup, useMapEvent } from 'react-leaflet';
import { MapContainer } from 'react-leaflet/MapContainer'
import { TileLayer } from 'react-leaflet/TileLayer'
import "leaflet/dist/leaflet.css";
import { Post } from '../types/post';
import { LatLngTuple, marker } from 'leaflet';
import L from 'leaflet';
import React from 'react';

function SetViewOnClick() {
    const map = useMapEvent('click', (e) => {
      console.log(e.latlng);
    })
  
    return null
}

function Map(props: {posts: Post[]}) {
    const position : [number, number] = [47.6061, -122.3328]
    const markers : [[number, number]]= [[47.6061, -122.3328]];

    return (
        <>
            <div style={{ height : "100%" }}>
                <MapContainer center={position} zoom={13} scrollWheelZoom={true} style={{ height: "100%", minHeight: "100%" }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {props.posts.map((post, idx) =>
                        <Marker position={post.location as LatLngTuple}>
                            <Popup className='mapPopup'>
                                <h2>{post.display_name}</h2>
                                <p>{post.description}</p>
                            </Popup>
                        </Marker>
                    )}
                    <SetViewOnClick/>
                </MapContainer>
                
            </div>
        </>
    )
}

export default Map