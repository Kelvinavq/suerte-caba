import "./LineasConfianza.css";
import Config from "../../../config/config";
import img1 from "../../../assets/2.png";
import img2 from "../../../assets/logo png.png";
import InstagramIcon from "@mui/icons-material/Instagram";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import React, { useState, useEffect } from "react";



import AOS from "aos";
import "aos/dist/aos.css";


const LineasConfianza = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
    });
  }, []);


  const openInstagramSuerteCaba = () => {
    window.open("https://www.instagram.com/caba.prestige?igsh=MTNkcjd0NHd0ejhucQ==", "_blank");
  };
  
  const openWhatsappSuerteCaba = () => {
    window.open("http://wa.link/cabaprestige", "_blank");
  };
  
  const openWhatsappLuxury = () => {
    window.open("http://wa.link/luxurycaba1", "_blank");
  };
  
  return (
    <>
      <div className="container" id="lineas-confianza">
        <div className="inner_lineas">
          <div className="title">
            <h2 data-aos="fade-up" data-aos-delay="200">Nuestras lineas de confianza</h2>
            <h4 data-aos="fade-up" data-aos-delay="400">SUERTE CABA</h4>
          </div>
          <div className="card__container">
            <article className="card__article" data-aos="fade-up">
              <img src={img1} alt="image" className="card__img" />

              <div className="card__data">
                <span className="card__description">
                  Seguinos en nuestras redes
                </span>
                <h2 className="card__title">CABA PRESTIGE</h2>
                <div className="buttons">
                  <button className="btn" onClick={openInstagramSuerteCaba}>
                    <InstagramIcon />
                  </button>
                  <button className="btn" onClick={openWhatsappSuerteCaba}>
                    <WhatsAppIcon />
                  </button>
                </div>
              </div>
            </article>

            <article className="card__article" data-aos="fade-up">
              <img src={img2} alt="image" className="card__img" />

              <div className="card__data">
                <span className="card__description">
                  Seguinos en nuestras redes
                </span>
                <h2 className="card__title">LUXURY CABA</h2>

                <div className="buttons">
                  <button className="btn" onClick={openWhatsappLuxury}>
                    <WhatsAppIcon />
                  </button>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </>
  );
};

export default LineasConfianza;