import {  Button, IconButton, Toolbar, Typography } from "@mui/material";
import { AppBar } from "@material-ui/core";
import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Map from "./components/Map";
import { POST } from "./util/apiHandler";
import MenuIcon from '@mui/icons-material/Menu';

function App() {

  const [sidebarOpen, setSidebarOpen] = useState(true);
  

  return (
    <div className="w-full h-screen overflow-hidden relative">
      
       
      <div className="w-full h-full overflow-hidden relative flex flex-row">
        <Sidebar open={sidebarOpen}></Sidebar>
        <div className="w-full h-full overflow-hidden">
          {/* <Button variant="contained" onClick={()=>setSidebarOpen(!sidebarOpen)}>Toggle Sidebar</Button> */}
          {/* <Button onClick={()=>POST("/get_posts")}></Button> */}
          <Map/>
          

        </div>
      </div>
    </div>
  )
}

export default App
