import "./Footer.css";

const Footer = () => {
    const currentYear = new Date().getFullYear();

  return (
    <>
      <footer>
       <p> Copyright &copy; {currentYear} Suerte Caba. Todos los Derechos Reservados</p>
        <small>
          Desarrollado por{" "}
          <a href="https://digitalvibra.com" target="_blank">
            VIBRA DIGITAL
          </a>
        </small>
      </footer>
    </>
  );
};

export default Footer;
