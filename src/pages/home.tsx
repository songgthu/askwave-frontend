import React, { useState } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import Modal from '@mui/material/Modal';
import Logo from '../images/AskWaveLogo.png';
import Button from '@mui/material/Button';
import { Link, useLocation } from 'react-router-dom';
import PostForm from '../forum/createPostForm';
import Posts from '../forum/posts';
import YourPosts from '../forum/yourPosts';
import './home.css';

const Home = () => {
    const location = useLocation();
    const { username } = location.state || {};

    const [isFormVisible, setIsFormVisible] = useState(false);

    const openForm = () => {
        setIsFormVisible(true);
    };

    const closeForm = () => {
        setIsFormVisible(false);
    };

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        navigate('/login');
    };

    const [yourPosts, setShowYourPosts] = useState(false);
    const [allPosts, setShowAllPosts] = useState(true);

    const showAllPosts = () => {
        setShowYourPosts(false);
        setShowAllPosts(true);
    };

    const showYourPosts = () => {
        setShowYourPosts(true);
        setShowAllPosts(false);
    };

    return (
        <div className='Home'>
            <div className="WelcomeBanner">
                <p>Welcome, {username}</p>
            </div>
            <div className="LogoContainer">
                <img src={Logo} className="Logo" style={{ width: '200px', height: '200px' }} />
            </div>
            <input type="text" placeholder="&#128269; Search..." className="search-bar" />

            <div className='Main'>
            <div className='LeftBar'>
                <Button variant="contained" className='button' style={{ marginBottom: '10px' }} onClick={openForm}> New Post </Button>
                <Button variant="contained" className='button' style={{ marginBottom: '10px' }} onClick={showAllPosts}> All discussions </Button>
                <Button variant="contained" className='button' style={{ marginBottom: '10px' }} onClick={showYourPosts}> Your Posts </Button>

                <h3>Categories</h3>
                <ul className='categories' style={{ color: '#004AAD', padding: '0' }}>
                <li><Link to='/general-posts' className='cat'>General</Link> </li>
                <li><Link to='/resources-posts' className='cat'>Resources</Link> </li>
                <li><Link to='/academic-posts' className='cat'>Academic</Link> </li>
                <li><Link to='/ccas-posts' className='cat'>CCAs</Link></li>
                <li><Link to='/events-posts' className='cat'>Events</Link></li>
                <li><Link to='/wellbeing-posts' className='cat'>Well-being</Link></li>
                </ul>

                <Button variant="contained" className='button' style={{ marginTop: '10px' }} onClick={handleLogout}> Log Out </Button>
            </div>

            <div className="posts-container">
            <h3>{allPosts && !yourPosts ? 'All Discussions' : 'Your Posts'}</h3>
            {allPosts && !yourPosts ? <Posts /> :  <YourPosts/> }
            
            </div>


            </div>

            <Modal
                className='createPostForm'
                open={isFormVisible}
                onClose={closeForm}
            >
                <div className="modal-content">
                    <PostForm onClose={closeForm} />
                </div>
            </Modal>
      </div>
    );
  };
  export default Home;