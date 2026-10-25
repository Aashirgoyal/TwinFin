import { useEffect, useState } from "react";
import api, { errorMessage, money } from "../api/axios";

function Budgets() {
  const [rows, setRows] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ category: "", amount: "" });
  const [error, setError] = useState("");

  const load = () => api.get("/dashboard").then((r) => setRows(r.data.budgetStatus)).catch((e) => setError(errorMessage(e)));
  useEffect(() => {
    load();
    api.get("/category").then((r) => setCategories(r.data.filter((c) => c.type === "expense")));
  }, []);

  const save = async (e) => {
    e.preventDefault();
    try {
      await api.post("/budgets", { category: form.category, amount: Number(form.amount) });
      setForm({ category: "", amount: "" });
      load();
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  const remove = async (id) => {
    await api.delete(`/budgets/${id}`);
    load();
  };

  const totalBudget = rows.reduce((s, b) => s + b.budget, 0);
  const totalSpent = rows.reduce((s, b) => s + b.spent, 0);

  return (
    <div className="container">
      <h2 className="page-title">Budgets</h2>
      {error && <div className="alert alert-danger py-2">{error}</div>}
      <form className="panel mb-3 row g-2 align-items-end mx-0" onSubmit={save}>
        <div className="col-md-5"><label className="form-label small">Category</label>
          <select className="form-select" required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            <option value="">Choose</option>{categories.map((c) => <option key={c._id}>{c.name}</option>)}</select></div>
        <div className="col-md-4"><label className="form-label small">Monthly limit</label>
          <input className="form-control" type="number" min="0" required value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} /></div>
        <div className="col-md-3"><button className="btn btn-primary w-100">Save budget</button></div>
        <div className="small text-muted">Saving a category that already has a budget updates its limit.</div>
      </form>

      <div className="panel">
        <h5>This month: {money(totalSpent)} spent of {money(totalBudget)}</h5>
        {rows.map((b) => {
          const pct = b.budget ? Math.round((b.spent / b.budget) * 100) : 0;
          return (
            <div key={b.id} className="d-flex align-items-center gap-3 mb-3">
              <div style={{ width: 130 }}>{b.category}</div>
              <div className="flex-fill">
                <div className="progress" style={{ height: 10 }}>
                  <div className={`progress-bar ${pct > 100 ? "bg-danger" : pct > 80 ? "bg-warning" : "bg-success"}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                </div>
                <div className="small text-muted">{money(b.spent)} of {money(b.budget)} ({pct}%){pct > 100 && <span className="text-danger"> over by {money(b.spent - b.budget)}</span>}</div>
              </div>
              <button className="btn btn-sm btn-link text-danger" onClick={() => remove(b.id)}><i className="bi bi-trash"></i></button>
            </div>
          );
        })}
        {!rows.length && <p className="text-muted mb-0">No budgets yet. Add one above.</p>}
      </div>
    </div>
  );
}

export default Budgets;
