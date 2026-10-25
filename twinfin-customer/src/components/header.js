import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import "./header.css";

const LINKS = [
  ["/dashboard", "Dashboard", "speedometer2"],
  ["/transactions", "Transactions", "arrow-left-right"],
  ["/budgets", "Budgets", "pie-chart"],
  ["/goals", "Goals", "flag"],
];

function Header() {
  const { customer, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-md tf-header">
      <div className="container">
        <Link className="navbar-brand tf-brand" to="/">
          <i className="bi bi-intersect"></i> Twinfin
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#tfNav"
          onClick={() => document.getElementById("tfNav").classList.toggle("show")}>
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="tfNav">
          {customer && (
            <ul className="navbar-nav me-auto">
              {LINKS.map(([to, label, icon]) => (
                <li className="nav-item" key={to}>
                  <NavLink className="nav-link" to={to}><i className={`bi bi-${icon}`}></i> {label}</NavLink>
                </li>
              ))}
            </ul>
          )}
          <div className="ms-auto d-flex gap-2 align-items-center">
            {customer ? (
              <>
                <NavLink to="/profile" className="nav-link tf-user"><i className="bi bi-person-circle"></i> {customer.name}</NavLink>
                <button className="btn btn-outline-secondary btn-sm" onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline-secondary btn-sm">Login</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Get started</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;
