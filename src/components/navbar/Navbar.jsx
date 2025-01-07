import React, { useState, useEffect } from 'react';
import './style.css';
import Logo from '../../assets/1.png';
import { FiAlignJustify } from "react-icons/fi";
import { MdHomeRepairService, MdOutlineArticle } from 'react-icons/md';
import { IoCreateOutline } from 'react-icons/io5';
import { RiAccountBox2Line } from 'react-icons/ri';
import { FaRegUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getStorage, ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDHCwFOL1b2oqXf890f3teA4blWfNLejJ0",
  authDomain: "myapp-3a874.firebaseapp.com",
  projectId: "myapp-3a874",
  storageBucket: "myapp-3a874.appspot.com",
  messagingSenderId: "430236087961",
  appId: "1:430236087961:web:d7b0e75c6cf2498c9b6a08",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const auth = getAuth(app);

const Navbar = () => {
  const [isMenuActive, setMenuActive] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        fetchProfilePicture(user.uid);
      } else {
        setUserId(null);
        setProfilePic(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const toggleMenu = () => {
    setMenuActive(!isMenuActive);
  };

  const fetchProfilePicture = async (uid) => {
    try {
      const imageRef = ref(storage, `profile_pictures/${uid}`);
      const url = await getDownloadURL(imageRef);
      setProfilePic(url);
    } catch (error) {
      console.error("Error fetching profile picture:", error);
    }
  };

  const handleProfilePicUpload = async (event) => {
    const file = event.target.files[0];
    if (file && userId) {
      const imageRef = ref(storage, `profile_pictures/${userId}`);
      try {
        await uploadBytes(imageRef, file);
        const url = await getDownloadURL(imageRef);
        setProfilePic(url);
        alert("Profile picture updated successfully!");
      } catch (error) {
        console.error("Error uploading profile picture:", error);
      }
    } else {
      alert("You must be logged in to upload a profile picture.");
    }
  };

  return (
    <>
      <nav>
        <img src={Logo} alt="Logo" />
        <ul className={`ul ${isMenuActive ? 'active' : ''}`}>
          <li><Link to='/'><MdOutlineArticle className='icon-ma' /></Link></li>
          <li><Link to='/services'><MdHomeRepairService className='icon-ma' /></Link></li>
          <li><Link to='/about'><FaRegUser className='icon-ma' /></Link></li>
          <li><Link to='/admin'><IoCreateOutline className='icon-ma' /></Link></li>
          <li><Link to='/signup'><RiAccountBox2Line className='icon-ma' /></Link></li>
        </ul>
        <div className="profile-section">
          {profilePic ? (
            <img
              src={profilePic}
              alt="Profile"
              className="profile-pic"
              onClick={() => document.getElementById('profilePicInput').click()}
            />
          ) : (
            <button
              onClick={() => document.getElementById('profilePicInput').click()}
              className="upload-button"
            >
              Upload Profile Picture
            </button>
          )}
          <input
            type="file"
            id="profilePicInput"
            accept="image/*"
            onChange={handleProfilePicUpload}
            style={{ display: "none" }}
          />
        </div>
        <FiAlignJustify className='icon' onClick={toggleMenu} />
      </nav>
    </>
  );
};

export default Navbar;