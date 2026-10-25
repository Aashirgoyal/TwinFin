import { useEffect, useState } from "react";
import api, { errorMessage, money } from "../api/axios";
import "./goals.css";

const EMPTY = { title: "", saved: "", target: "", monthly: "", due: "" };

// Months between now and a "YYYY-MM" due date
const monthsLeft = (due) => {
  const [y, m] = due.split("-").map(Number);
  const now = new Date();
  return Math.max(0, (y - now.getFullYear()) * 12 + (m - 1 - now.getMonth()));
};

function Goals() {
  const [goals, setGoals] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");

  const load = () => api.get("/goals").then((r) => setGoals(r.data)).catch((e) => setError(errorMessage(e)));
  useEffect(() => { load(); }, []);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const save = async (e) => {
    e.preventDefault();
    setError("");
    const body = { ...form, saved: Number(form.saved || 0), target: Number(form.target), monthly: Number(form.monthly || 0) };
    try {
      if (editId) await api.put(`/goals/${editId}`, body);
      else await api.post("/goals", body);
      setForm(EMPTY);
      setEditId(null);
      load();
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  const contribute = async (g) => {
    const amount = Number(window.prompt(`Add to "${g.title}"`, g.monthly || 100));
    if (!amount) return;
    await api.put(`/goals/${g._id}`, { saved: g.saved + amount });
    load();
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this goal?")) return;
    await api.delete(`/goals/${id}`);
    load();
  };

  return (
    <div className="container">
      <h2 className="page-title">Savings goals</h2>
      {error && <div className="alert alert-danger py-2">{error}</div>}
      <form className="panel mb-3 row g-2 align-items-end mx-0" onSubmit={save}>
        <div className="col-md-3"><label className="form-label small">Goal</label><input className="form-control" required value={form.title} onChange={set("title")} /></div>
        <div className="col-6 col-md-2"><label className="form-label small">Saved</label><input className="form-control" type="number" min="0" value={form.saved} onChange={set("saved")} /></div>
        <div className="col-6 col-md-2"><label className="form-label small">Target</label><input className="form-control" type="number" min="1" required value={form.target} onChange={set("target")} /></div>
        <div className="col-6 col-md-2"><label className="form-label small">Monthly</label><input className="form-control" type="number" min="0" value={form.monthly} onChange={set("monthly")} /></div>
        <div className="col-6 col-md-2"><label className="form-label small">Due</label><input className="form-control" type="month" required value={form.due} onChange={set("due")} /></div>
        <div className="col-md-1"><button className="btn btn-primary w-100">{editId ? "Save" : "Add"}</button></div>
      </form>

      <div className="row g-3">
        {goals.map((g) => {
          const left = monthsLeft(g.due);
          const needed = left ? Math.ceil(Math.max(0, g.target - g.saved) / left) : Math.max(0, g.target - g.saved);
          const onTrack = g.saved >= g.target || g.monthly >= needed;
          return (
            <div className="col-md-6 col-lg-4" key={g._id}>
              <div className="panel goal-card h-100">
                <div className="d-flex justify-content-between">
                  <h5 className="mb-1">{g.title}</h5>
                  <span className={`badge ${onTrack ? "text-bg-success" : "text-bg-warning"}`}>{g.saved >= g.target ? "Done" : onTrack ? "On track" : "Behind"}</span>
                </div>
                <div className="text-muted small mb-2">Due {g.due} · {left} months left</div>
                <div className="progress mb-2" style={{ height: 10 }}><div className="progress-bar" style={{ width: `${g.progress}%`, background: "var(--tf-primary)" }} /></div>
                <div className="d-flex justify-content-between small"><span>{money(g.saved)} of {money(g.target)}</span><span>{g.progress}%</span></div>
                <div className="small text-muted mt-1">Needs {money(needed)}/month, you plan {money(g.monthly)}</div>
                <div className="mt-3 d-flex gap-2">
                  <button className="btn btn-sm btn-primary" onClick={() => contribute(g)}>Add money</button>
                  <button className="btn btn-sm btn-outline-secondary" onClick={() => { setEditId(g._id); setForm({ title: g.title, saved: g.saved, target: g.target, monthly: g.monthly, due: g.due }); }}>Edit</button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => remove(g._id)}>Delete</button>
                </div>
              </div>
            </div>
          );
        })}
        {!goals.length && <p className="text-muted">No goals yet. Add one above.</p>}
      </div>
    </div>
  );
}

export default Goals;
