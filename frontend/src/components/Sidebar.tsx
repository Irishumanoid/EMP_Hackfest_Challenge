import { Menu } from "@mui/icons-material";
import { IconButton, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useState } from "react";
import SidebarPost from "./SidebarPost";
import { Post } from "../types/post";
import { getTagName } from "../util/tagHandler";
import CloseIcon from '@mui/icons-material/Close';


function Sidebar(props: {posts: Post[], selectedPost: Post|undefined, setSelectedPost: (post: Post|undefined)=>void, selectedType: string, setSelectedType: (selectedType: string)=>void}) {
    
    const [sidebarOpen, setSidebarOpen] = useState(true)

    // useEffect(()=>{
    //     if (window.matchMedia("min-width: 640px")) {
    //         setSidebarOpen(false);
    //     }
    // }, [props.selectedPost])

    return (
        <div className="flex h-full bg-gradient-to-b from-light-200 to-light-300 shadow-lg flex-shrink-0" style={{boxShadow: "0px 0px 10px -3px rgba(0,0,0,0.5)"}}>
            <div className="relative z-20 flex flex-col flex-shrink-0 items-center w-12 h-full bg-gradient-to-b from-light-400 to-light-500" style={{boxShadow: "0px 0px 10px -2px rgba(0,0,0,0.5)"}}>
                <IconButton onClick={()=>setSidebarOpen(!sidebarOpen)}><Menu fontSize="large"></Menu></IconButton>
            </div>
            <div className={`flex-shrink-0 w-screen h-full ${sidebarOpen ? 'sm:max-w-xs max-w-screen-sm' : 'max-w-0'} transition-all overflow-hidden`}>
                <div className="flex flex-col w-[calc(100vw-48px)] sm:max-w-xs h-screen relative">
                    <div className="w-full py-3 text-center text-xl font-bold bg-gradient-to-b from-light-400 to-light-500 shadow-lg">Sea Money</div>
                    <div className={`relative z-30 h-fit flex-shrink-0 overflow-y-scroll custom-scrollbar shadow ${props.selectedPost ? 'max-h-[24rem]' : 'max-h-0'}`}>
                        {props.selectedPost && 
                        <div className="p-4 pb-2">
                            <div className="text-xl font-bold">{props.selectedPost.display_name}</div>
                            <p className="">{props.selectedPost.description}</p>
                            <div className="text-sm mt-1">Google Maps: <a href={`https://maps.google.com/?q=${props.selectedPost.location[0]},${props.selectedPost.location[1]}`} target="_blank" className="font-normal">{props.selectedPost.location[0]}, {props.selectedPost.location[1]}</a></div>
                            <div className="flex flex-wrap text-lg font-semibold gap-1 my-2">
                                {props.selectedPost.tags.map((tag, index)=>
                                    <div key={index} className="bg-light-500 px-2 rounded">{getTagName(tag)}: <span className="text-green-500 font-extrabold">{'$ '.repeat(props.selectedPost?.price_rating[index]||0)}</span></div>
                                )}
                            </div>
                            <div className="absolute top-0 right-0 pt-2 cursor-pointer" onClick={()=>props.setSelectedPost(undefined)}><CloseIcon /></div>
                        </div>}
                    </div>
                    <div className="flex flex-col px-4 pt-3 h-full overflow-y-scroll custom-scrollbar bg-gradient-to-b from-light-300 to-light-300">
                        <div className="flex flex-col items-center gap-1 mb-2">
                            <ToggleButtonGroup
                                color="primary"
                                value={props.selectedType}
                                exclusive
                                onChange={(_e, val)=>props.setSelectedType(val)}
                                aria-label="Platform"
                                size="small"
                                sx={{background: "#bab5fd"}}
                            >
                                <ToggleButton value="all" sx={{fontWeight: 600}}>All</ToggleButton>
                                <ToggleButton value="food" sx={{fontWeight: 600}}>Food</ToggleButton>
                                <ToggleButton value="groceries" sx={{fontWeight: 600}}>Groceries</ToggleButton>
                            </ToggleButtonGroup>
                            <ToggleButtonGroup
                                color="primary"
                                value={props.selectedType}
                                exclusive
                                onChange={(_e, val)=>props.setSelectedType(val)}
                                aria-label="Platform"
                                size="small"
                                sx={{background: "#bab5fd"}}
                            >
                                <ToggleButton value="gas" sx={{fontWeight: 600}}>Gas</ToggleButton>
                                <ToggleButton value="clothes" sx={{fontWeight: 600}}>Clothes</ToggleButton>
                                <ToggleButton value="parking" sx={{fontWeight: 600}}>Parking</ToggleButton>
                            </ToggleButtonGroup>
                        </div>
                        {props.posts.map((post, index)=>{
                            if (post.display_name == props.selectedPost?.display_name && post.description == props.selectedPost?.description) return null;
                            return (<SidebarPost key={index} post={post} onClick={()=>props.setSelectedPost(post)}></SidebarPost>)
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Sidebar;