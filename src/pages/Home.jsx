import React, { useState, useEffect } from "react";

import Header from "../components/Home/Header/Header";
import Cards from "../components/Home/Cards/Cards";
import Banner from "../components/Home/Banner/Banner";
import Testimonial from "../components/Home/Testimonial/Testimonial";
import LineasConfianza from "../components/Home/LineasConfianza/LineasConfianza";
import Footer from "../components/Home/Footer/Footer";

import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

const Home = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <Header />
      <Cards />
      <Banner />
      <LineasConfianza />
      <Testimonial />
      <Footer />

      {showBackToTop && (
        <button className="back-to-top" onClick={scrollToTop}>
          <ArrowUpwardIcon />
        </button>
      )}
    </>
  );
};

export default Home;
