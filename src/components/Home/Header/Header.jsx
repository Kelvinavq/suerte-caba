import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import "./Header.css";
import logo from "../../../assets/logosuerte.svg";
import config from "../../../config/config";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import { useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();
  const [currentHash, setCurrentHash] = useState(location.hash || "#inicio");
  const [headerImage, setHeaderImage] = useState(null);

  useEffect(() => {
    const fetchHeaderImage = () => {
      fetch(`${config.api}getHeaderImage.php`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch header image");
          }
          return response.json();
        })
        .then((data) => {
          setHeaderImage(data.image);
        })
        .catch((error) => {
          console.error("Error fetching header image:", error);
          setErrorLoadingImage(true);
        });
    };

    fetchHeaderImage();
  }, []);

  useEffect(() => {
    AOS.init({
      duration: 1000,
    });
  }, []);

  useEffect(() => {
    // Almacena el fragmento de la URL actual en el estado currentHash
    setCurrentHash(location.hash || "#inicio");
  }, [location]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleOutsideClick = (event) => {
    if (
      isSidebarOpen &&
      !event.target.closest(".sidebar") &&
      !event.target.closest(".btnSidebar")
    ) {
      setIsSidebarOpen(false);
    }
  };

  useEffect(() => {
    document.body.classList.toggle("open", isSidebarOpen);
    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.body.classList.remove("open");
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [isSidebarOpen]);

  return (
    <>
      <div className="header_container" id="inicio">
        <div className="header">
          <div className="head" data-aos="fade-up">
            <div className="logo">
              <a href="#">
                <img src={logo} alt="" />
              </a>
            </div>

            <nav className="sidebar">
              <ul>
                <li className={currentHash === "#inicio" ? "active" : ""}>
                  <a href="#inicio" onClick={toggleSidebar}>
                    Inicio
                  </a>
                </li>
                <li className={currentHash === "#informacion" ? "active" : ""}>
                  <a href="#informacion" onClick={toggleSidebar}>
                    Información
                  </a>
                </li>
                <li className={currentHash === "#clientes" ? "active" : ""}>
                  <a href="#clientes" onClick={toggleSidebar}>
                    Clientes
                  </a>
                </li>
                <li
                  className={
                    currentHash === "#lineas-confianza" ? "active" : ""
                  }
                >
                  <a href="#lineas-confianza" onClick={toggleSidebar}>
                    Nosotros
                  </a>
                </li>
              </ul>
            </nav>

            <div className="button">
              <button className="btn">Contacto</button>

              <button className="btnSidebar" onClick={toggleSidebar}>
                <MenuOpenIcon />
              </button>
            </div>
          </div>

          <div className="inner_header">
            <div className="left">
              <h1 data-aos="fade-up" data-aos-delay="200">
                ¡Bienvenido!
              </h1>
              <p data-aos="fade-up" data-aos-delay="400">
                Te invitamos a descubrir nuestra apasionante selección de juegos
                pensados para que pruebes tu suerte y tengas la oportunidad de
                disfrutar de grandes premios a diario en nuestro casino!
              </p>
              <p data-aos="fade-up" data-aos-delay="400">
                ¡Que la suerte esté siempre de tu lado!
              </p>

              <div className="buttons" data-aos="fade-up" data-aos-delay="500">
                <button className="btn">Jugar Ahora</button>

                <button className="btn-2">Jugar Ahora</button>
              </div>
            </div>
            <div className="right">
              <img
                data-aos-delay="600"
                data-aos="fade-up"
                src={
                  headerImage ? `${config.public_images}${headerImage}` : logo
                }
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
