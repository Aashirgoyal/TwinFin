import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { errorMessage, money } from "../api/axios";
import StatCard from "../components/cards.js";
import { BarChart, LineChart, DonutChart } from "../components/charts.js";
import "./dashboard.css";

const thisMonth = () => new Date().toISOString().slice(0, 7);

function Dashboard() {
  const [month, setMonth] = useState(thisMonth());
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/dashboard", { params: { month } })
      .then((res) => setData(res.data))
      .catch((err) => setError(errorMessage(err)));
  }, [month]);

  if (error) return <div className="container"><div className="alert alert-danger">{error}</div></div>;
  if (!data) return <div className="container text-muted">Loading your twin...</div>;
  const { summary, trend, projection, byCategory, budgetStatus, goals, recent } = data;

  return (
    <div className="container">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
        <h2 className="page-title mb-0">Dashboard</h2>
        <input type="month" className="form-control w-auto" value={month} onChange={(e) => setMonth(e.target.value)} />
      </div>

      <div className="row g-3 mb-3">
        <div className="col-6 col-lg"><StatCard icon="arrow-down-circle" tone="green" label="Income" value={money(summary.income)} /></div>
        <div className="col-6 col-lg"><StatCard icon="arrow-up-circle" tone="red" label="Expenses" value={money(summary.expenses)} /></div>
        <div className="col-6 col-lg"><StatCard icon="piggy-bank" label="Net saved" value={money(summary.net)} /></div>
        <div className="col-6 col-lg"><StatCard icon="percent" tone="blue" label="Savings rate" value={`${summary.savingsRate}%`} /></div>
        <div className="col-12 col-lg"><StatCard icon="heart-pulse" label="Health score" value={`${summary.healthScore}/100`} /></div>
      </div>

      <div className="row g-3 mb-3">
        <div className="col-lg-7">
          <div className="panel h-100">
            <h5>Income vs expenses <small className="text-muted fw-normal">last 6 months</small></h5>
            <BarChart data={trend} />
          </div>
        </div>
        <div className="col-lg-5">
          <div className="panel h-100">
            <h5>Where the money went</h5>
            <DonutChart data={byCategory} />
          </div>
        </div>
      </div>

      <div className="row g-3 mb-3">
        <div className="col-lg-7">
          <div className="panel h-100">
            <h5>Your twin's 12-month projection</h5>
            <p className="text-muted small">Balance today {money(summary.balance)}. If you keep your current habits, in 12 months it will be about <strong>{money(projection[11]?.balance)}</strong>.</p>
            <LineChart data={projection} height={170} />
          </div>
        </div>
        <div className="col-lg-5">
          <div className="panel h-100">
            <h5>Budgets <Link to="/budgets" className="small float-end">Manage</Link></h5>
            {budgetStatus.length === 0 && <p className="text-muted">No budgets yet.</p>}
            {budgetStatus.map((b) => {
              const pct = b.budget ? Math.round((b.spent / b.budget) * 100) : 0;
              return (
                <div key={b.category} className="mb-2">
                  <div className="d-flex justify-content-between small"><span>{b.category}</span><span>{money(b.spent)} / {money(b.budget)}</span></div>
                  <div className="progress" style={{ height: 6 }}>
                    <div className={`progress-bar ${pct > 100 ? "bg-danger" : pct > 80 ? "bg-warning" : "bg-success"}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="row g-3">
        <div className="col-lg-7">
          <div className="panel h-100">
            <h5>Recent transactions <Link to="/transactions" className="small float-end">View all</Link></h5>
            <table className="table table-sm mb-0">
              <tbody>
                {recent.map((t) => (
                  <tr key={t._id}>
                    <td>{t.description}<div className="small text-muted">{t.category}</div></td>
                    <td className="text-muted small">{new Date(t.date).toLocaleDateString()}</td>
                    <td className={`text-end ${t.amount < 0 ? "text-expense" : "text-income"}`}>{money(t.amount)}</td>
                  </tr>
                ))}
                {recent.length === 0 && <tr><td className="text-muted">No transactions this month.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
        <div className="col-lg-5">
          <div className="panel h-100">
            <h5>Goals <Link to="/goals" className="small float-end">Manage</Link></h5>
            {goals.map((g) => (
              <div key={g._id} className="mb-2">
                <div className="d-flex justify-content-between small"><span>{g.title}</span><span>{g.progress}%</span></div>
                <div className="progress" style={{ height: 6 }}><div className="progress-bar" style={{ width: `${g.progress}%`, background: "var(--tf-primary)" }} /></div>
              </div>
            ))}
            {goals.length === 0 && <p className="text-muted">No goals yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
