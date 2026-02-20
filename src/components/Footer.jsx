const Footer = () => {
  return (
    <footer className="bg-light border-top py-3 mt-auto">
      <div className="container text-center">
        <p className="mb-1 fw-semibold">
          © {new Date().getFullYear()} Dilraj Kirana Store
        </p>

        <p className="mb-0 text-muted small">
          Built with ❤️ by Prabhakar Technologies
        </p>
      </div>
    </footer>
  );
};

export default Footer;