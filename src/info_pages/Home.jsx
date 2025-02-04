import React from 'react';
import WelcomeHome from '../info_pages/page_components/home_components/WelcomeHome';
import HomeInfoOne from '../info_pages/page_components/home_components/HomeInfoOne';
import HomeInfoTwo from '../info_pages/page_components/home_components/HomeInfoTwo';
import HomeInfoThree from '../info_pages/page_components/home_components/HomeInfoThree';
import Blog from './page_components/home_components/Blog';
import Nav from './page_components/Nav';
import Footer from './page_components/Footer';
// Ateuhen-main\src\info_pages\page_components\home_components\Blog.jsx
const MainPage = () => {
  return (
    <>
        <Nav/>
        <WelcomeHome/>
        <HomeInfoOne/>
        <HomeInfoTwo/>
        <HomeInfoThree/>
        <Blog/>
        <Footer/>
    </>
  )
}

export default MainPage