
function Post(props: {post: any}) {
    return (
        <div className="p-4 mb-3 rounded-lg shadow-md bg-gradient-to-b from-light-400 to-light-400">
            <div className="text-lg font-semibold line-clamp-1">{props.post.display_name}</div>
            <div className="text-sm line-clamp-2">{props.post.description}</div>
        </div>
    )
}

export default Post;
