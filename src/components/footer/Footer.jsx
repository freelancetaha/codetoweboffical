import React from 'react'
import { Link } from 'react-router-dom';
import './style.css'

const Footer = () => {
  return (
    <>
    <footer>
        <div className="content">
            <ul>
                <li><Link to='/'>Home</Link></li>
                <li><Link to='/about'>About</Link></li>
                <li><Link to='/contact'>Contact</Link></li>
            </ul>
                <ul>
                <li><Link to='https://www.fiverr.com/s/5rxdjW7' target='_blank'>Fiverr</Link></li>
                <li><Link to='https://www.facebook.com/profile.php?id=61570501762322' target='_blank'>Facebook</Link></li>
                <li><Link to='https://www.instagram.com/taha_code001/' target='_blank'>Instagram</Link></li>
                </ul>
                <ul>
                <li><Link to='https://www.termsfeed.com/live/3d266f86-9970-4b55-be04-d436720de239'>Privacy Policy</Link></li>
                <li><Link to='/contact'>Support</Link></li>
                <li><Link to='/about'>Terms & conditions</Link></li>
            </ul>
        </div>
    </footer>
    </>
  )
}

export default Footer