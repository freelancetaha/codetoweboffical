import React from 'react';
import Navbar from '../navbar/Navbar';
import './style.css';
import AImg from '../../assets/applications.png';
import New from '../News/New';

// Reusable Component for External Links
const ExternalLink = ({ href, children }) => (
  <a href={href} target="_blank" rel="noopener noreferrer">
    {children}
  </a>
);

const Intro = () => (
  <div className="para">
    <h1>Hello, I'm Taha</h1><hr />
    <p>I'm a freelance web developer with 3 years of experience in web development and creating custom web applications.</p>
    <ExternalLink href="https://www.fiverr.com/s/5rxdjW7">Fiverr</ExternalLink>
  </div>
);

const Services = () => (
  <div className="services">
    <New 
      useImg="https://fiverr-res.cloudinary.com/t_gig_cards_web,q_auto,f_auto/gigs/398786503/original/7b028dec8b4e6d764650aef790a00240a6ed252a.png" 
      hading="I will create fully functional blogging web application" 
      paragraph="I will design a blogging website from scratch according to your needs." 
      linkTo="https://www.fiverr.com/s/ZmY2blR" 
    />
    <New 
      useImg="https://fiverr-res.cloudinary.com/t_gig_cards_web,q_auto,f_auto/gigs/409883431/original/5172c8ce91a8a7e8b8906b77fe74abe50759c565.png" 
      hading="Develop custom websites: HTML5, CSS3, JS, React" 
      paragraph="I prioritize custom web development and web application solutions tailored to modern business needs." 
      linkTo="https://www.fiverr.com/s/380aDGL" 
    />
    <New 
      useImg="https://fiverr-res.cloudinary.com/t_gig_cards_web,q_auto,f_auto/gigs/409894859/original/f49d2885e893c7cfa1643923f119be297bc3692f.png" 
      hading="Create custom web application with React template" 
      paragraph="I specialize in creating stunning, user-friendly, and high-performance eCommerce websites for your business." 
      linkTo="https://www.fiverr.com/s/BR0WQ6z" 
    />
    <New 
      useImg="https://fiverr-res.cloudinary.com/t_gig_cards_web,q_auto,f_auto/gigs/409911354/original/bb91ccc84c3d50212f18dc0ee193ed98fc7b144c.png" 
      hading="Develop your web applications with ReactJS" 
      paragraph="I specialize in developing brand identities for new startups and companies." 
      linkTo="https://www.fiverr.com/s/380aDZA" 
    />
  </div>
);

const Home = () => (
  <React.Fragment>
    <Navbar />
    <div className="container">
      <Intro />
      <div className="img">
        <img src={AImg} alt="Developer working on applications" />
      </div>
    </div>
    <Services />
  </React.Fragment>
);

export default Home;