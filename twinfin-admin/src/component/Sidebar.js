import { NavLink, useNavigate } from "react-router-dom";
import "./adminside.css";

function Sidebar() {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("adminToken");
    navigate("/");
  };
  return (
    <aside className="admin-side">
      <div className="admin-brand"><i className="bi bi-intersect"></i> Twinfin Admin</div>
      <NavLink end to="/details"><i className="bi bi-grid"></i> Overview</NavLink>
      <NavLink to="/details/customers"><i className="bi bi-people"></i> Customers</NavLink>
      <NavLink to="/details/categories"><i className="bi bi-tags"></i> Categories</NavLink>
      <button className="btn btn-outline-light btn-sm mt-auto" onClick={logout}>Logout</button>
    </aside>
  );
}

export default Sidebar;
