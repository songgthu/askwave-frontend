import React, { useState, useEffect  } from 'react';
import { useLocation } from 'react-router-dom';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import './postDetails.css';

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
  const [ totalComments, updateTotalComments ] = useState(post.total_comments);
  const [ comment, setComment ] = useState('');
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const getAllComments = async (title: string) => {
      try {
        const response = await fetch(`http://localhost:3001/all-comments/${encodeURIComponent(title)}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        if(data == '[]') {
          return;
        } else {
          setComments(data);
        }
        
        console.log(data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };
  
    getAllComments(post.title);
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
        const updatedResponse = await fetch(`http://localhost:3001/all-comments/${encodeURIComponent(post.title)}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const updatedData = await updatedResponse.json() || [];
  
        // Update the local state with the new comments
        setComments(updatedData);
        updateTotalComments(totalComments + 1);
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

  const handleDeleteComment = async (id: number, originalPost: string) => {
    const confirmed = window.confirm(`Are you sure you want to delete this comment?`);

    if (!confirmed) {
      return;
    }
      try {
          const response = await fetch('http://localhost:3001/delete-comment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id: id,
              owner: username,
              original_post: originalPost
            }),
          });
    
          if (response.status === 200) {
            setComments((prevComments) => prevComments.filter((comment: Comment) => comment.id !== id));
            updateTotalComments(totalComments - 1);
            alert('Comment deleted successfully');
    
          } else if (response.status === 404) {
            alert('Deletion failed: Comment does not exists.');
          } else {
              
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
        } catch (error) {
          console.error('Error during deletion:', error);
        }
  };

  const formattedDate = (date: string) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });
  }

  return (
    <div>

    <div className='post-details'>
      <div className='post-info-details'>
        <h5 className='post-category-details'> {post.category} </h5>
        <h3 className='post-title-details'> {post.title}</h3>
        <h4 className='post-content-details'>{post.content}</h4>
        <h6 className='post-owner-date-details'>Posted by {post.owner} . {post.formatted_date}</h6>
      </div>
      
    </div>
    <div className='post-reaction-details'>
        <Button
          startIcon={liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          onClick={() => handleLike(post.title)}
        >
          {totalLikes}
        </Button>
        <Button startIcon={<ChatBubbleOutlineIcon />}>{totalComments}</Button>
    </div>
    <div className='post-comments'>
      <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder='Type your comment here' />
      <Button className='post-comment-button' onClick={() => handleComment(comment, post.title)} >Post</Button>
      <h4>Comments:</h4>
      <ul className='comments-list'>
          {comments.map((comment: Comment) => (
            
            <li key={comment.id}>
              <p><b>{comment.owner}</b> &#183; {formattedDate(comment.created_at)}</p>
              <p>{comment.content}</p>
              {(comment.owner === username || username === post.owner) && (
                <Tooltip title="Delete comment">
                  <Button className='delete-comment-button' onClick={() => handleDeleteComment(comment.id, post.title)}>
                    <DeleteIcon />
                  </Button>
                </Tooltip>
              )}
            </li>
          ))}
      </ul>
    </div>
    </div>
  );
};

export default PostDetails;
