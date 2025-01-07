import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { initializeApp } from 'firebase/app';
import { useNavigate } from 'react-router-dom';
import './ads.css';
import Navbar from '../components/navbar/Navbar';
import DOMPurify from 'dompurify';

const firebaseConfig = {
  apiKey: "AIzaSyDHCwFOL1b2oqXf890f3teA4blWfNLejJ0",
  authDomain: "myapp-3a874.firebaseapp.com",
  projectId: "myapp-3a874",
  storageBucket: "myapp-3a874.appspot.com",
  messagingSenderId: "430236087961",
  appId: "1:430236087961:web:d7b0e75c6cf2498c9b6a08",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

const AdminPanel = () => {
  const [file, setFile] = useState(null);
  const [blogTitle, setBlogTitle] = useState('');
  const [blogDescription, setBlogDescription] = useState('');
  const [postingBlog, setPostingBlog] = useState(false);
  const [fileUrl, setFileUrl] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [user, setUser] = useState(null); // Track logged-in user
  const navigate = useNavigate();

  // Check if the user is logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), (currentUser) => {
      if (!currentUser) {
        navigate('/login'); // Redirect to login if not logged in
      } else {
        setUser(currentUser); // Set user if logged in
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // Handle file upload (image only)
  const handleFileUpload = async () => {
    if (!file) return null;
    const storageRef = ref(storage, `images/${file.name}`);
    try {
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setFileUrl(url);
      console.log('File uploaded and URL fetched:', url); // Debugging
      return url;
    } catch (error) {
      console.error('Error uploading file:', error); // Debugging error
      return null;
    }
  };

  // Handle blog submission
  const handleBlogSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('You must be logged in to post a blog.');
      return;
    }
    if (blogTitle && blogDescription) {
      setPostingBlog(true);
      try {
        const uploadedFileUrl = file ? await handleFileUpload() : null;
        await addDoc(collection(db, 'blogs'), {
          title: blogTitle,
          description: DOMPurify.sanitize(blogDescription),
          file: uploadedFileUrl, // Upload image URL here
          userId: user.uid, // Track the user ID
          timestamp: new Date(),
        });
        setBlogTitle('');
        setBlogDescription('');
        setFile(null);
        setFileUrl('');
      } catch (error) {
        console.error('Error adding blog:', error);
      } finally {
        setPostingBlog(false);
      }
    }
  };

  // Additional editor functionality
  const handleBold = () => {
    const selection = window.getSelection();
    const text = selection.toString();
    const newDescription = blogDescription.replace(text, `<b>${text}</b>`);
    setBlogDescription(newDescription);
  };

  const handleList = () => {
    setBlogDescription(blogDescription + '<ul><li>Item 1</li><li>Item 2</li></ul>');
  };

  const handleLink = () => {
    if (linkUrl && linkText) {
      const newDescription = blogDescription + `<a href="${linkUrl}" target="_blank">${linkText}</a>`;
      setBlogDescription(newDescription);
      setLinkUrl('');
      setLinkText('');
    } else {
      alert('Please enter both link URL and text');
    }
  };

  return (
    <div>
      <Navbar />
      <div className="admin">
        {user ? (
          <>
            <h1>Create a Blog</h1>
            <form onSubmit={handleBlogSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Blog Title"
                value={blogTitle}
                onChange={(e) => setBlogTitle(e.target.value)}
                required
              />
              <textarea
                placeholder="Blog Description"
                value={blogDescription}
                onChange={(e) => setBlogDescription(e.target.value)}
                required
              />
              <div className="text-editor-controls">
                <button type="button" onClick={handleBold}>Bold</button>
                <button type="button" onClick={handleList}>Add List</button>
                <button type="button" onClick={handleLink}>Add Link</button>
              </div>
              <input
                type="text"
                placeholder="Link URL"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
              />
              <input
                type="text"
                placeholder="Link Text"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
              />
              <button type="submit" disabled={postingBlog || !blogTitle || !blogDescription}>
                {postingBlog ? 'Posting...' : 'Create Blog'}
              </button>
            </form>
            {fileUrl && (
              <div>
                <h3>Blog Image:</h3>
                <img src={fileUrl} alt="Blog" style={{ maxWidth: '100%', maxHeight: '400px' }} />
                <a href={fileUrl} target="_blank" rel="noopener noreferrer">{fileUrl}</a>
              </div>
            )}
          </>
        ) : (
          <div>You must be logged in to create a blog.</div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;