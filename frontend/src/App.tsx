import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import Map from "./components/Map";
import { Post } from "./types/post";
import { POST } from "./util/apiHandler";
import ShareLocationPopup from "./components/ShareLocationPopup";

function App() {

  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post|undefined>(undefined);

  const [uploadLocation, setUploadLocation] = useState<number[]|undefined>(undefined);
  function addLocation(loc: number[]) {
    setUploadLocation(loc);
  }

  async function refresh() {
    //const res = await POST("/get_posts", {location: [0,0], tags: [], price_rating: 1});
    const res = {
      data: {
        success: true,
        data: [
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
            display_name: "This is a name2 :o",
            description: "testing descriptionas dfad sfjkl asdfl ;asdjf;lasjdf;laj",
            location: [47.6919990, -122.35909],
            tags: ["gas", "store", "food"],
            price_rating: [4, 1, 2],
          },
          {
            id: 1,
            display_name: "This is a name3 :o",
            description: "testing descriptionas dfad sfjkl asdfl ;asdjf;lasjdf;laj",
            location: [47.6656185, -122.34628],
            tags: ["gas", "store", "food"],
            price_rating: [4, 1, 2],
          },
          {
            id: 1,
            display_name: "This is a name4 :o",
            description: "testing descriptionas dfad sfjkl asdfl ;asdjf;lasjdf;laj",
            location: [47.6865933, -122.40318],
            tags: ["gas", "store", "food"],
            price_rating: [4, 1, 2],
          },
          {
            id: 1,
            display_name: "This is a name5 :o",
            description: "testing descriptionas dfad sfjkl asdfl ;asdjf;lasjdf;laj",
            location: [47.6638772, -122.37688],
            tags: ["gas", "store", "food"],
            price_rating: [4, 1, 2],
          },
          {
            id: 1,
            display_name: "This is a name6 :o",
            description: "testing descriptionas dfad sfjkl asdfl ;asdjf;lasjdf;laj",
            location: [47.6648093, -122.31463],
            tags: ["gas", "store", "food"],
            price_rating: [4, 1, 2],
          },
        ]
      }
    };
    console.log(res.data.data);
    setPosts(res.data.data);

    // TESTING:
    //setSelectedPost(res.data.posts[0]);
  }

  async function Upload(name: string, description: string, location: number[], tags: string[], ratings: number[]) {
    var res = await POST("/post_post", {
        display_name: name, 
        description: description, 
        location: location, 
        tags: tags, 
        price_rating: ratings
    });
    console.log(res);
    await refresh();

    setUploadLocation(undefined);
  }

  useEffect(()=>{
    refresh();
    //upload();
  }, []);

  return (
    <div className="w-full h-screen">
      <div className="w-full h-full overflow-hidden relative flex flex-row">
        <Sidebar posts={posts} selectedPost={selectedPost} setSelectedPost={setSelectedPost}></Sidebar>
        <div className="w-full h-full overflow-hidden relative">
          <Map posts={posts} selectedPost={selectedPost} setSelectedPost={setSelectedPost} addLocation={addLocation}/>
        </div>
      </div>
      {uploadLocation && 
        <ShareLocationPopup onCancel={()=>setUploadLocation(undefined)} onSubmit={Upload} uploadLocation={uploadLocation}/>
      }
    </div>
  )
}

export default App
