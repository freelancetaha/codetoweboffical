import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Helmet } from "react-helmet";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  onSnapshot,
  doc,
  getDoc,
  deleteDoc,
  updateDoc,
  increment,
  setDoc,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  getDownloadURL,
} from "firebase/storage";
import DOMPurify from "dompurify";
import "./blog.css";
import Navbar from "../navbar/Navbar";
import { MdOnlinePrediction } from "react-icons/md";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDHCwFOL1b2oqXf890f3teA4blWfNLejJ0",
  authDomain: "myapp-3a874.firebaseapp.com",
  projectId: "myapp-3a874",
  storageBucket: "myapp-3a874.appspot.com",
  messagingSenderId: "430236087961",
  appId: "1:430236087961:web:d7b0e75c6cf2498c9b6a08",
};

// Firebase initialization
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [userId, setUserId] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(0);

  // Shuffle function to randomize the posts order
  const shuffleArray = useCallback((array) => {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  }, []);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        // Set user as online when authenticated
        setDoc(doc(db, "onlineUsers", user.uid), {
          isOnline: true,
        });

        // Clean up on user logout
        return () => {
          setDoc(doc(db, "onlineUsers", user.uid), {
            isOnline: false,
          });
        };
      } else {
        setUserId(null);
      }
    });

    const unsubscribePosts = onSnapshot(collection(db, "blogs"), async (snapshot) => {
      const postsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Fetch all user data in parallel to avoid multiple reads
      const userIds = [...new Set(postsList.map((post) => post.userId))];
      const userPromises = userIds.map((userId) =>
        getDoc(doc(db, "users", userId)).then((userDoc) => ({
          userId,
          username: userDoc.exists() ? userDoc.data().username : "Anonymous",
        }))
      );

      try {
        const users = await Promise.all(userPromises);
        const userMap = users.reduce((acc, { userId, username }) => {
          acc[userId] = username;
          return acc;
        }, {});

        // Update posts with user data and image URL
        const updatedPosts = await Promise.all(
          postsList.map(async (post) => {
            try {
              if (post.file) {
                const imageUrl = await getDownloadURL(ref(storage, post.file));
                post.imageUrl = imageUrl;
              }
              post.username = userMap[post.userId] || "Anonymous";
            } catch {
              post.username = "Anonymous";
            }
            return post;
          })
        );

        // Randomize posts order after fetching
        setPosts(shuffleArray(updatedPosts));
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    });

    // Subscribe to the online users collection
    const unsubscribeOnlineUsers = onSnapshot(
      collection(db, "onlineUsers"),
      (snapshot) => {
        setOnlineUsers(snapshot.docs.filter((doc) => doc.data().isOnline).length);
      }
    );

    return () => {
      unsubscribeAuth();
      unsubscribePosts();
      unsubscribeOnlineUsers();
    };
  }, [shuffleArray]);

  const handlePostClick = (postId) => {
    if (!localStorage.getItem(postId)) {
      updateDoc(doc(db, "blogs", postId), {
        views: increment(1),
      }).catch((error) => console.error("Error updating views:", error));
      localStorage.setItem(postId, "true");
    }
  };

  const deletePost = async (postId) => {
    try {
      await deleteDoc(doc(db, "blogs", postId));
      setPosts((prev) => prev.filter((post) => post.id !== postId));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const memoizedPosts = useMemo(() => posts, [posts]);

  return (
    <>
      {/* Set a fixed title for the page */}
      <Helmet>
        <title>Code to Web Blogs</title> {/* Fixed title */}
        <meta
          name="description"
          content="A blog app where users can share their services, posts, and content. Explore the latest posts!"
        />
        <meta
          name="keywords"
          content="graphic design, web design, website design, website builder, web developer, blogging the boys, blogging, best blogging platform, how to make money blogging, free blogging platforms, blogging sites, blogging websites"
        />
        <meta name="author" content="Taha" />
      </Helmet>
      <Navbar />
      <div className="blog">
        <div className="blog_content">
          <section>
          <p style={{display: 'flex', alignItems: 'center', gap: '10px'}}><MdOnlinePrediction style={{fontSize: '30px'}} /> {onlineUsers}</p>
            <p>Create your own content, don't copy-paste
            </p>
            <hr />
          </section>
          <section>
            <h1 className="blog-title">Latest Posts</h1>
            {memoizedPosts.length > 0 ? (
              memoizedPosts.map((post) => (
                <div
                  key={post.id}
                  className="post"
                  onClick={() => handlePostClick(post.id)}
                >
                  <div className="post-content">
                    {/* Post Title - Ensured it's at the top */}
                    <h2 className="post-title">{post.title || "Untitled"}</h2>
                    <h3 className="post-username">{post.username}</h3>
                    {post.imageUrl && (
                      <img
                        src={post.imageUrl}
                        alt={post.title || "Post Image"}
                        className="post_image"
                        loading="lazy"
                      />
                    )}
                    <div
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(
                          post.description || "No description available"
                        ),
                      }}
                    />
                    <p>
                      <small>
                        {new Date(
                          post.timestamp?.toDate?.() || post.timestamp
                        ).toLocaleString()}
                      </small>
                    </p>
                    <p>
                      <small>Views: {post.views || 0}</small>
                    </p>
                    {post.userId === userId && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent triggering the post click
                          deletePost(post.id);
                        }}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p>No posts available</p>
            )}
          </section>
        </div>
      </div>
    </>
  );
};

export default Blog;