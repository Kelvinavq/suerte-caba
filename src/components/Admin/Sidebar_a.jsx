import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import "./sidebar_a.css";

import config from "../../config/config";

const Sidebar_a = () => {
  const location = useLocation();

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
    document.body.classList.toggle("openSidebar", isSidebarOpen);
    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.body.classList.remove("openSidebar");
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [isSidebarOpen]);

  const isActive = (pathname) => {
    return location.pathname === pathname ? "active" : "";
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(`${config.api}logout.php`, {
        method: "POST",
        mode: "cors",
        credentials: "include",
      });
  
      if (response.ok) {
        // Elimina la información de la sesión del almacenamiento local
        sessionStorage.removeItem("user_id");
  
        // Redirige al usuario a la página de inicio de sesión
        window.location.href = "/login";
      } else {
        // Maneja errores si es necesario
        console.error("Error al cerrar sesión");
      }
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <>
      <div className="sidebar_admin">
        <nav className="sidebar">
          <ul>
            <li
              onClick={toggleSidebar}
              className={`item ${isActive("/admin/")}`}
            >
              <a href="/admin/">Header</a>
            </li>
            <li
              onClick={toggleSidebar}
              className={`item ${isActive("/admin/tarjetas")}`}
            >
              <a href="/admin/tarjetas">Tarjetas</a>
            </li>
            <li
              onClick={toggleSidebar}
              className={`item ${isActive("/admin/banner")}`}
            >
              <a href="/admin/banner">Banner</a>
            </li>
            <li
              onClick={toggleSidebar}
              className={`item ${isActive("/admin/testimonios")}`}
            >
              <a href="/admin/testimonios">Testimonios</a>
            </li>
            <li
              onClick={toggleSidebar}
              className={`item ${isActive("/admin/ajustes")}`}
            >
              <a href="/admin/ajustes">Ajustes</a>
            </li>
            <li
              onClick={handleLogout}
              className={`item`}
            >
              <a href="#">Cerrar sesión</a>
            </li>
          </ul>
        </nav>

        <div className="button">
          <button className="btnSidebar" onClick={toggleSidebar}>
            <MenuOpenIcon />
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar_a;
