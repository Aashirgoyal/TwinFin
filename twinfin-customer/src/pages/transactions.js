import { useEffect, useState, useCallback } from "react";
import api, { errorMessage, money } from "../api/axios";
import "./transactions.css";

const today = () => new Date().toISOString().slice(0, 10);
const EMPTY = { description: "", category: "", account: "Checking", amount: "", type: "expense", date: today() };

function Transactions() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({ month: new Date().toISOString().slice(0, 7), category: "", q: "" });
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    api.get("/transactions", { params: filters }).then((r) => setItems(r.data)).catch((e) => setError(errorMessage(e)));
  }, [filters]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { api.get("/category").then((r) => setCategories(r.data)); }, []);

  const save = async (e) => {
    e.preventDefault();
    setError("");
    const amount = Math.abs(Number(form.amount)) * (form.type === "expense" ? -1 : 1);
    const body = { description: form.description, category: form.category, account: form.account, amount, date: form.date };
    try {
      if (editId) await api.put(`/transactions/${editId}`, body);
      else await api.post("/transactions", body);
      setForm(EMPTY);
      setEditId(null);
      load();
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  const edit = (t) => {
    setEditId(t._id);
    setForm({ description: t.description, category: t.category, account: t.account, amount: Math.abs(t.amount),
      type: t.amount < 0 ? "expense" : "income", date: t.date.slice(0, 10) });
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this transaction?")) return;
    await api.delete(`/transactions/${id}`);
    load();
  };

  const exportCsv = () => {
    const rows = [["Date", "Description", "Category", "Account", "Amount"],
      ...items.map((t) => [t.date.slice(0, 10), t.description, t.category, t.account, t.amount])];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = `transactions-${filters.month || "all"}.csv`;
    a.click();
  };

  const total = items.reduce((s, t) => s + t.amount, 0);
  const shownCats = categories.filter((c) => c.type === form.type);

  return (
    <div className="container">
      <h2 className="page-title">Transactions</h2>
      {error && <div className="alert alert-danger py-2">{error}</div>}

      <form className="panel mb-3 row g-2 align-items-end mx-0" onSubmit={save}>
        <div className="col-md-3"><label className="form-label small">Description</label>
          <input className="form-control" required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
        <div className="col-6 col-md-1"><label className="form-label small">Type</label>
          <select className="form-select" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value, category: "" })}>
            <option value="expense">Out</option><option value="income">In</option></select></div>
        <div className="col-6 col-md-2"><label className="form-label small">Category</label>
          <select className="form-select" required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            <option value="">Choose</option>
            {shownCats.map((c) => <option key={c._id}>{c.name}</option>)}
          </select></div>
        <div className="col-6 col-md-2"><label className="form-label small">Amount</label>
          <input className="form-control" type="number" min="0.01" step="0.01" required value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} /></div>
        <div className="col-6 col-md-2"><label className="form-label small">Date</label>
          <input className="form-control" type="date" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
        <div className="col-md-2 d-flex gap-1">
          <button className="btn btn-primary flex-fill">{editId ? "Update" : "Add"}</button>
          {editId && <button type="button" className="btn btn-outline-secondary" onClick={() => { setEditId(null); setForm(EMPTY); }}>Cancel</button>}
        </div>
      </form>

      <div className="panel">
        <div className="row g-2 mb-3">
          <div className="col-md-3"><input type="month" className="form-control" value={filters.month} onChange={(e) => setFilters({ ...filters, month: e.target.value })} /></div>
          <div className="col-md-3"><select className="form-select" value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })}>
            <option value="">All categories</option>{categories.map((c) => <option key={c._id}>{c.name}</option>)}</select></div>
          <div className="col-md-4"><input className="form-control" placeholder="Search description" value={filters.q} onChange={(e) => setFilters({ ...filters, q: e.target.value })} /></div>
          <div className="col-md-2"><button className="btn btn-outline-secondary w-100" onClick={exportCsv} disabled={!items.length}><i className="bi bi-download"></i> CSV</button></div>
        </div>
        <div className="table-responsive">
          <table className="table table-hover tx-table">
            <thead><tr><th>Date</th><th>Description</th><th>Category</th><th>Account</th><th className="text-end">Amount</th><th></th></tr></thead>
            <tbody>
              {items.map((t) => (
                <tr key={t._id}>
                  <td>{new Date(t.date).toLocaleDateString()}</td><td>{t.description}</td>
                  <td><span className="badge text-bg-light">{t.category}</span></td><td>{t.account}</td>
                  <td className={`text-end ${t.amount < 0 ? "text-expense" : "text-income"}`}>{money(t.amount)}</td>
                  <td className="text-end text-nowrap">
                    <button className="btn btn-sm btn-link" onClick={() => edit(t)}><i className="bi bi-pencil"></i></button>
                    <button className="btn btn-sm btn-link text-danger" onClick={() => remove(t._id)}><i className="bi bi-trash"></i></button>
                  </td>
                </tr>
              ))}
              {!items.length && <tr><td colSpan="6" className="text-muted text-center">No transactions found.</td></tr>}
            </tbody>
            <tfoot><tr><th colSpan="4">Net</th><th className="text-end">{money(total)}</th><th></th></tr></tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Transactions;
