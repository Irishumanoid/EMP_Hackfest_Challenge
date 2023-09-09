import { Menu } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useState } from "react";



function Sidebar() {
    
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <div className="flex h-full bg-gradient-to-b from-light-200 to-light-400 shadow-xl flex-shrink-0">
            <div className="flex flex-col flex-shrink-0 items-center w-12 h-full">
                <IconButton onClick={()=>setSidebarOpen(!sidebarOpen)}><Menu fontSize="large"></Menu></IconButton>
            </div>
            <div className={`flex-shrink-0 w-screen ${sidebarOpen ? 'sm:max-w-xs max-w-screen-sm' : 'max-w-0'} transition-all overflow-hidden`}>
                <div className="w-screen sm:max-w-xs max-w-screen-sm">
                    Woah this is a sidebar
                </div>
            </div>
        </div>
    )
}

export default Sidebar;