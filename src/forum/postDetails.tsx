import React, { useState, useEffect  } from 'react';
import { useLocation } from 'react-router-dom';
import Button from '@mui/material/Button';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

interface Comment {
  id: number;
  content: string;
  owner: string;
  original: string;
  created_at: string;
  formatted_date: string;
}


const PostDetails: React.FC = () => {
  const location = useLocation();
  const { post, username } = location.state || {};
  const [ liked, setLikeState ] = useState(post.liked_by ? post.liked_by.includes(username) : false);
  const [ totalLikes, updateTotalLikes ] = useState(post.total_likes);
  const [ comment, setComment ] = useState('');
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const getAllComments = async () => {
      try {
        const response = await fetch('http://localhost:3001/all-comments', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        setComments(data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };
  
    getAllComments();
  }, []);

  if (!post) {
    return <div>No post found</div>;
  }

  const handleLike = async ( title: string) => {
    try {
      const response = await fetch(`http://localhost:3001/${liked ? 'unlike-post' : 'like-post'}`, {
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
        alert('Post reacted successfully');
        setLikeState(!liked);
        if(!liked) {
          updateTotalLikes(totalLikes + 1);
        } else {
          updateTotalLikes(totalLikes - 1);
        }
      } else if (response.status === 422) {
        alert('Like failed.');
      } else {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error during like post:', error);
    }
  };

  const handleComment = async (content: string, originalPost: string) => {
    if(content.trim() == '') {
      alert("Comment cannot be blank");
      return;
    }
    try {
      const response = await fetch(`http://localhost:3001/publish-comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: content,
          owner: username,
          original_post: originalPost
        }),
      });

      if (response.status === 201) {
        const updatedResponse = await fetch('http://localhost:3001/all-comments', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const updatedData = await updatedResponse.json();
  
        // Update the local state with the new comments
        setComments(updatedData);
        alert('Comment posted successfully');
      } else if (response.status === 422) {
        alert('Comment failed while posting.');
      } else {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error during comment post:', error);
    }
  };

  return (
    <div>

    <div className='post'>
      <div className='post-info'>
        <h5 className='post-category'> {post.category} </h5>
        <h3 className='post-title'> {post.title}</h3>
        <h4 className='post-content'>{post.content}</h4>
        <h6 className='post-owner-date'>Posted by {post.owner} . {post.formatted_date}</h6>
      </div>
      
    </div>
    <div className='post-reaction'>
        <Button
          startIcon={liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          onClick={() => handleLike(post.title)}
        >
          {totalLikes}
        </Button>
        <Button startIcon={<ChatBubbleOutlineIcon />}>{post.total_comments}</Button>
    </div>
    <div className='post-comments'>
      <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder='Type your comment here' />
      <Button onClick={() => handleComment(comment, post.title)} >Post</Button>
      <h4>Comments:</h4>
      <ul>
          {comments.map((comment: Comment) => (
            <li key={comment.id}>
              <p>{comment.content}</p>
              <p>Posted by {comment.owner}</p>
            </li>
          ))}
      </ul>
    </div>
    </div>
  );
};

export default PostDetails;
