import { useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('avnishstudy_token');
    navigate('/login');
  };

  // Formats the date as "Wednesday, 15 July 2026"
  const dateOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  const todayFormatted = new Date().toLocaleDateString('en-GB', dateOptions);

  return (
    <header style={styles.header}>
      <div>
        <h1 style={styles.title}>Revision Ledger</h1>
        <p style={styles.subtitle}>1–4–7 spaced repetition tracker</p>
      </div>
      <div style={styles.rightSide}>
        <span className="mono" style={styles.date}>{todayFormatted}</span>
        <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
      </div>
    </header>
  );
}

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem 0',
    borderBottom: '4px double var(--rule)',
    marginBottom: '2rem',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '0.2rem',
  },
  subtitle: {
    color: 'var(--ink-soft)',
    fontSize: '0.95rem',
  },
  rightSide: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '0.5rem',
  },
  date: {
    fontSize: '0.85rem',
    color: 'var(--ink-soft)',
  },
  logoutBtn: {
    backgroundColor: 'transparent',
    border: '1px solid var(--rule)',
    padding: '0.4rem 0.8rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    color: 'var(--ink-soft)',
  }
};