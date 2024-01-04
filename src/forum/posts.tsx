import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { useLocation, useNavigate } from 'react-router-dom';
import PostDetail from './postDetails';
import './posts.css';

interface Post {
  id: number;
  title: string;
  content: string;
  owner: string;
  category: string;
  total_likes: number;
  total_comments: number;
  created_at: string;
  liked_by: string[];
  formatted_date: string;
}

function Posts() {
  const location = useLocation();
  const navigate = useNavigate();
  const { username } = location.state || {};
  const [posts, setPosts] = useState<Post[]>([]);
  const [likedStates, setLikedStates] = useState<boolean[]>([]);

  useEffect(() => {
    const getAllPosts = async () => {
      try {
        const response = await fetch('http://localhost:3001/all-posts', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        setPosts(data);

        const initialLikedStates = data.map((post: Post) => post.liked_by ? post.liked_by.includes(username) : false);
        setLikedStates(initialLikedStates);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };
  
    getAllPosts();
  }, []);

  const handleLike = async (postId: number, title: string) => {
    try {
      const response = await fetch(`http://localhost:3001/${likedStates[postId] ? 'unlike-post' : 'like-post'}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title,
          username: username
        }),
      });

      if (response.status === 200) {
        alert('Post liked successfully');
      
        setPosts((prevPosts) => {
          const newPosts = [...prevPosts];
          const updatedPost = { ...newPosts[postId], total_likes: newPosts[postId].total_likes + (likedStates[postId] ? -1 : 1) };
          newPosts[postId] = updatedPost;
          return newPosts;
        });

        setLikedStates((prev) => {
          const newState = [...prev];
          newState[postId] = !prev[postId];
          return newState;
        });
      } else if (response.status === 422) {
        alert('Like failed.');
      } else {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error during like post:', error);
    }
  };
  
  const showPostView = (post: Post, username: string) => {
    navigate('/post-details', { state: { post, username } });
  };
  

  return (
    <div>
      {posts.map((post: Post, index: number) => {
        post.formatted_date = new Date(post.created_at).toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          hour12: true,
        });

        return (
          <div key={post.id} className='post'>
            <div className='post-info'>
              <h5 className='post-category'> {post.category} </h5>
              <h3 className='post-title'> {post.title}</h3>
              <h4 className='post-content'>{post.content}</h4>
              <h6 className='post-owner-date'>Posted by {post.owner} .   {post.formatted_date}</h6>
            </div>
            <div className='post-reaction'>
              <Button
                startIcon={likedStates[index] ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                onClick={() => handleLike(index, post.title)}
              >
                {post.total_likes}
              </Button>
              <Button startIcon={<ChatBubbleOutlineIcon />} onClick={() => showPostView(post, username)}>{post.total_comments}</Button>
            </div>
          </div>
        );
      })}
    </div>
    
  );
}

export default Posts;
