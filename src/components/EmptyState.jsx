export default function EmptyState({ icon, title, description, ctaLabel, onCta }) {
  return (
    <div className="empty-state">
      <div className="icon-wrap" style={{ fontSize: 36 }}>{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
      {ctaLabel && (
        <button className="btn btn-primary" onClick={onCta}>
          🔍 {ctaLabel}
        </button>
      )}
    </div>
  );
}
