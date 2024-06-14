import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import Slider from "react-slick";
import config from "../../../config/config";
import "./Banner.css";
import ArrowRightRoundedIcon from "@mui/icons-material/ArrowRightRounded";
import ArrowLeftRoundedIcon from "@mui/icons-material/ArrowLeftRounded";

import logo from "../../../assets/logosuerte.svg";

// Define CustomPrevArrow y CustomNextArrow aquí
const CustomPrevArrow = (props) => {
  const { onClick } = props;
  return (
    <div className="custom-arrow custom-prev" onClick={onClick}>
      <ArrowLeftRoundedIcon />
    </div>
  );
};

const CustomNextArrow = (props) => {
  const { onClick } = props;
  return (
    <div className="custom-arrow custom-next" onClick={onClick}>
      <ArrowRightRoundedIcon />
    </div>
  );
};

const Banner = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchCardsImages = async () => {
      try {
        const response = await fetch(`${config.api}getBannerImages.php`);
        if (!response.ok) {
          throw new Error("Failed to fetch banner images");
        }
        const data = await response.json();
        setImages(data);
      } catch (error) {
        console.error("Error fetching banner images:", error);
      }
    };

    fetchCardsImages();
  }, []);

  useEffect(() => {
    AOS.init({
      duration: 1000,
    });
  }, []);
  const settings = {
    dots: false,
    autoplay: true,
    infinite: true,
    lazyLoad: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    pauseOnHover: true,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
  };

    // Verificar si hay al menos dos imágenes
    if (images.length < 2) {
      return null; 
    }

  return (
    <div className="container_banner">
      <div className="slider-container" data-aos="fade-up" data-aos-delay="200">
        <Slider {...settings}>
          {images.map((image, index) => (
            <div className="slide" key={index}>
              <img
                src={`${config.public_banners}${image.image}`}
                alt={`Banner ${image.id}`}
                onError={() => handleImageError(index)}
              />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Banner;
