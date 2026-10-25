import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { errorMessage } from "../api/axios";
import { useAuth } from "../AuthContext";
import "./login.css";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const { data } = await api.post("/login", form);
      login(data.token, data.customer);
      navigate("/dashboard");
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-wrap">
      <form className="panel auth-card" onSubmit={handleSubmit}>
        <h3>Welcome back</h3>
        <p className="text-muted">Log in to your financial twin.</p>
        {error && <div className="alert alert-danger py-2">{error}</div>}
        <input className="form-control mb-3" type="email" placeholder="Email" required
          value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="form-control mb-3" type="password" placeholder="Password" required
          value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button className="btn btn-primary w-100" disabled={busy}>{busy ? "Logging in..." : "Login"}</button>
        <p className="mt-3 mb-0 text-center">No account? <Link to="/register">Register</Link></p>
      </form>
    </div>
  );
}

export default Login;
