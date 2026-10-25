import { useEffect, useState } from "react";
import api, { errorMessage } from "../api/axios";

function Customers() {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");
  const load = () => api.get("/customers").then((r) => setRows(r.data)).catch((e) => setError(errorMessage(e)));
  useEffect(() => { load(); }, []);

  const toggle = async (id) => { await api.patch(`/customers/${id}/toggle`); load(); };
  const remove = async (c) => {
    if (!window.confirm(`Delete ${c.name} and all their data?`)) return;
    await api.delete(`/customers/${c._id}`);
    load();
  };

  return (
    <>
      <h2 className="page-title">Customers</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="panel table-responsive">
        <table className="table align-middle mb-0">
          <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Currency</th><th>Transactions</th><th>Joined</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {rows.map((c) => (
              <tr key={c._id}>
                <td>{c.name}</td><td>{c.email}</td><td>{c.phone}</td><td>{c.currency}</td><td>{c.transactions}</td>
                <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                <td><span className={`badge ${c.isActive ? "text-bg-success" : "text-bg-secondary"}`}>{c.isActive ? "Active" : "Disabled"}</span></td>
                <td className="text-nowrap">
                  <button className="btn btn-sm btn-outline-secondary me-1" onClick={() => toggle(c._id)}>{c.isActive ? "Disable" : "Enable"}</button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => remove(c)}>Delete</button>
                </td>
              </tr>
            ))}
            {!rows.length && <tr><td colSpan="8" className="text-muted">No customers yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Customers;
