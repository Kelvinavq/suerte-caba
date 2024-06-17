import React, { useEffect, useState, useRef } from "react";

import AOS from "aos";
import "aos/dist/aos.css";
import "./Cards.css";

import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import config from "../../../config/config";

import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import GppGoodIcon from "@mui/icons-material/GppGood";
import CloseIcon from "@mui/icons-material/Close";

import logo from "../../../assets/logosuerte.svg";

import Slider from "react-slick";

const Cards = () => {
  const [tarjetas, setTarjetas] = useState([]);
  3;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState([]);
  const [images, setImages] = useState([]);
  const [contentType, setContentType] = useState("");

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

  const linkLineas = () => {
    window.location = "#lineas-confianza";
  };

  const openModal = async (tarjetaId) => {
    let images = [];
    try {
      if (tarjetaId === 1) {
        images = await fetchImagesRecomendados();
        setContentType("recomendados");
      } else if (tarjetaId === 2) {
        images = await fetchImagesPremios();
        setContentType("premios");
      }
    } catch (error) {
      console.error('Error fetching images:', error);
    }
    setModalContent(images);
    setIsModalOpen(true);
  };
  

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const modalRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      const swalContainer = document.querySelector(".swal2-container");

      if (
        modalRef.current &&
        !modalRef.current.contains(event.target) &&
        !swalContainer.contains(event.target)
      ) {
        // Cerrar el modal si se hace clic fuera de él
        closeModal();
      }
    };

    // Añadir el evento de escucha al hacer clic fuera del modal
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      // Limpiar el evento de escucha al desmontar el componente
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalRef]);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplay: true,
    slidesToShow: 3,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: "60px",
    variableWidth: true,
    adaptiveHeight: true,
    responsive: [
      {
        breakpoint: 1300,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 920,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const fetchImagesRecomendados = async () => {
    try {
      const response = await fetch(`${config.api}getRecomendsImages.php`);
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        throw new Error(
          "Error al obtener las imágenes de juegos recomendados."
        );
      }
    } catch (error) {
      console.error("Error fetching recommended games images:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un error al obtener las imágenes de juegos recomendados.",
      });
      return [];
    }
  };

  const fetchImagesPremios = async () => {
    try {
      const response = await fetch(`${config.api}getAwardsImages.php`);
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        throw new Error("Error al obtener las imágenes de premios.");
      }
    } catch (error) {
      console.error("Error fetching awards images:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un error al obtener las imágenes de premios.",
      });
      return [];
    }
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
              <div
                className="card"
                key={index}
                data-aos="fade-up"
                onClick={
                  tarjeta.id === 3 ? linkLineas : () => openModal(tarjeta.id)
                }
              >
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

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal cards" ref={modalRef}>
            <button className="close-modal " onClick={closeModal}>
              <CloseIcon />
            </button>

            <div className="content-modal">
            {modalContent.length > 0 ? (
            <Slider {...sliderSettings}>
              {modalContent.map((item, index) => (
                <div key={index} className="slide">
                  <img
                    src={
                      contentType === "recomendados"
                        ? `${config.public_recomends}${item.image}`
                        : `${config.public_awards}${item.image}`
                    }
                    alt={`Slide ${index + 1}`}
                  />
                </div>
              ))}
            </Slider>
          ) : (
            <p>No hay imágenes para mostrar en este momento.</p>
          )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Cards;
