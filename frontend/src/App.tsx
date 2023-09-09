import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import Map from "./components/Map";
import { Post } from "./types/post";
import { POST } from "./util/apiHandler";

function App() {

  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post|undefined>(undefined);

  async function refresh() {
    //const res = await POST("/get_posts", {location: [0,0], tags: [], price_rating: 1});
    const res = {
      data: {
        success: true,
        posts: [
          {
            id: 1,
            display_name: "This is a name :o",
            description: "testing descriptionas dfad sfjkl asdfl ;asdjf;lasjdf;laj",
            location: [47.7, -122.3328],
            tags: ["gas", "store", "food"],
            price_rating: [4, 1, 2],
          },
          {
            id: 1,
            display_name: "This is a name :o",
            description: "testing descriptionas dfad sfjkl asdfl ;asdjf;lasjdf;laj",
            location: [47.7, -122.3328],
            tags: ["gas", "store", "food"],
            price_rating: [4, 1, 2],
          },
          {
            id: 1,
            display_name: "This is a name :o",
            description: "testing descriptionas dfad sfjkl asdfl ;asdjf;lasjdf;laj",
            location: [47.7, -122.3328],
            tags: ["gas", "store", "food"],
            price_rating: [4, 1, 2],
          },
          {
            id: 1,
            display_name: "This is a name :o",
            description: "testing descriptionas dfad sfjkl asdfl ;asdjf;lasjdf;laj",
            location: [47.7, -122.3328],
            tags: ["gas", "store", "food"],
            price_rating: [4, 1, 2],
          },
          {
            id: 1,
            display_name: "This is a name :o",
            description: "testing descriptionas dfad sfjkl asdfl ;asdjf;lasjdf;laj",
            location: [47.7, -122.3328],
            tags: ["gas", "store", "food"],
            price_rating: [4, 1, 2],
          },
          {
            id: 1,
            display_name: "This is a name :o",
            description: "testing descriptionas dfad sfjkl asdfl ;asdjf;lasjdf;laj",
            location: [47.7, -122.3328],
            tags: ["gas", "store", "food"],
            price_rating: [4, 1, 2],
          },
        ]
      }
    };
    console.log(res.data);
    setPosts(res.data.posts);

    // TESTING:
    setSelectedPost(res.data.posts[0]);
  }

  async function upload() {
    var res = await POST("/post_post", {
        display_name: "Bongos Restaurant", 
        description: "I bought some jerk chicken for like $7 and thats pretty cool i would rate the taste 9/10! Def a hidden gem of seattle!", 
        location: [47.6766866,-122.3470622], 
        tags: ["Food"], 
        price_rating: [2]
    });
    console.log(res);
    await refresh();
  }

  useEffect(()=>{
    refresh();
    upload();
  }, []);

  return (
    <div className="w-full h-screen overflow-hidden relative">
      
       
      <div className="w-full h-full overflow-hidden relative flex flex-row">
        <Sidebar posts={posts} selectedPost={selectedPost} setSelectedPost={setSelectedPost}></Sidebar>
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
