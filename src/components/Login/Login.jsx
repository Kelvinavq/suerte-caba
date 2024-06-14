import "./Login.css";
import React, { useEffect, useState } from "react";
import img from "../../assets/logo.svg";
import Swal from "sweetalert2";
import config from "../../config/config";

import AOS from "aos";
import "aos/dist/aos.css";

import ParticlesBg from "particles-bg";


const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const { email, password } = formData;

    if (!emailRegex.test(email)) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ingrese un correo electrónico válido",
      });
      return false;
    } else if (password.length < 8) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "La contraseña debe contener al menos 8 carácteres",
      });
      return false;
    }
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    // Validar campos antes de enviar al servidor
    if (!validateForm()) {
      return;
    }

    // Enviar datos al servidor
    try {
      const response = await fetch(`${config.api}login.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
        mode: "cors",
        credentials: "include",
      });

      const responseData = await response.json();

      if (response.ok) {
        localStorage.setItem("user_id", responseData.user_id);
        window.location.href = "/admin/";
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: responseData.error || "Correo o contraseña inválidos",
        });
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error inesperado al iniciar sesión",
      });
    }
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


  return (
    <>
      <div className="container_login">
      <ParticlesBg
          num={particleNum}
          type="cobweb"
          bg={true}
          color="#fbe903"
        />
        <div className="login_inner">
          <div className="login">
            <div className="left">
              <img src={img} alt="" />
            </div>
            <div className="right">
              <form action="" className="form" onSubmit={handleLogin}>
                <div className="title">
                  <h2>Bienvenido a</h2>
                  <h1>Suerte Caba</h1>
                </div>

                <div className="inputs">
                  <div className="input">
                    <label htmlFor="email">Correo electrónico</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="name@gmail.com"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="input">
                    <label htmlFor="password">Contraseña</label>
                    <input
                      type="password"
                      id="password"
                      placeholder="+8 carácteres"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="input">
                    <button className="btn" type="submit">
                      Ingresar
                    </button>
                  </div>
                </div>

                <div className="footer">
                  <span>Olvidaste tu contraseña ? </span>
                  <button type="submit" className="btn-2">
                    Restablecer
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
