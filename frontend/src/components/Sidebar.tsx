import { Menu } from "@mui/icons-material";



function Sidebar(props: {open: boolean}) {
    return (
        <div className="bg-gradient-to-b from-light-200 to-light-400 shadow-lg">
            <div className="flex flex-col w-8 h-full">
                <Menu></Menu>
            </div>
            <div className={`flex-shrink-0 w-full ${props.open ? 'sm:max-w-xs max-w-screen-sm' : 'max-w-0'} transition-all`}>
            
            </div>
        </div>
    )
}

export default Sidebar;