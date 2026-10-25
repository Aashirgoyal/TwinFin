// Small dependency-free SVG charts

export function BarChart({ data, height = 200 }) {
  const max = Math.max(1, ...data.flatMap((d) => [d.income, d.expenses]));
  const w = 100 / data.length;
  return (
    <>
    <svg viewBox={`0 0 100 ${height / 2}`} className="w-100" style={{ height }} preserveAspectRatio="none">
      {data.map((d, i) => {
        const h = height / 2;
        const hi = (d.income / max) * h, he = (d.expenses / max) * h;
        return (
          <g key={d.month}>
            <rect x={i * w + w * 0.15} y={h - hi} width={w * 0.33} height={hi} fill="#16a34a" rx="0.6"><title>{`Income ${d.income}`}</title></rect>
            <rect x={i * w + w * 0.52} y={h - he} width={w * 0.33} height={he} fill="#f97316" rx="0.6"><title>{`Expenses ${d.expenses}`}</title></rect>
          </g>
        );
      })}
    </svg>
    <div className="d-flex small text-muted">
      {data.map((d) => <span key={d.month} className="flex-fill text-center">{new Date(d.month + "-01T00:00").toLocaleString(undefined, { month: "short" })}</span>)}
    </div>
    <div className="small mt-2"><span className="text-income">■</span> Income <span className="ms-3" style={{ color: "#f97316" }}>■</span> Expenses</div>
    </>
  );
}

export function LineChart({ data, height = 200 }) {
  if (!data.length) return null;
  const vals = data.map((d) => d.balance);
  const min = Math.min(0, ...vals), max = Math.max(1, ...vals);
  const H = 90, pts = data.map((d, i) => [(i / (data.length - 1 || 1)) * 96 + 2, H - ((d.balance - min) / (max - min || 1)) * (H - 10) - 4]);
  const path = pts.map((p, i) => `${i ? "L" : "M"}${p[0]},${p[1]}`).join(" ");
  return (
    <svg viewBox={`0 0 100 ${H}`} className="w-100" style={{ height }} preserveAspectRatio="none">
      <path d={`${path} L98,${H} L2,${H} Z`} fill="#0f766e22" />
      <path d={path} fill="none" stroke="#0f766e" strokeWidth="0.8" vectorEffect="non-scaling-stroke" />
      {pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r="0.9" fill="#0f766e"><title>{`Month +${data[i].month}: ${data[i].balance}`}</title></circle>)}
    </svg>
  );
}

const PALETTE = ["#0f766e", "#f97316", "#2563eb", "#8b5cf6", "#db2777", "#ca8a04", "#0891b2", "#64748b"];

export function DonutChart({ data, size = 180 }) {
  const total = data.reduce((s, d) => s + d.spent, 0);
  if (!total) return <p className="text-muted">No spending this month.</p>;
  let acc = 0;
  const r = 15.9155; // circumference = 100
  return (
    <div className="d-flex align-items-center gap-3 flex-wrap">
      <svg viewBox="0 0 42 42" width={size} height={size}>
        {data.map((d, i) => {
          const pct = (d.spent / total) * 100;
          const el = <circle key={d.category} cx="21" cy="21" r={r} fill="none" stroke={PALETTE[i % PALETTE.length]} strokeWidth="6"
            strokeDasharray={`${pct} ${100 - pct}`} strokeDashoffset={25 - acc}><title>{d.category}</title></circle>;
          acc += pct;
          return el;
        })}
      </svg>
      <ul className="list-unstyled small mb-0">
        {data.map((d, i) => (
          <li key={d.category}><span style={{ color: PALETTE[i % PALETTE.length] }}>●</span> {d.category} {Math.round((d.spent / total) * 100)}%</li>
        ))}
      </ul>
    </div>
  );
}
