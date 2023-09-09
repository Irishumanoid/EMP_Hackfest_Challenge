import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import Map from "./components/Map";
import { GET, POST } from "./util/apiHandler";
import { Button } from "@mui/material";

function App() {

  const [posts, setPosts] = useState<any[]>([]);

  async function Refresh()
  {
    //const res = await POST("/get_posts", {data: {location: [0,0], tags: [], price_range: 1}});
    const res = {
      data: {
        success: true,
        posts: [
          {
            description: "testing descriptionas dfadsfjklasdfl ;asdjf;lasjdf;laj",
            location: [47.7, -122.3328],
            displayName: "name"
          },
          {
            description: "this is a description and it has some words in it",
            location: [47.6061, -122.3328],
            displayName: "This is a name"
          },{
            description: "this is a description and it has some words in it",
            location: [47.6061, -122.3328],
            displayName: "This is a name"
          },{
            description: "this is a description and it has some words in it",
            location: [47.6061, -122.3328],
            displayName: "This is a name"
          },{
            description: "this is a description and it has some words in it",
            location: [47.6061, -122.3328],
            displayName: "This is a name"
          },{
            description: "this is a description and it has some words in it",
            location: [47.6061, -122.3328],
            displayName: "This is a name"
          },{
            description: "this is a description and it has some words in it",
            location: [47.6061, -122.3328],
            displayName: "This is a name"
          }
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
        <Sidebar posts={posts}></Sidebar>
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
