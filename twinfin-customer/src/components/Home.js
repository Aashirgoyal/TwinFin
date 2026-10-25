import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
import Banner from "./banner.js";
import "./Home.css";

const FEATURES = [
  ["speedometer2", "Live dashboard", "Income, spending, savings rate and a health score for every month."],
  ["graph-up-arrow", "12-month projection", "Your financial twin projects your balance forward from your real habits."],
  ["pie-chart", "Budgets", "Set limits per category and see where you are over before it hurts."],
  ["flag", "Goals", "Track savings goals with progress and the monthly amount you need."],
];

function Home() {
  const { customer } = useAuth();
  return (
    <div className="container">
      <Banner />
      <div className="row g-3 my-4">
        {FEATURES.map(([icon, title, text]) => (
          <div className="col-sm-6 col-lg-3" key={title}>
            <div className="panel h-100 home-feature">
              <i className={`bi bi-${icon}`}></i>
              <h6>{title}</h6>
              <p>{text}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="text-center my-5">
        <Link to={customer ? "/dashboard" : "/register"} className="btn btn-primary btn-lg">
          {customer ? "Open my dashboard" : "Create a free account"}
        </Link>
      </div>
    </div>
  );
}

export default Home;
