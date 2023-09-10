import { AttachMoney } from "@mui/icons-material";
import type { Post } from "../types/post";
import { getTagName } from "../util/tagHandler";

function Post(props: {post: Post, onClick: React.MouseEventHandler<HTMLDivElement>}) {

    const averageRating = props.post.price_rating.reduce((total, i)=>total+i, 0) / props.post.price_rating.length;

    return (
        <div className="p-4 pb-2 mb-3 rounded-lg shadow-md bg-gradient-to-b from-light-400 to-light-400 cursor-pointer" onClick={props.onClick}>
            <div className="text-lg font-semibold line-clamp-1">{props.post.display_name}</div>
            <div className="text-sm line-clamp-2">{props.post.description}</div>
            <div className="flex flex-wrap font-semibold gap-1 mt-2 mb-1">
                {props.post.tags.map((tag, index)=>
                    <div key={index} className="bg-light-700 px-2 rounded">{getTagName(tag)}</div>
                )}
            </div>
            {averageRating > 0 &&
                <span className="text-green-500 font-extrabold text-3xl">{[...Array(Math.round(averageRating))].map((_e, i) => <AttachMoney key={i} fontSize="inherit" className="-mr-3"/>)}</span>
            }
        </div>
    )
}

export default Post;
