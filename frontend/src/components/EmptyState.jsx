const EmptyState = ({ icon = '📭', title = 'Nothing here', description = '', action }) => (
  <div className="empty-state">
    <div className="empty-icon">{icon}</div>
    <h3 className="empty-title">{title}</h3>
    {description && <p className="empty-desc">{description}</p>}
    {action && <div style={{ marginTop: '1.5rem' }}>{action}</div>}
  </div>
);

export default EmptyState;
