import React from 'react'
import Header from '../Component/Header'; 
import Footer from '../Component/Footer';
import HeroSection from '../Component/Herosection';
import FeaturedCollection from '../Component/FeaturedCollection';
import CollectionsSection from '../Component/CollectionCard';
import Toppicks from '../Component/Toppicks';
import Discover from '../Component/Discover';

const Homepage = () => {
  return (
    <div>
        <Header/>
        <HeroSection/>
        <FeaturedCollection/>
        <CollectionsSection/>
        <Toppicks/>
        <Discover/>
        <Footer/>
    </div>
  )
}

export default Homepage