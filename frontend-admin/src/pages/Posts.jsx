import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ktsRequest from "../../ultis/ktsrequest";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";


const Posts = () => {
  const [posts, setPosts] = useState([]);
  const {currentUser} = useSelector((state) => state.user);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await ktsRequest.get("/posts");
        setPosts(response.data);
      } catch (error) {
        toast.error("Failed to fetch posts");
      }
    };

    fetchPosts();
  }, []);

  return (
    <div>
      <h2>Posts</h2>
      <button onClick={() => window.location.href = "/posts/Add"} disabled={!currentUser}>Create New Post</button>
      <ul>
        {posts.map((post) => (
          <li key={post._id}>
            <Link to={`/posts/${post._id}`}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Post;