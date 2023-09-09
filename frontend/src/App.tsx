import { Button } from "@mui/material";
import { useState } from "react";
import Sidebar from "./components/Sidebar";

function App() {

  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="w-full h-screen overflow-hidden relative flex flex-row">
      <Sidebar open={sidebarOpen}></Sidebar>
      <div className="w-full">
        <Button variant="contained" onClick={()=>setSidebarOpen(!sidebarOpen)}>Toggle Sidebar</Button>
      </div>
    </div>
  )
}

export default App
