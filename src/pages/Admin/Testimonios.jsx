import Testimonios_a from "../../components/Admin/testimonios/Testimonios_a";
import React, { useEffect, useState } from "react";
import ParticlesBg from "particles-bg";

import Swal from "sweetalert2";
import config from "../../config/config";

const Testimonios = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const particleNum = windowWidth < 560 ? 30 : 80;

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  
  useEffect(() => {
    // Verificar si el usuario está autenticado
    const checkAuthStatus = async () => {
      try {
        const response = await fetch(
          `${config.api}check-session.php`,
          {
            method: "GET",
            mode: "cors",
            credentials: "include",
          }
        );


        if (response.ok) {
          setIsLoggedIn(true);
        } else {
          setShowAlert(true);
          // Si la sesión no es válida, redirige al usuario al inicio de sesión
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Debes iniciar sesión para acceder a esta página.",
            timer: 3000,
            didClose: () => {
              window.location.href = "/login";
            },
          });
        }
      } catch (error) {
        console.error("Error al verificar la sesión:", error);
      }
    };

    // Llamar a la función para verificar la sesión
    checkAuthStatus();
  }, []);

  // Si el usuario no ha iniciado sesión o no tiene el rol adecuado, no renderizar el componente
  if (!isLoggedIn || showAlert) {
    return null;
  }
  

  return (
    <>
      <ParticlesBg num={particleNum} type="cobweb" bg={true} color="#fbe903" />
      <Testimonios_a />
    </>
  );
};

export default Testimonios;
