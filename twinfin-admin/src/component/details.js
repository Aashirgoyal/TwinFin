import { useEffect, useState } from "react";
import api, { errorMessage } from "../api/axios";

const CARDS = [
  ["customers", "Customers", "people"],
  ["transactions", "Transactions", "arrow-left-right"],
  ["goals", "Goals", "flag"],
  ["categories", "Categories", "tags"],
  ["volume", "Money tracked", "cash-stack"],
];

function Details() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => { api.get("/stats").then((r) => setStats(r.data)).catch((e) => setError(errorMessage(e))); }, []);

  return (
    <>
      <h2 className="page-title">Overview</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="row g-3">
        {stats && CARDS.map(([key, label, icon]) => (
          <div className="col-sm-6 col-xl" key={key}>
            <div className="panel">
              <div className="text-muted small"><i className={`bi bi-${icon}`}></i> {label}</div>
              <div className="fs-3 fw-bold">{key === "volume" ? Math.round(stats[key]).toLocaleString() : stats[key]}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default Details;
