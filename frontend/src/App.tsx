import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import Map from "./components/Map";
import { GET, POST } from "./util/apiHandler";
import { Button } from "@mui/material";

function App() {

  const [posts, setPosts] = useState<any[]>([]);

  async function Refresh()
  {
    //const res = await GET("/get_posts");
    const res = {
      data: {
        success: true,
        posts: [
          {
            description: "testing description",
            location: [47.7, -122.3328],
            displayName: "name"
          },
        ]
      }
    };
    console.log(res.data);
    setPosts(res.data.posts);
  }

  useEffect(()=>{
    Refresh();
  }, []);

  return (
    <div className="w-full h-screen overflow-hidden relative">
      
       
      <div className="w-full h-full overflow-hidden relative flex flex-row">
        <Sidebar></Sidebar>
        <div className="w-full h-full overflow-hidden">
          {/* <Button variant="contained" onClick={()=>setSidebarOpen(!sidebarOpen)}>Toggle Sidebar</Button> */}
          {/* <Button onClick={()=>POST("/get_posts")}></Button> */}
          <Map posts={posts}/>
          
        </div>
      </div>
    </div>
  )
}

export default App
