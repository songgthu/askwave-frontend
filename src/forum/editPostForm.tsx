import React, { useState, FormEvent } from 'react';
import { useLocation } from 'react-router-dom';
import './createPostForm.css';

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

interface CreatePostFormProps {
    onClose: () => void; 
    post?: Post;
    originalTitle?: string;
}
  
  const EditPostForm: React.FC<CreatePostFormProps> = ({ onClose, post, originalTitle }) => {
    const location = useLocation();
    const { username } = location.state || {};

    const [title, setTitle] = useState(post?.title ?? '');
    const [content, setContent] = useState(post?.content ?? '');

    const categories = ['General', 'Resources', 'Academic', 'CCAs', 'Events', 'Well-being'];
    const [category, setCategory] = useState(post?.category ?? '');

    const editPost = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3001/edit-post', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                title: title,
                content: content,
                owner: username,
                category: category,
                original_title: originalTitle
                }),
            });
        
            if (response.status === 200) {
                alert('Post edited successfully');
            } else if (response.status === 404) {
                alert('Edit failed: Post does not exist.');
            } else {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            onClose();
            } catch (error) {
            console.error('Error during publish:', error);
            }
    }

    return (
        <div className="editPostForm">
            <form onSubmit={editPost}>
                <span className="close" onClick={onClose}>&times;</span>    
                <h3 className='editPostTitle'>Edit Post</h3>
                <label>Title:</label>
                <input className="postTitle" type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                <label>Content:</label>
                <textarea value={content} onChange={(e) => setContent(e.target.value)} />
                <label>Category:</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    {categories.map((category) => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>
                <button type='submit'>Save changes</button>
            </form>
        </div>
      );
};

export default EditPostForm;