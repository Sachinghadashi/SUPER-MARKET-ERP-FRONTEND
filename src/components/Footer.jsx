const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <p style={styles.text}>
          © {new Date().getFullYear()} Dilraj Kirana Store
        </p>

        <p style={styles.subText}>
          Built with ❤️ by Prabhakar Technologies
        </p>
      </div>
    </footer>
  );
};

export default Footer;

/* ================= STYLES ================= */

const styles = {
  footer: {
    width: "100%",
    background: "#0f172a",
    color: "#f8fafc",
    padding: "16px 10px",
    marginTop: "auto",
    boxShadow: "0 -2px 10px rgba(0,0,0,0.1)",
  },

  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    textAlign: "center",
  },

  text: {
    margin: 0,
    fontSize: "14px",
    fontWeight: "600",
  },

  subText: {
    margin: "4px 0 0",
    fontSize: "12px",
    color: "#cbd5f5",
  },
};
