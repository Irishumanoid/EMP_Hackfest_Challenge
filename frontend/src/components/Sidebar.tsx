import { Add, Menu } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useState } from "react";
import SidebarPost from "./SidebarPost";
import { Post } from "../types/post";


function Sidebar(props: {posts: Post[], selectedPost: Post|undefined, setSelectedPost: (post: Post|undefined)=>void}) {
    
    const [sidebarOpen, setSidebarOpen] = useState(true)

    return (
        <div className="flex h-full bg-gradient-to-b from-light-200 to-light-300 shadow-lg flex-shrink-0" style={{boxShadow: "0px 0px 10px -3px rgba(0,0,0,0.5)"}}>
            <div className="relative z-50 flex flex-col flex-shrink-0 items-center w-12 h-full bg-gradient-to-b from-light-400 to-light-500" style={{boxShadow: "0px 0px 10px -2px rgba(0,0,0,0.5)"}}>
                <IconButton onClick={()=>setSidebarOpen(!sidebarOpen)}><Menu fontSize="large"></Menu></IconButton>
                <IconButton onClick={()=>setSidebarOpen(!sidebarOpen)}><Add fontSize="large"></Add></IconButton>
            </div>
            <div className={`flex-shrink-0 w-screen h-full ${sidebarOpen ? 'sm:max-w-xs max-w-screen-sm' : 'max-w-0'} transition-all overflow-hidden`}>
                <div className="flex flex-col w-screen sm:max-w-xs max-w-screen-sm h-screen relative">
                    <div className="w-full py-4 text-center text-xl font-bold bg-gradient-to-b from-light-400 to-light-500">Product Name</div>
                    <div className={`${props.selectedPost ? 'max-h-screen' : 'max-h-0'}`}>
                        {props.selectedPost && 
                        <div className="p-4">
                            <div className="text-xl font-bold">{props.selectedPost.display_name}</div>
                            <p className="">{props.selectedPost.description}</p>
                            <div className="text-sm mt-1">Google Maps: <a href={`https://maps.google.com/?q=${props.selectedPost.location[0]},${props.selectedPost.location[1]}`} target="_blank" className="font-normal">{props.selectedPost.location[0]}, {props.selectedPost.location[1]}</a></div>
                            <div className="flex flex-wrap text-lg font-semibold gap-1 my-2">
                                {props.selectedPost.tags.map((tag, index)=>
                                    <div key={index} className="bg-light-500 px-2 rounded">{tag}: <span className="text-green-600 font-extrabold">{'$ '.repeat(props.selectedPost?.price_rating[index]||0)}</span></div>
                                )}
                            </div>
                        </div>}
                    </div>
                    <div className="flex flex-col px-4 h-full overflow-y-scroll custom-scrollbar">
                        {props.posts.map((post, index)=>{
                            return (<SidebarPost key={index} post={post} onClick={()=>props.setSelectedPost(post)}></SidebarPost>)
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Sidebar;