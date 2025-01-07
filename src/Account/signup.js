import React, { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs, setDoc, doc } from 'firebase/firestore';
import { auth } from '../firebaseConfig';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar/Navbar';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Initialize Firestore
  const db = getFirestore();

  // Check if user is already authenticated
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        // If a user is already logged in, redirect to login or profile page
        navigate('/login'); // Or navigate to '/user' if you have a user profile page
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Check if the username already exists in Firestore
    try {
      const q = query(collection(db, 'users'), where('username', '==', username));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setError('Username is already taken. Please choose another one.');
        setLoading(false);
        return;
      }

      // If username is available, proceed with account creation
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user; // Get the authenticated user

      // Save username in Firestore under the user's document
      await setDoc(doc(db, 'users', user.uid), {
        email: email,
        username: username,
      });

      alert('Account created successfully!');
      navigate('/login'); // Redirect to login after successful signup
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Navbar />
    <div className="signup-container" style={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
      <h2>Create Account</h2>
      <form onSubmit={handleSignup}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Choose a unique username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        {error && <div className="error-message">{error}</div>}
        <button type="submit" disabled={loading}>
          {loading ? 'Signing Up...' : 'Sign Up'}
        </button>
      </form>
      <Link to='/login'>Login</Link>
    </div>
    </>
  );
};

export default Signup;