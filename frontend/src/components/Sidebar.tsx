import { Menu } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useState } from "react";



function Sidebar(props: {posts: any[]}) {
    
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <div className="flex h-full bg-gradient-to-b from-light-200 to-light-400 shadow-lg flex-shrink-0" style={{boxShadow: "0px 0px 10px -3px rgba(0,0,0,0.5)"}}>
            <div className="flex flex-col flex-shrink-0 items-center w-12 h-full bg-gradient-to-b from-light-400 to-light-500" style={{boxShadow: "0px 0px 10px -2px rgba(0,0,0,0.5)"}}>
                <IconButton onClick={()=>setSidebarOpen(!sidebarOpen)}><Menu fontSize="large"></Menu></IconButton>
            </div>
            <div className={`flex-shrink-0 w-screen ${sidebarOpen ? 'sm:max-w-xs max-w-screen-sm' : 'max-w-0'} transition-all overflow-hidden`}>
                <div className="w-screen sm:max-w-xs max-w-screen-sm">
                    <div className="w-full py-4 text-center text-xl font-bold ">Product Name</div>
                    <div className="flex flex-col px-4">
                        {props.posts.map((post, index)=>{
                            return (
                                <div className="p-4 rounded-lg shadow-md bg-gradient-to-b from-light-300 to-light-400">
                                    <div className="text-lg font-semibold line-clamp-1">{post.displayName}</div>
                                    <div className="text-sm line-clamp-3">{post.description}</div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Sidebar;