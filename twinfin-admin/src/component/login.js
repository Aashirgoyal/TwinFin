import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { errorMessage } from "../api/axios";
import "./login.css";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/login", form);
      localStorage.setItem("adminToken", data.token);
      navigate("/details");
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  return (
    <div className="admin-login">
      <form className="panel" onSubmit={handleSubmit}>
        <h3><i className="bi bi-shield-lock"></i> Twinfin Admin</h3>
        {error && <div className="alert alert-danger py-2">{error}</div>}
        <input className="form-control mb-3" type="email" placeholder="Admin email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="form-control mb-3" type="password" placeholder="Password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button className="btn btn-primary w-100">Login</button>
      </form>
    </div>
  );
}

export default Login;
