import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../utils/api';

export default function Login() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // If the user already has a token when they visit this page, send them straight to the dashboard
  useEffect(() => {
    const token = localStorage.getItem('avnishstudy_token');
    if (token) {
      navigate('/');
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Call the login endpoint we built on the backend
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ password }),
      });

      // Save the token and go to the dashboard!
      localStorage.setItem('avnishstudy_token', data.token);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Revision Ledger</h1>
        <p style={styles.subtitle}>1–4–7 spaced repetition tracker</p>

        <form onSubmit={handleLogin} style={styles.form}>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            disabled={isLoading}
          />
          {error && <p style={styles.error}>{error}</p>}
          <button type="submit" style={styles.button} disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
      </div>
    </div>
  );
}

// Keeping styles inline here to match the strict, clean spec requirements without external libraries
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    padding: '1rem',
  },
  card: {
    backgroundColor: 'var(--paper-2)',
    padding: '2.5rem',
    borderRadius: '8px',
    border: '1px solid var(--rule)',
    width: '100%',
    maxWidth: '400px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
  },
  title: {
    textAlign: 'center',
    fontSize: '1.75rem',
    marginBottom: '0.25rem',
  },
  subtitle: {
    textAlign: 'center',
    color: 'var(--ink-soft)',
    marginBottom: '2rem',
    fontSize: '0.9rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  input: {
    padding: '0.75rem',
    border: '1px solid var(--rule)',
    borderRadius: '4px',
    backgroundColor: 'var(--paper)',
    outline: 'none',
  },
  button: {
    padding: '0.75rem',
    backgroundColor: 'var(--indigo)',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '600',
  },
  error: {
    color: 'var(--stamp-red)',
    fontSize: '0.85rem',
    margin: 0,
  }
};