import React, { useState, useEffect } from "react";
import "./imgTarjetas.css";
import Sidebar_a from "../Sidebar_a";
import config from "../../../config/config";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const ImgTarjetas_a = () => {
  const [selectedCard, setSelectedCard] = useState(1);
  const [cardImages, setCardImages] = useState({
    1: "",
    2: "",
    3: "",
  });

  useEffect(() => {
    const fetchCardImages = async () => {
      try {
        const response = await fetch(`${config.api}getTarjetasImages.php`);
        if (response.ok) {
          const data = await response.json();
          // Actualizar el estado con las imágenes obtenidas
          setCardImages(data);
        } else {
          throw new Error("Error al obtener las imágenes de las tarjetas");
        }
      } catch (error) {
        console.error("Error fetching card images:", error);
        // Manejar el error con SweetAlert u otra lógica de manejo de errores
        MySwal.fire({
          title: "Error",
          text: "Hubo un error al cargar las imágenes de las tarjetas.",
          icon: "error",
        });
      }
    };

    fetchCardImages();
  }, []); // El segundo argumento vacío [] indica que este efecto se ejecuta solo una vez al montar el componente

  const handleCardSelection = (cardId) => {
    setSelectedCard(cardId);
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("image", file);
    formData.append("cardId", selectedCard); // Enviamos el ID de la tarjeta seleccionada

    MySwal.fire({
      title: "¿Estás seguro?",
      text: `¿Quieres actualizar la imagen de la tarjeta ${selectedCard}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#dd0db3",
      cancelButtonColor: "#454569",
      confirmButtonText: "Sí, actualizar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        MySwal.fire({
          title: "Subiendo imagen...",
          timerProgressBar: true,
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
          onBeforeOpen: () => {
            Swal.showLoading();
          },
        });

        try {
          const response = await fetch(`${config.api}updateTarjetaImage.php`, {
            method: "POST",
            body: formData,
          });

          if (response.ok) {
            MySwal.fire({
              title: "¡Imagen actualizada!",
              text: `La imagen de la tarjeta ${selectedCard} se ha actualizado correctamente.`,
              icon: "success",
              didClose: () => {
                window.location.reload();
              },
            });
          } else {
            throw new Error("Error al actualizar la imagen");
          }
        } catch (error) {
          console.error("Error updating image:", error);

          MySwal.fire({
            title: "Error",
            text: "Hubo un error al actualizar la imagen.",
            icon: "error",
          });
        }
      }
    });
  };

  return (
    <>
      <Sidebar_a />

      <div className="container_admin">
        <div className="inner_admin">
          <div className="left">
            <div className="inner_grid">
              <h2>Actualizar imagen de las tarjetas</h2>
              <span>Recomendación:</span>
              <p>3600 pixeles de ancho x 2400 pixeles de alto</p>
              <span>Formatos compatibles:</span>
              <p>JPG, PNG, SVG O WEBP</p>
              <p>Por favor seleccione qué tarjeta actualizará</p>

              <div className="buttons">
                <button
                  className={selectedCard === 1 ? "btn" : "btn-2"}
                  onClick={() => handleCardSelection(1)}
                >
                  Tarjeta 1
                </button>
                <button
                  className={selectedCard === 2 ? "btn" : "btn-2"}
                  onClick={() => handleCardSelection(2)}
                >
                  Tarjeta 2
                </button>
                <button
                  className={selectedCard === 3 ? "btn" : "btn-2"}
                  onClick={() => handleCardSelection(3)}
                >
                  Tarjeta 3
                </button>
              </div>

              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageUpload}
              />

              <button
                className="btn"
                onClick={() =>
                  document.querySelector('input[type="file"]').click()
                }
              >
                Subir nueva imagen
              </button>
            </div>
          </div>

          <div className="right">
            <div className="inner_grid">
              <img
                src={`${config.public_images}${cardImages[selectedCard]}`}
                alt={`Tarjeta ${selectedCard}`}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ImgTarjetas_a;
