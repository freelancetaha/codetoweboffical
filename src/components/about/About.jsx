/* eslint-disable jsx-a11y/alt-text */
import React from 'react';
import Navbar from '../navbar/Navbar';
import './about.css';
import { FaFacebook, FaInstagram } from "react-icons/fa";
import bacImg from '../../assets/about.png';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <>
    <Navbar />
      <div className="about">
        <div className="para">
          <span>About Me</span>
          <h1>Hello, Im Taha Ale</h1>
          <hr />
          <p>I am fortend Developer to create fully functional web application to help your business new startup create this web application on react js this is my portfilo i have a skill Html5 Css3 JavaScript React Js to manage seo redesign your web applications or create new custom web applications to growup.</p>
          <span className='sign'>Taha</span>
          <div className="social">
            <Link to='https://www.facebook.com/profile.php?id=61570501762322' target='_blank'><FaFacebook className='icon' /></Link>
            <Link to='https://www.instagram.com/taha_code001/' target='_blank'><FaInstagram className='icon' /></Link>
          </div>
        </div>
        <div className="img">
          <img src={bacImg} />
        </div>
      </div>
    </>
  )
}

export default About
