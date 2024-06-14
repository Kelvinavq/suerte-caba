import "./Testimonios_a.css";
import Sidebar_a from "../Sidebar_a";
import config from "../../../config/config";
import React, { useEffect, useState, useRef } from "react";
import CloseIcon from "@mui/icons-material/Close";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Swal from "sweetalert2";

const Testimonios_a = () => {
  const [testimonios, setTestimonios] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTestimonio, setSelectedTestimonio] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);

  const modalRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Cerrar el modal si se hace clic fuera de él
      const swalContainer = document.querySelector(".swal2-container");
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target) &&
        !swalContainer.contains(event.target)
      ) {
        closeModal();
      }

      // Cerrar el dropdown si se hace clic fuera de él
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchTestimonios = async () => {
    try {
      const response = await fetch(`${config.api}getTestimonials.php`);
      if (response.ok) {
        const data = await response.json();
        setTestimonios(data);
      } else {
        console.error("Error fetching testimonials");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchTestimonios();
  }, []);

  const openTestimonialModal = (testimonio) => {
    setSelectedTestimonio(testimonio);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedTestimonio(null);
    setIsModalOpen(false);
  };

  const toggleDropdown = (index) => {
    setDropdownOpen(dropdownOpen === index ? null : index);
  };

  const handleEdit = (testimonio) => {
    openTestimonialModal(testimonio);
    setDropdownOpen(null);
  };

  const handleToggleStatus = async (testimonio) => {
    const updatedStatus =
      testimonio.status === "activo" ? "inactivo" : "activo";

    const result = await Swal.fire({
      title: `¿Estás seguro de ${
        updatedStatus === "activo" ? "activar" : "desactivar"
      } este testimonio?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, confirmar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(
          `${config.api}updateTestimonialStatus.php`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: testimonio.id, status: updatedStatus }),
          }
        );

        if (response.ok) {
          Swal.fire(
            "¡Éxito!",
            `El testimonio ha sido ${
              updatedStatus === "activo" ? "activado" : "desactivado"
            } correctamente.`,
            "success"
          );

          setTestimonios((prevTestimonios) =>
            prevTestimonios.map((t) =>
              t.id === testimonio.id ? { ...t, status: updatedStatus } : t
            )
          );
        } else {
          Swal.fire(
            "Error",
            "Hubo un problema al actualizar el estado del testimonio.",
            "error"
          );
        }
      } catch (error) {
        console.error("Error:", error);
        Swal.fire(
          "Error",
          "Hubo un problema al actualizar el estado del testimonio.",
          "error"
        );
      }
    }

    setDropdownOpen(null);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${config.api}updateTestimonial.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(selectedTestimonio),
      });

      if (response.ok) {
        Swal.fire({
          title: "¡Éxito!",
          text: "El testimonio se ha actualizado correctamente.",
          icon: "success",
          didClose: () => {
            window.location.reload();
          },
        });

        closeModal();
      } else {
        Swal.fire(
          "Error",
          "Hubo un problema al actualizar el testimonio.",
          "error"
        );
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire(
        "Error",
        "Hubo un problema al actualizar el testimonio.",
        "error"
      );
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedTestimonio((prevTestimonio) => ({
      ...prevTestimonio,
      [name]: value,
    }));
  };

  return (
    <>
      <Sidebar_a />

      <div className="container_admin">
        <div className="inner_admin_testimonios">
          <div className="title">
            <h2>Testimonios</h2>
          </div>

          <div className="tabla">
            <table>
              <thead>
                <tr>
                  <th scope="col">Cliente</th>
                  <th scope="col">Testimonio</th>
                  <th scope="col">Estrellas</th>
                  <th scope="col">Estatus</th>
                  <th scope="col">Acción</th>
                </tr>
              </thead>
              <tbody>
                {testimonios.map((testimonio, index) => (
                  <tr key={index}>
                    <td data-label="Cliente">{testimonio.cliente}</td>
                    <td data-label="Testimonio">
                      <p>{testimonio.testimonio}</p>
                    </td>
                    <td data-label="Estrellas">{testimonio.estrellas}</td>
                    <td
                      data-label="Estatus"
                      className={`Estatus ${testimonio.status}`}
                    >
                      <span>{testimonio.status}</span>
                    </td>
                    <td data-label="Acción" className="drop">
                      <button
                        className="more-options"
                        onClick={() => toggleDropdown(index)}
                      >
                        <MoreHorizIcon />
                      </button>
                      {dropdownOpen === index && (
                        <div className="dropdown" ref={dropdownRef}>
                          <button
                            className="dropdown-option"
                            onClick={() => handleEdit(testimonio)}
                          >
                            Editar
                          </button>
                          <button
                            className="dropdown-option"
                            onClick={() => handleToggleStatus(testimonio)}
                          >
                            {testimonio.status === "activo"
                              ? "Desactivar"
                              : "Activar"}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal" ref={modalRef}>
            <button className="close-modal" onClick={closeModal}>
              <CloseIcon />
            </button>
            <div className="title">
              <h4>Editar testimonio</h4>
            </div>

            <form className="content-modal" onSubmit={handleFormSubmit}>
              <div className="input">
                <label htmlFor="nombre">Nombre del cliente</label>
                <input
                  type="text"
                  name="cliente"
                  id="nombre"
                  value={selectedTestimonio.cliente}
                  onChange={handleInputChange}
                />
              </div>

              <div className="input">
                <label>Calificación</label>
              </div>

              <div className="input rating">
                <div className="rating">
                  <input
                    value="5"
                    name="estrellas"
                    id="star5"
                    type="radio"
                    checked={parseInt(selectedTestimonio.estrellas, 10) === 5}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="star5"></label>
                  <input
                    value="4"
                    name="estrellas"
                    id="star4"
                    type="radio"
                    checked={parseInt(selectedTestimonio.estrellas, 10) === 4}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="star4"></label>
                  <input
                    value="3"
                    name="estrellas"
                    id="star3"
                    type="radio"
                    checked={parseInt(selectedTestimonio.estrellas, 10) === 3}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="star3"></label>
                  <input
                    value="2"
                    name="estrellas"
                    id="star2"
                    type="radio"
                    checked={parseInt(selectedTestimonio.estrellas, 10) === 2}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="star2"></label>
                  <input
                    value="1"
                    name="estrellas"
                    id="star1"
                    type="radio"
                    checked={parseInt(selectedTestimonio.estrellas, 10) === 1}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="star1"></label>
                </div>
              </div>

              <div className="input">
                <label htmlFor="testimonio">Testimonio</label>
                <textarea
                  name="testimonio"
                  id="testimonio"
                  value={selectedTestimonio.testimonio}
                  onChange={handleInputChange}
                ></textarea>
              </div>

              <div className="btn">
                <button className="btn" type="submit">
                  Guardar cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Testimonios_a;
