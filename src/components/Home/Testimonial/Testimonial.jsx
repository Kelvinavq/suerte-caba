import "./Testimonial.css";
import React, { useEffect, useState, useRef } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import Slider from "react-slick";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import CloseIcon from "@mui/icons-material/Close";

import ParticlesBg from "particles-bg";

import Swal from "sweetalert2";

import config from "../../../config/config";

const Testimonial = () => {
  const [testimonios, setTestimonios] = useState([]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch(`${config.api}getTestimonialsActive.php`);
        if (!response.ok) {
          throw new Error("Failed to fetch cards images");
        }
        const data = await response.json();
        setTestimonios(data);
      } catch (error) {
        console.error("Error fetching cards images:", error);
      }
    };

    fetchTestimonials();
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    rating: "",
    testimonio: "",
  });

  useEffect(() => {
    AOS.init({
      duration: 1000,
    });
  }, []);

  const settings = {
    className: "center",
    centerMode: true,
    infinite: true,
    centerPadding: "60px",
    slidesToShow: 3,
    speed: 500,
    autoplay: true,
    arrows: false,
    responsive: [
      {
        breakpoint: 1300,
        settings: {
          slidesToShow: 2,
          centerPadding: "40px",
        },
      },
      {
        breakpoint: 920,
        settings: {
          slidesToShow: 1,
          centerPadding: "20px",
        },
      },
    ],
  };

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

  const openTestimonialModal = async () => {
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación de campos vacíos
    if (!formData.nombre || !formData.rating || !formData.testimonio) {
      Swal.fire("Error", "Todos los campos son obligatorios.", "error");
      return;
    }

    const response = await fetch(`${config.api}createTestimonial.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      Swal.fire(
        "¡Gracias!",
        "Tu testimonio ha sido enviado correctamente.",
        "success"
      );
      setFormData({ nombre: "", rating: "", testimonio: "" });
      closeModal();
    } else {
      Swal.fire("Error", "Hubo un problema al enviar tu testimonio.", "error");
    }
  };

  if (testimonios.length === 0) {
    return null;
  }

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(i <= rating ? <StarIcon key={i} /> : <StarBorderIcon key={i} />);
    }
    return stars;
  };

  return (
    <>
      <div className="container_testimonial" id="clientes">
        {/* <ParticlesBg
          num={particleNum}
          type="cobweb"
          bg={true}
          color="#fbe903"
        /> */}
        <div className="title">
          <div className="button">
            <button className="btn-2" data-aos="fade-up" data-aos-delay="200">
              Testimonios
            </button>
          </div>
          <h2 data-aos="fade-up" data-aos-delay="400">
            Más de 100 personas confían en nosotros.
          </h2>
        </div>
        <div className="testimonials" data-aos="fade-up" data-aos-delay="600">
          <Slider {...settings}>
            {testimonios.map((testimonio, index) => (
              <div className="slide_testimonial" key={index}>
                <div className="inner_slide">
                  <div className="content">
                    <p>
                     {testimonio.testimonio}
                    </p>
                  </div>

                  <div className="footer_testimonial">
                    <div className="user">
                      <span>{testimonio.cliente}</span>
                      <p>Cliente Habitual</p>
                    </div>

                    <div className="stars">
                    <div className="container_stars">
                        {renderStars(testimonio.estrellas)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>

          <div className="button">
            <button className="btn" onClick={openTestimonialModal}>
              Agregar mi testimonio
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal" ref={modalRef}>
            <button className="close-modal " onClick={closeModal}>
              <CloseIcon />
            </button>
            <div className="title">
              <h4>Crear testimonio</h4>
            </div>

            <form className="content-modal" onSubmit={handleSubmit}>
              <div className="input">
                <label htmlFor="nombre">Ingrese su nombre</label>
                <input
                  type="text"
                  name="nombre"
                  id="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                />
              </div>

              <div className="input">
                <label htmlFor="">Calificanos!</label>
              </div>
              <div className="input rating">
                <div className="rating">
                  <input
                    value="5"
                    name="rating"
                    id="star5"
                    type="radio"
                    checked={formData.rating === "5"}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="star5"></label>
                  <input
                    value="4"
                    name="rating"
                    id="star4"
                    type="radio"
                    checked={formData.rating === "4"}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="star4"></label>
                  <input
                    value="3"
                    name="rating"
                    id="star3"
                    type="radio"
                    checked={formData.rating === "3"}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="star3"></label>
                  <input
                    value="2"
                    name="rating"
                    id="star2"
                    type="radio"
                    checked={formData.rating === "2"}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="star2"></label>
                  <input
                    value="1"
                    name="rating"
                    id="star1"
                    type="radio"
                    checked={formData.rating === "1"}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="star1"></label>
                </div>
              </div>

              <div className="input">
                <label htmlFor="testimonio">Escriba su testimonio</label>
                <textarea
                  name="testimonio"
                  id="testimonio"
                  value={formData.testimonio}
                  onChange={handleInputChange}
                ></textarea>
              </div>

              <div className="btn">
                <button className="btn" type="submit">
                  Enviar mi testimonio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Testimonial;
