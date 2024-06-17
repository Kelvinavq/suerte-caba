import React, { useState, useEffect } from "react";
import config from "../../../config/config";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Sidebar_a from "../Sidebar_a";

const MySwal = withReactContent(Swal);

const ImgRecomendados_a = () => {
  const [images, setImages] = useState([]);

    // Función para obtener las imágenes de recomendados desde el servidor
    const fetchImages = async () => {
      try {
        const response = await fetch(`${config.api}getRecomendsImages.php`);
        if (response.ok) {
          const data = await response.json();
          setImages(data); // Establecer las imágenes obtenidas en el estado
        } else {
          throw new Error("Error al obtener las imágenes de recomendados.");
        }
      } catch (error) {
        console.error("Error fetching recomendados images:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Hubo un error al obtener las imágenes de recomendados.",
        });
      }
    };
  
    useEffect(() => {
      fetchImages(); 
    }, []);

      // Función para manejar la subida de nuevas imágenes
  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files);

    // Crear un FormData para enviar las imágenes al servidor
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("images[]", file);
    });

    MySwal.fire({
      title: "Subiendo imágenes...",
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
      const response = await fetch(`${config.api}uploadRecomendsImages.php`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (response.ok) {
        MySwal.fire({
          icon: "success",
          title: "¡Imágenes subidas!",
          text: "Las imágenes se han subido correctamente.",
          didClose: () => {
            window.location.reload();
          },
        }).then(() => {
          fetchBannerImages(); // Actualizar la lista de imágenes después de la subida
        });
      } else {
        throw new Error("Error al subir las imágenes.");
      }
    } catch (error) {
      console.error("Error uploading images:", error);
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un error al subir las imágenes.",
      });
    }
  };

   // Función para eliminar una imagen del banner
   const handleDeleteImage = (image) => {
    MySwal.fire({
      title: "¿Estás seguro?",
      text: "¿Quieres eliminar esta imagen de los recomendados?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#dd0db3",
      cancelButtonColor: "#454569",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(
            `${config.api}deleteRecomendsImage.php?image=${image.image}&id=${image.id}`,
            {
              credentials: "include",
              method: "get",
            }
          );

          if (response.ok) {
            MySwal.fire({
              icon: "success",
              title: "Imagen eliminada",
              text: "La imagen ha sido eliminada correctamente.",
            }).then(() => {
              fetchImages(); // Actualizar la lista de imágenes después de eliminar
            });
          } else {
            throw new Error("Error al eliminar la imagen.");
          }
        } catch (error) {
          console.error("Error deleting image:", error);
          MySwal.fire({
            icon: "error",
            title: "Error",
            text: "Hubo un error al eliminar la imagen.",
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
            <h2>Actualizar imagenes de los juegos recomendados</h2>
            <span>Recomendación:</span>
            <p>1200 pixeles de ancho x 2000 pixeles de alto</p>
            <span>Formatos compatibles:</span>
            <p>JPG, PNG, SVG O WEBP</p>
            <p>Puede agregar una o más imágenes</p>

            <input
              type="file"
              accept="image/*"
              multiple
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
          <div className="inner_grid banner">
            {images.map((image, index) => (
              <div key={index} className="banner-image">
                <img
                  src={`${config.public_recomends}${image.image}`}
                  alt={`Banner ${image}`}
                />
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteImage(image)}
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </>
  )
}

export default ImgRecomendados_a