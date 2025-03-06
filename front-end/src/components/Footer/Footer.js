import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets.js'
const Footer = () => {
  return (
    <div className='footer' id='footer'>
      <div class="footer-content">
        <div class="footer-content-left">
            <img src={assets.logo} alt=""/>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint at reprehenderit quam quisquam non eos, voluptatibus omnis quo nesciunt itaque nisi dolor sed eum illum facere. Ipsa iure dolorum perferendis.</p>
            <div class="footer-social-icons">
                <img src={assets.facebook_icon} alt=""/>
                    <img src={assets.twitter_icon} alt=""/>
                        <img src={assets.linkedin_icon} alt=""/>
            </div>
        </div>
        <div class="footer-content-center">
            <h2>COMPANY</h2>
            <ul>
                <li>Home</li>
                <li>About us</li>
                <li>Delivery</li>
                <li>Privacy Policy</li>
            </ul>
        </div>
        <div class="footer-content-right">
              <h2>GET IN TOUCH</h2>
              <ul>
                  <li>+8478734212</li>
                  <li>contact@tomato.com</li>
              </ul>
        </div>
      </div>
      <hr/>
      <p class="footer-copyright">
        Copyright 2024 @ Tomato.com - All Right Reserved.
      </p>
    </div>
  )
}

export default Footer
