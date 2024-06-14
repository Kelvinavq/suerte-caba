import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./config/config.css";

import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";

// admin
import ImgHeader from "./pages/Admin/ImgHeader";
import ImgTarjetas from "./pages/Admin/imgTarjetas";
import ImgBanner from "./pages/Admin/ImgBanner";
import Testimonios from "./pages/Admin/Testimonios";
import Ajustes from "./pages/Admin/Ajustes";

const router = createBrowserRouter([
  // publics
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  // admin
  {
    path: "/admin/",
    element: <ImgHeader />,
  },
  {
    path: "/admin/tarjetas",
    element: <ImgTarjetas />,
  },
  {
    path: "/admin/banner",
    element: <ImgBanner />,
  },
  {
    path: "/admin/testimonios",
    element: <Testimonios />,
  },
  {
    path: "/admin/ajustes",
    element: <Ajustes />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </React.StrictMode>
);
