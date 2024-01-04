import React, { useState, FormEvent } from 'react';
import { useLocation } from 'react-router-dom';
import './createPostForm.css';

const EditPostForm = () => {
    const location = useLocation();
    const { username } = location.state || {};

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const categories = ['General', 'Resources', 'Academic', 'CCAs', 'Events', 'Well-being'];
    const [category, setCategory] = useState('general');

    const editPost = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
    }

    return (
        <div className="editPostForm">
            <form onSubmit={editPost}>
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
                <button>Cancel</button>
            </form>
        </div>
      );
};

export default EditPostForm;