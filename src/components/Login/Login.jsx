import "./Login.css";
import React, { useEffect, useState } from "react";
import img from "../../assets/logo.svg";
import Swal from "sweetalert2";
import config from "../../config/config";

import AOS from "aos";
import "aos/dist/aos.css";

import ParticlesBg from "particles-bg";

import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

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
        text: "La contraseña debe contener al menos 8 caracteres",
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

  const handleResetPassword = () => {
    MySwal.fire({
      title: "Restablecer Contraseña",
      html: '<input id="reset-email" class="swal2-input" placeholder="Ingrese su correo electrónico">',
      showCancelButton: true,
      confirmButtonText: "Enviar Código",
      preConfirm: () => {
        const email = Swal.getPopup().querySelector("#reset-email").value;
        if (!email) {
          Swal.showValidationMessage("Debe ingresar un correo electrónico");
        }
        return { email: email };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const { email } = result.value;
        // Enviar solicitud de restablecimiento de contraseña al servidor
        sendResetPasswordRequest(email);
      }
    });
  };

  const sendResetPasswordRequest = async (email) => {
    try {
      const response = await fetch(`${config.api}resetPassword.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email }),
      });

      const responseData = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Éxito",
          text: responseData.message,
        }).then(() => {
          handleConfirmResetPassword(email);
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: responseData.error || "Hubo un problema al enviar la solicitud",
        });
      }
    } catch (error) {
      console.error("Error al enviar solicitud de restablecimiento:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error inesperado al enviar solicitud de restablecimiento",
      });
    }
  };

  const handleConfirmResetPassword = (email) => {
    MySwal.fire({
      title: "Ingresar Código de Verificación",
      html:
        '<input id="reset-code" class="swal2-input" placeholder="Ingrese el código recibido">' +
        '<input id="new-password" type="password" class="swal2-input" placeholder="Ingrese su nueva contraseña">',
      showCancelButton: true,
      confirmButtonText: "Confirmar",
      preConfirm: () => {
        const code = Swal.getPopup().querySelector("#reset-code").value;
        const newPassword = Swal.getPopup().querySelector("#new-password").value;
        if (!code || !newPassword) {
          Swal.showValidationMessage("Debe ingresar el código y la nueva contraseña");
        }
        return { email, code, newPassword };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const { email, code, newPassword } = result.value;
        // Enviar solicitud para confirmar el código y actualizar la contraseña
        confirmResetPassword(email, code, newPassword);
      }
    });
  };

  const confirmResetPassword = async (email, code, newPassword) => {
    try {
      const response = await fetch(`${config.api}verifyResetCode.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code, newPassword }),
      });

      const responseData = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Éxito",
          text: responseData.message,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: responseData.error || "Hubo un problema al restablecer la contraseña",
        });
      }
    } catch (error) {
      console.error("Error al restablecer la contraseña:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error inesperado al restablecer la contraseña",
      });
    }
  };

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
                      placeholder="+8 caracteres"
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
                  <span>¿Olvidaste tu contraseña?</span>
                  <button
                    type="button"
                    className="btn-2"
                    onClick={handleResetPassword}
                  >
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
