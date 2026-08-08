const Spinner = ({ fullPage = false, size = 'default', text = 'Loading...' }) => {
  if (fullPage) {
    return (
      <div style={{
        position: 'fixed', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: 'var(--bg)', gap: '1rem', zIndex: 999,
      }}>
        <div className={`spinner ${size === 'sm' ? 'spinner-sm' : ''}`} />
        {text && <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{text}</p>}
      </div>
    );
  }

  return (
    <div className="spinner-wrapper">
      <div className={`spinner ${size === 'sm' ? 'spinner-sm' : ''}`} />
      {text && <span>{text}</span>}
    </div>
  );
};

export default Spinner;
