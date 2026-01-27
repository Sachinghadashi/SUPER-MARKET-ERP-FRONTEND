const Footer = () => {
  return (
    <footer
      style={{
        background: "#f1f5f9",
        textAlign: "center",
        padding: 10,
        marginTop: 20,
        fontSize: 14,
      }}
    >
      © {new Date().getFullYear()} Supermarket ERP • Built with Prabhakar Technologies
    </footer>
  );
};

export default Footer;
