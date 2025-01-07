import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth'; 
import { auth } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar/Navbar';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate(); // Use useNavigate for redirection

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Try to sign in with email and password
      await signInWithEmailAndPassword(auth, email, password);
      alert('Login successful!');
      navigate('/'); // Redirect to the user's profile page after login
    } catch (err) {
      if (err.code === 'auth/user-not-found') {
        // Redirect to the signup page if user is not found
        alert('No account found with this email. Redirecting to signup...');
        navigate('/signup');
      } else {
        // Display other error messages
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign the user out
      alert('Logged out successfully!');
      navigate('/login'); // Redirect to the login page after logging out
    } catch (err) {
      console.error('Error logging out: ', err);
    }
  };

  return (
    <>
    <Navbar />
    <div className="login-container" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
      {isLoggedIn ? (
        <div>
          <h2>You are already logged in!</h2>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div>
          <h2>Login to Your Account</h2>
          <form onSubmit={handleLogin}>
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
            {error && <div className="error-message">{error}</div>}
            <button type="submit" disabled={loading}>
              {loading ? 'Logging In...' : 'Log In'}
            </button>
          </form>
        </div>
      )}
    </div>
    </>
  );
};

export default Login;