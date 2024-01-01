import React, { useState, FormEvent } from 'react';
import { useLocation } from 'react-router-dom';
import './createPostForm.css';

const CreatePostForm = () => {
    const location = useLocation();
    const { username } = location.state || {};

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const categories = ['General', 'Resources', 'Academic', 'CCAs', 'Events', 'Well-being'];
    const [category, setCategory] = useState('general');

    const publishPost = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3001/publish-post', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                title: title,
                content: content,
                owner: username,
                category: category
              }),
            });
      
            if (response.status === 201) {
              alert('Post published successfully');
      
            } else if (response.status === 422) {
              alert('Publish failed: A post with the same title exists.');
            } else {
                
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
          } catch (error) {
            console.error('Error during publish:', error);
          }
    }

    return (
        <div className="createPostForm">
            <form onSubmit={publishPost}>
                <h3 className='createPostTitle'>Create Post</h3>
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
                <button type='submit'>Post</button>
            </form>
        </div>
      );
};

export default CreatePostForm;