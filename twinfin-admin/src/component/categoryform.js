import { useState } from "react";

// Shared form for creating and editing a category
function CategoryForm({ initial, onSubmit, submitLabel, error }) {
  const [form, setForm] = useState(initial);
  const set = (key) => (e) => setForm({ ...form, [key]: e.target.type === "checkbox" ? e.target.checked : e.target.value });
  return (
    <form className="panel" style={{ maxWidth: 480 }} onSubmit={(e) => { e.preventDefault(); onSubmit(form); }}>
      {error && <div className="alert alert-danger py-2">{error}</div>}
      <label className="form-label small">Name</label>
      <input className="form-control mb-3" required value={form.name} onChange={set("name")} />
      <label className="form-label small">Type</label>
      <select className="form-select mb-3" value={form.type} onChange={set("type")}>
        <option value="expense">Expense</option><option value="income">Income</option>
      </select>
      <label className="form-label small">Color</label>
      <input className="form-control form-control-color mb-3" type="color" value={form.color} onChange={set("color")} />
      <div className="form-check mb-3">
        <input className="form-check-input" type="checkbox" id="catActive" checked={form.isActive} onChange={set("isActive")} />
        <label className="form-check-label" htmlFor="catActive">Visible to customers</label>
      </div>
      <button className="btn btn-primary">{submitLabel}</button>
    </form>
  );
}

export default CategoryForm;
