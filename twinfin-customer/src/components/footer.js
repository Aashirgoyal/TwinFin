import "./footer.css";

function Footer() {
  return (
    <footer className="tf-footer">
      <div className="container d-flex flex-wrap justify-content-between gap-2">
        <span><i className="bi bi-intersect"></i> Twinfin, the digital twin of your money</span>
        <span>© {new Date().getFullYear()} Twinfin</span>
      </div>
    </footer>
  );
}

export default Footer;
