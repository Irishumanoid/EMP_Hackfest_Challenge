import { Menu } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useState } from "react";
import SidebarPost from "./SidebarPost";
import { Post } from "../types/post";



function Sidebar(props: {posts: Post[], selectedPost: Post|undefined, setSelectedPost: (post: Post|undefined)=>void}) {
    
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <div className="flex h-full bg-gradient-to-b from-light-200 to-light-300 shadow-lg flex-shrink-0" style={{boxShadow: "0px 0px 10px -3px rgba(0,0,0,0.5)"}}>
            <div className="relative z-50 flex flex-col flex-shrink-0 items-center w-12 h-full bg-gradient-to-b from-light-400 to-light-500" style={{boxShadow: "0px 0px 10px -2px rgba(0,0,0,0.5)"}}>
                <IconButton onClick={()=>setSidebarOpen(!sidebarOpen)}><Menu fontSize="large"></Menu></IconButton>
            </div>
            <div className={`flex-shrink-0 w-screen h-full ${sidebarOpen ? 'sm:max-w-xs max-w-screen-sm' : 'max-w-0'} transition-all overflow-hidden`}>
                <div className="flex flex-col w-screen sm:max-w-xs max-w-screen-sm h-screen relative">
                    <div className="w-full py-4 text-center text-xl font-bold ">Product Name</div>
                    <div className={``}></div>
                    <div className="flex flex-col px-4 h-full overflow-y-scroll custom-scrollbar">
                        {props.posts.map((post, index)=>{
                            return (<SidebarPost key={index} post={post}></SidebarPost>)
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Sidebar;