import { Marker, Popup } from 'react-leaflet';
import { MapContainer } from 'react-leaflet/MapContainer'
import { TileLayer } from 'react-leaflet/TileLayer'
import "leaflet/dist/leaflet.css";

function Map(props: {posts: any[]}) {
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
                    {markers.map((pos, idx) =>
                        <Marker position={pos}>
                            <Popup>
                                hi
                            </Popup>
                        </Marker>
                    )}
                </MapContainer>
                
            </div>
        </>
    )
}

export default Map