import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "./Cards.css";

import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import config from "../../../config/config";

import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import GppGoodIcon from "@mui/icons-material/GppGood";

import logo from "../../../assets/logosuerte.svg";

const Cards = () => {
  const [tarjetas, setTarjetas] = useState([]);

  useEffect(() => {
    AOS.init({
      duration: 1000,
    });
  }, []);

  useEffect(() => {
    const fetchCardsImages = async () => {
      try {
        const response = await fetch(`${config.api}getCardsImages.php`);
        if (!response.ok) {
          throw new Error("Failed to fetch cards images");
        }
        const data = await response.json();
        setTarjetas(data);
      } catch (error) {
        console.error("Error fetching cards images:", error);
      }
    };

    fetchCardsImages();
  }, []);


  const openInstagramSuerteCaba = () => {
    window.open("https://www.instagram.com/suertecaba_arg/", "_blank");
  };

  const openWhatsappSuerteCaba = () => {
    window.open("https://wa.link/5t1rta", "_blank");
  };

  return (
    <>
      <div className="cards_container" id="informacion">
        <div className="cards">
          <div className="head_cards">
            <div className="left">
              <div className="content">
                <h1 data-aos="fade-up" data-aos-delay="200">
                  Suerte Caba
                </h1>
                <h2 data-aos="fade-up" data-aos-delay="400">
                  Conoce nuestra empresa
                </h2>
              </div>
            </div>

            <div className="right">
              <button
                className="btn"
                data-aos="fade-up"
                data-aos-delay="600"
                onClick={openInstagramSuerteCaba}
              >
                Descubrí
                <ArrowRightAltIcon />
              </button>
            </div>
          </div>

          <div className="cards_grid">
            {tarjetas.map((tarjeta, index) => (
              <div className="card" key={tarjeta.id} data-aos="fade-up">
                <div className="img">
                  <img
                    src={`${config.public_images}${tarjeta.image}`}
                    alt={`Tarjeta ${tarjeta.id}`}
                  />
                </div>

                <div className="inner_card">
                  {tarjeta.id === 1 && (
                    <>
                      <div className="title">
                        <div className="icon">
                          <RocketLaunchIcon />
                        </div>
                        <div className="text">
                          <h4>Juegos Recomendados</h4>
                        </div>
                      </div>
                      <div className="content">
                        <p>
                          Te invitamos a descubrir nuestra apasionante selección
                          de juegos pensados para que pruebes tu suerte y tengas
                          la oportunidad de disfrutar de grandes premios a
                          diario en nuestro casino!
                        </p>
                        <p>¡Que la suerte esté siempre de tu lado! </p>
                      </div>
                    </>
                  )}
                  {tarjeta.id === 2 && (
                    <>
                      <div className="title">
                        <div className="icon">
                          <CardGiftcardIcon />
                        </div>
                        <div className="text">
                          <h4>Premios</h4>
                        </div>
                      </div>
                      <div className="content">
                        <p>
                          Nos enorgullece presentarte nuestro historial de
                          premios que hemos estado entregado desde los inicios
                          de Suerte Caba! Más de 500 clientes nos eligen a
                          diario y apuestan su confianza en nosotros. Desde los
                          premios más modestos hasta las más grandes victorias
                          que han hecho historia en nuestro casino!
                        </p>
                      </div>
                    </>
                  )}
                  {tarjeta.id === 3 && (
                    <>
                      <div className="title">
                        <div className="icon">
                          <GppGoodIcon />
                        </div>
                        <div className="text">
                          <h4>Nuestras líneas de confianza</h4>
                        </div>
                      </div>
                      <div className="content">
                        <p>
                          Te presentamos nuestras líneas de casino de confianza!
                          Todas forman parte de nuestra reconocida empresa
                          online. No dudes en ponerte en contacto con cualquiera
                          de ellos para que sigas apostando por tu suerte y
                          disfrutes de una experiencia de juego incomparable.
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Cards;
