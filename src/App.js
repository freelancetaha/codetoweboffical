import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/home/Home';
import About from './components/about/About';
import Blog from './components/blog/Blog';
import AdminPanel from './events/AdminPanel';
import Posts from './events/Posts';
import Footer from './components/footer/Footer';
import InPostAd from './components/ads/InPostAd';
import Login from './Account/Login';
import Signup from './Account/signup';

// Layout Component for Common Elements
const Layout = ({ children }) => (
  <>
    {children}
    <InPostAd />
    <Footer />
  </>
);

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout><Blog /></Layout>} />
        <Route path="/services" element={<Layout><Home /></Layout>} />
        <Route path="/about" element={<Layout><About /></Layout>} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;