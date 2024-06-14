import React, { useState, useEffect } from "react";
import "./Ajustes_a.css";
import Sidebar_a from "../Sidebar_a";
import config from "../../../config/config";

import Swal from "sweetalert2";

const Ajustes_a = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // useEffect para cargar el email del usuario al cargar el componente
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${config.api}getUserData.php`, {
          credentials: "include", // Incluye las cookies en la solicitud
          headers: {
            "Content-Type": "application/json",
            // Puedes agregar más headers si es necesario
          },
        });
        if (response.ok) {
          const data = await response.json();
          setEmail(data.email);
        } else {
          throw new Error("Error al cargar los datos del usuario.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  // Función para manejar el envío del formulario de actualización
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (email.trim() === "") {
      MySwal.fire({
        icon: "warning",
        title: "Email inválido",
        text: "Por favor ingresa un correo electrónico válido.",
      });
      return;
    }
    
    // Validar que el password tenga al menos 8 caracteres si se proporciona
    if (password.length > 0 && password.length < 8) {
      Swal.fire({
        icon: "warning",
        title: "Contraseña inválida",
        text: "La contraseña debe tener al menos 8 caracteres.",
      });
      return;
    }

    // Preparar los datos para enviar al backend
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    try {
      const response = await fetch(`${config.api}updateUserData.php`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "¡Datos actualizados!",
          text: "Los datos del usuario se han actualizado correctamente.",
          didClose: () =>{
            window.location.reload();
          }
        });
      } else {
        throw new Error("Error al actualizar los datos del usuario.");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un error al actualizar los datos del usuario.",
      });
      console.error("Error updating user data:", error);
      alert("Hubo un error al actualizar los datos del usuario.");
    }
  };

  return (
    <>
      <Sidebar_a />
      <div className="container_admin">
        <div className="inner_admin_ajustes">
          <div className="title">
            <h2>Ajustes</h2>
          </div>

          <form onSubmit={handleSubmit}>
            <h4>Datos de acceso</h4>

            <div className="input">
              <label htmlFor="email">Correo electrónico</label>
              <input
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="mail@gmail.com"
                required
              />
            </div>

            <div className="input">
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                name="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingrese una nueva contraseña"
              />
            </div>

            <div className="btn">
              <button type="submit" className="btn">
                Actualizar información
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Ajustes_a;
