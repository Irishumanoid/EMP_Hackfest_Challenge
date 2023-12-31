import { Button, TextField } from "@mui/material";
import LocationScreenshot from "./LocationScreenshot";
import { useRef, useState } from "react";
import Rating from '@mui/material/Rating';
import PaidIcon from '@mui/icons-material/Paid';
import PaiedIconOutline from '@mui/icons-material/PaidOutlined';
import { styled } from '@mui/material/styles';

function ShareLocationPopup(props: {onCancel: ()=>void, onSubmit: (name: string, description: string, location: number[], tags: string[], ratings: number[])=>void, uploadLocation: number[]}) {

    const nameRef = useRef<HTMLInputElement>(null);
    const descriptionRef = useRef<HTMLInputElement>(null);

    const [foodRating, setFoodRating] = useState(0);
    const [groceryRating, setGroceryRating] = useState(0);
    const [gasRating, setGasRating] = useState(0);
    const [clothesRating, setClothesRating] = useState(0);
    const [parkingRating, setParkingrating] = useState(0);

    const [firstScreen, setFirstScreen] = useState(true);
    const StyledRating = styled(Rating)({
        '& .MuiRating-iconFilled': {
          color: '#22c55e',
        },
        '& .MuiRating-iconHover': {
          color: '#1ca14d',
        },
      });
      

    function onTrySubmit()
    {
        console.log(foodRating);

        var tags = [];
        var ratings = [];

        if (foodRating != 0) { tags.push("Food"); ratings.push(foodRating); }
        if (groceryRating != 0) { tags.push("Groceries"); ratings.push(groceryRating); }
        if (gasRating != 0) { tags.push("Gas"); ratings.push(gasRating); }
        if (clothesRating != 0) { tags.push("Clothes"); ratings.push(clothesRating); }
        if (parkingRating != 0) { tags.push("Parking"); ratings.push(parkingRating); }

        console.log(tags);
        console.log(ratings);

        if (nameRef.current?.value && descriptionRef.current?.value)
        {
            props.onSubmit(nameRef.current.value, descriptionRef.current.value, props.uploadLocation, tags, ratings);
        }
    }

    return (
        <div className="absolute top-0 right-0 left-0 bottom-0 z-[1000] px-2 bg-black bg-opacity-50 flex flex-col justify-center items-center">
            <div className="max-w-md w-full flex flex-col p-4 sm:p-8 items-center rounded-lg shadow-lg bg-gradient-to-b from-light-300 to-light-400" onClick={(e)=>e.stopPropagation()}>
                <div className={`flex-col items-center ${firstScreen ? 'flex' : 'hidden'}`}>
                    <div className="text-2xl font-bold mb-2">Share a Location</div>
                
                    <div className="w-full mt-1">
                        <TextField id="standard-required" label="Name of Location" variant="outlined" size="small" className="w-full" inputRef={nameRef}/>
                    </div>
                    <div className="w-full mt-3">
                        <TextField id="standard-multiline" label="Description" multiline rows={6} variant="outlined" size="small" className="w-full" inputRef={descriptionRef}/>
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
                        <Button variant="contained" onClick={()=>setFirstScreen(false)}>Next</Button>
                    </div>
                </div>
                <div className={`flex-col items-center ${firstScreen ? 'hidden' : 'flex'}`}>
                    <p>Food</p>
                    <StyledRating name="customized-color" defaultValue={0}  precision={1} icon={<PaidIcon fontSize="inherit" />} emptyIcon={<PaiedIconOutline fontSize="inherit" />} onChange={(_e, newValue) => {setFoodRating(newValue||0)}} value={foodRating}/>
                    <p>Groceries</p>
                    <StyledRating name="customized-color2" defaultValue={0}  precision={1} icon={<PaidIcon fontSize="inherit" />} emptyIcon={<PaiedIconOutline fontSize="inherit" />} onChange={(_e, newValue) => {setGroceryRating(newValue||0)}} value={groceryRating}/>
                    <p>Gas</p>
                    <StyledRating name="customized-color3" defaultValue={0}  precision={1} icon={<PaidIcon fontSize="inherit" />} emptyIcon={<PaiedIconOutline fontSize="inherit" />} onChange={(_e, newValue) => {setGasRating(newValue||0)}} value={gasRating}/>
                    <p>Clothes</p>
                    <StyledRating name="customized-color4" defaultValue={0}  precision={1} icon={<PaidIcon fontSize="inherit" />} emptyIcon={<PaiedIconOutline fontSize="inherit" />} onChange={(_e, newValue) => {setClothesRating(newValue||0)}} value={clothesRating}/>
                    <p>Parking</p>
                    <StyledRating name="customized-color5" defaultValue={0}  precision={1} icon={<PaidIcon fontSize="inherit" />} emptyIcon={<PaiedIconOutline fontSize="inherit" />} onChange={(_e, newValue) => {setParkingrating(newValue||0)}} value={parkingRating}/>
                    <br></br>
                    <div className="flex flex-wrap text-lg font-semibold gap-1 my-2">
                        <Button variant="outlined" onClick={()=>setFirstScreen(true)}>Back</Button>
                        <Button variant="contained" onClick={onTrySubmit}>Submit</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ShareLocationPopup;