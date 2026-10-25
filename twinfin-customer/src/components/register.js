import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { errorMessage } from "../api/axios";
import "./register.css";

function Register() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await api.post("/register", form);
      navigate("/login");
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-wrap">
      <form className="panel auth-card" onSubmit={handleSubmit}>
        <h3>Create your twin</h3>
        <p className="text-muted">It takes less than a minute.</p>
        {error && <div className="alert alert-danger py-2">{error}</div>}
        <input className="form-control mb-3" placeholder="Full name" required value={form.name} onChange={set("name")} />
        <input className="form-control mb-3" type="email" placeholder="Email" required value={form.email} onChange={set("email")} />
        <input className="form-control mb-3" placeholder="Phone (optional)" value={form.phone} onChange={set("phone")} />
        <input className="form-control mb-3" type="password" placeholder="Password (min 6 characters)" minLength={6} required value={form.password} onChange={set("password")} />
        <button className="btn btn-primary w-100" disabled={busy}>{busy ? "Creating..." : "Register"}</button>
        <p className="mt-3 mb-0 text-center">Already registered? <Link to="/login">Login</Link></p>
      </form>
    </div>
  );
}

export default Register;
