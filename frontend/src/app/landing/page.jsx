import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const LandingPage = () => {
  return (
    <div>
      <Header/>
      <main>
        <AboutUs />
        <News />
        {/* Add more sections here */}
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
