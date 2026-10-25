import "./card.css";

// Summary stat card used on the dashboard
function StatCard({ icon, label, value, tone = "" }) {
  return (
    <div className="panel stat-card">
      <div className={`stat-icon ${tone}`}><i className={`bi bi-${icon}`}></i></div>
      <div>
        <div className="stat-label">{label}</div>
        <div className="stat-value">{value}</div>
      </div>
    </div>
  );
}

export default StatCard;
