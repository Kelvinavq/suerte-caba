import "./imgHeader.css";
import React, { useEffect, useState, useRef } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Sidebar_a from "../Sidebar_a";
import config from "../../../config/config";

const MySwal = withReactContent(Swal);

const ImgHeader_a = () => {
  const [image, setImage] = useState("");
  const [path, setPath] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetch(`${config.api}/getHeaderImage.php`)
      .then((response) => response.json())
      .then((data) => {
        if (data.image && data.path) {
          setImage(data.image);
          setPath(data.path);
        }
      })
      .catch((error) => console.error("Error fetching image:", error));
  }, []);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("image", file);

    MySwal.fire({
      title: "¿Estás seguro?",
      text: "¿Quieres actualizar la imagen de la cabecera?",
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
          const response = await fetch(`${config.api}updateHeaderImage.php`, {
            method: "POST",
            credentials: "include",
            body: formData,
          });
        
          
          const result = await response.json();

          if (response.ok) {
            setImage(result.image);
            setPath(result.path);

            MySwal.fire({
              title: "¡Imagen actualizada!",
              text: "La imagen de la cabecera se ha actualizado correctamente.",
              icon: "success",
              didClose: () => {
                window.location.reload();
              },
            }).then(() => {
              // Recargar la página después de la actualización exitosa
              window.location.reload();
            });
          } else {
            throw new Error(result.error || "Error desconocido");
          }
        } catch (error) {
          console.error("Error updating image:", error);

          Swal.fire({
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
              <h2>Actualizar imagen de la cabecera</h2>
              <span>Recomendación:</span>
              <p>3600 pixeles de ancho x 2400 pixeles de alto</p>
              <span>Formatos compatibles:</span>
              <p>JPG, PNG, SVG O WEBP</p>

              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleImageUpload}
              />
              <button className="btn" onClick={handleButtonClick}>
                Subir nueva imagen
              </button>
            </div>
          </div>

          <div className="right">
            <div className="inner_grid">
              {path && (
                <img src={`${config.public_images}${image}`} alt="Header" />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ImgHeader_a;
