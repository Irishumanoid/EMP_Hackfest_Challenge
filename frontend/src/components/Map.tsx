import { Marker, Popup, useMapEvent } from 'react-leaflet';
import { MapContainer } from 'react-leaflet/MapContainer'
import { TileLayer } from 'react-leaflet/TileLayer'
import "leaflet/dist/leaflet.css";
import { Post } from '../types/post';
import { LatLng, LatLngTuple } from 'leaflet';
import { useEffect, useRef } from 'react';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import { useMap } from 'react-leaflet';

function SetViewOnClick(props: {selectedPost: Post|undefined, addLocation: (loc: number[])=>void, mapDiv: React.RefObject<HTMLDivElement>}) {

    const map = useMapEvent('contextmenu', (e) => {
        props.addLocation([e.latlng.lat, e.latlng.lng]);
        console.log(e.latlng);
    });

    useEffect(()=>{
        if (props.selectedPost) {
            map.setView(props.selectedPost.location as LatLngTuple, Math.max(map.getZoom(), 15));
        }
    }, [props.selectedPost])

    useEffect(()=>{
        if (!props.mapDiv.current) return;

        const resizeObserver = new ResizeObserver(() => {
            console.log("resize")
            map.invalidateSize();
        });
        resizeObserver.observe(props.mapDiv.current);
    }, [props.mapDiv])

    return null
}

const SearchField = () => {
    const provider = new OpenStreetMapProvider();
  
    // @ts-ignore
    const searchControl = new GeoSearchControl({
      provider: provider,
    });
  
    const map = useMap();
    useEffect(() => {
      map.addControl(searchControl);
      return () => {map.removeControl(searchControl)};
    }, []);
  
    return null;
};

function Map(props: {posts: Post[], selectedPost: Post|undefined, setSelectedPost: (post: Post|undefined)=>void, addLocation: (loc: number[])=>void}) {
    const position : [number, number] = [47.6061, -122.3328];
    const mapDiv = useRef<HTMLDivElement>(null);

    


    return (
        <>
            <div style={{ height : "100%" }} ref={mapDiv}>
                <MapContainer center={position} zoom={13} scrollWheelZoom={true} style={{ height: "100%", minHeight: "100%" }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {props.posts.map((post, index) =>
                        <Marker key={index} position={post.location as LatLngTuple} eventHandlers={{
                            click: () => {
                              props.setSelectedPost(post);
                            },
                          }}>
                            <Popup className='mapPopup'>
                                <div className='text-lg font-semibold line-clamp-1'>{post.display_name}</div>
                                <div className='text-sm line-clamp-2'>{post.description}</div>
                            </Popup>
                        </Marker>
                    )}
                    <SetViewOnClick selectedPost={props.selectedPost} addLocation={props.addLocation} mapDiv={mapDiv}/>

                    <SearchField/>
                </MapContainer>
                
            </div>
        </>
    )
}

export default Map