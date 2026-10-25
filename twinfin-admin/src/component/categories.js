import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { errorMessage } from "../api/axios";

function Categories() {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");
  const load = () => api.get("/category").then((r) => setRows(r.data)).catch((e) => setError(errorMessage(e)));
  useEffect(() => { load(); }, []);

  const remove = async (c) => {
    if (!window.confirm(`Delete category ${c.name}?`)) return;
    await api.delete(`/category/${c._id}`);
    load();
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="page-title mb-0">Categories</h2>
        <Link to="/details/newcat" className="btn btn-primary">New category</Link>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="panel table-responsive">
        <table className="table align-middle mb-0">
          <thead><tr><th>Name</th><th>Type</th><th>Color</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {rows.map((c) => (
              <tr key={c._id}>
                <td>{c.name}</td><td className="text-capitalize">{c.type}</td>
                <td><span style={{ display: "inline-block", width: 18, height: 18, borderRadius: 4, background: c.color }}></span></td>
                <td>{c.isActive ? "Active" : "Hidden"}</td>
                <td className="text-nowrap text-end">
                  <Link to={`/details/updatecat/${c._id}`} className="btn btn-sm btn-outline-secondary me-1">Edit</Link>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => remove(c)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Categories;
