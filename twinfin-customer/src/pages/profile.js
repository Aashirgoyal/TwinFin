import { useEffect, useState } from "react";
import api, { errorMessage } from "../api/axios";
import { useAuth } from "../AuthContext";

const CURRENCIES = ["USD", "INR", "EUR", "GBP", "JPY", "AUD", "CAD"];

function Profile() {
  const { updateCustomer } = useAuth();
  const [form, setForm] = useState(null);
  const [msg, setMsg] = useState({ type: "", text: "" });

  useEffect(() => { api.get("/profile").then((r) => setForm(r.data)); }, []);
  if (!form) return <div className="container text-muted">Loading...</div>;

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const save = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.put("/profile", { ...form, monthlyIncome: Number(form.monthlyIncome || 0) });
      updateCustomer(data);
      setMsg({ type: "success", text: "Profile saved" });
    } catch (err) {
      setMsg({ type: "danger", text: errorMessage(err) });
    }
  };

  return (
    <div className="container" style={{ maxWidth: 560 }}>
      <h2 className="page-title">Profile</h2>
      <form className="panel" onSubmit={save}>
        {msg.text && <div className={`alert alert-${msg.type} py-2`}>{msg.text}</div>}
        <label className="form-label small">Name</label>
        <input className="form-control mb-3" required value={form.name} onChange={set("name")} />
        <label className="form-label small">Email</label>
        <input className="form-control mb-3" value={form.email} disabled />
        <label className="form-label small">Phone</label>
        <input className="form-control mb-3" value={form.phone || ""} onChange={set("phone")} />
        <div className="row g-2 mb-3">
          <div className="col"><label className="form-label small">Currency</label>
            <select className="form-select" value={form.currency} onChange={set("currency")}>{CURRENCIES.map((c) => <option key={c}>{c}</option>)}</select></div>
          <div className="col"><label className="form-label small">Expected monthly income</label>
            <input className="form-control" type="number" min="0" value={form.monthlyIncome} onChange={set("monthlyIncome")} /></div>
        </div>
        <button className="btn btn-primary">Save changes</button>
      </form>
    </div>
  );
}

export default Profile;
