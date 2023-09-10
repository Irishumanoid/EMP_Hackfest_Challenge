import { LatLngTuple } from 'leaflet';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';

function LocationScreenshot(props: {loc: number[], zoom: number}) {
    // const x = (props.loc[1] + 180) / 360 * Math.pow(2, props.zoom);
    // const y = Math.pow(2, props.zoom) * (1 - Math.log(Math.tan(props.loc[0] * Math.PI / 180) + 1 / Math.cos(props.loc[0] * Math.PI / 180)) / Math.PI) / 2

    return (
        // <div className="relative">
        //     <img src={`https://tile.openstreetmap.org/${props.zoom}/${Math.floor(x)}/${Math.floor(y)}.png`} alt="map" />
        //     <div className="absolute" style={{top: `${(y%1)*100}%`, left: `${(x%1)*100}%`}}><PlaceIcon className="text-red-500 -translate-y-full -translate-x-1/2" fontSize="large" filter='drop-shadow(3px 5px 2px rgb(0 0 0 / 0.4))'></PlaceIcon></div>
        // </div>
        <MapContainer center={props.loc as LatLngTuple} zoom={props.zoom} 
            zoomControl={false} dragging={false} touchZoom={false} 
            scrollWheelZoom={false} boxZoom={false} doubleClickZoom={false} 
            keyboard={false} tap={false} 
            style={{ width: "20rem", height: "10rem" }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={props.loc as LatLngTuple}/>
        </MapContainer>
    )
}

export default LocationScreenshot;