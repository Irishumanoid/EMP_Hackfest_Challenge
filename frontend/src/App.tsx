import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Map from "./components/Map";
import { POST } from "./util/apiHandler";

function App() {

  return (
    <div className="w-full h-screen overflow-hidden relative">
      
       
      <div className="w-full h-full overflow-hidden relative flex flex-row">
        <Sidebar></Sidebar>
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
