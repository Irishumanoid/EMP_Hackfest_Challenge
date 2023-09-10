import { Button, TextField } from "@mui/material";
import LocationScreenshot from "./LocationScreenshot";

function ShareLocationPopup(props: {onCancel: ()=>void, onSubmit: ()=>void, uploadLocation: number[]}) {

    return (
        <div className="absolute top-0 right-0 left-0 bottom-0 z-[1000] px-2 bg-black bg-opacity-50 flex flex-col justify-center items-center">
            <div className="max-w-md w-full flex flex-col p-4 sm:p-8 items-center rounded-lg shadow-lg bg-gradient-to-b from-light-300 to-light-400" onClick={(e)=>e.stopPropagation()}>
                <div className="text-2xl font-bold mb-2">Share a Location</div>
                
                <div className="w-full mt-1">
                    <TextField id="standard-required" label="Name of Location" variant="outlined" size="small" className="w-full"/>
                </div>
                <div className="w-full mt-3">
                    <TextField id="standard-multiline" label="Description" multiline rows={6} variant="outlined" size="small" className="w-full"/>
                </div>
                
                <div className="rounded-lg shadow-lg overflow-hidden mt-4 mb-1">
                    <LocationScreenshot loc={props.uploadLocation} zoom={18}></LocationScreenshot>
                </div>
                <div className="text-sm mt-1">
                    <span>Google Maps: </span>
                    <a href={`https://maps.google.com/?q=${props.uploadLocation[0]},${props.uploadLocation[1]}`} target="_blank" className="font-normal">
                        {props.uploadLocation[0].toString().slice(0,10)}, {props.uploadLocation[1].toString().slice(0,10)}
                    </a>
                </div>
                
                <div className="flex flex-wrap text-lg font-semibold gap-1 my-2">
                    <Button variant="outlined" onClick={props.onCancel}>Cancel</Button>
                    <Button variant="contained">Submit</Button>
                </div>
            </div>
        </div>
    )
}

export default ShareLocationPopup;