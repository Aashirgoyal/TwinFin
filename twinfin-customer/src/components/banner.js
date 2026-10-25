import { Link } from "react-router-dom";
import "./banner.css";

function Banner() {
  return (
    <section className="tf-banner">
      <div>
        <h1>See your financial future before you live it.</h1>
        <p>Twinfin builds a digital twin of your personal finances from your transactions, budgets and goals, then shows where they are heading.</p>
        <Link to="/register" className="btn btn-light">Start now</Link>
      </div>
      <i className="bi bi-graph-up-arrow tf-banner-icon"></i>
    </section>
  );
}

export default Banner;
