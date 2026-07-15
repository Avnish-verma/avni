import { useState, useEffect } from 'react';
import { apiFetch } from '../utils/api';
import Header from '../components/Header';
import Stats from '../components/Stats';
import DueToday from '../components/DueToday';
import AddTopicForm from '../components/AddTopicForm';
import TopicList from '../components/TopicList';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    setLoadingStats(true);
    setError(null);
    try {
      const [statsData, subjectsData] = await Promise.all([
        apiFetch('/stats/summary'),
        apiFetch('/subjects')
      ]);
      setStats(statsData);
      setSubjects(subjectsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleExport = async () => {
    try {
      const BASE_URL = import.meta.env.VITE_API_BASE_URL;
      const token = localStorage.getItem('avnishstudy_token');
      
      const response = await fetch(`${BASE_URL}/topics/export`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) throw new Error("Export failed");
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      // Get the filename from the Content-Disposition header if possible, else fallback
      const disposition = response.headers.get('Content-Disposition');
      let filename = 'revision-ledger-backup.json';
      if (disposition && disposition.indexOf('filename=') !== -1) {
        filename = disposition.split('filename=')[1].replace(/"/g, '');
      }
      
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      alert("Error exporting data: " + err.message);
    }
  };

  return (
    <div style={styles.container}>
      <Header />
      
      <main>
        {error && (
          <div style={styles.errorBanner}>
            <p>Failed to load data: {error}</p>
            <button onClick={fetchDashboardData} style={styles.retryBtn}>Retry</button>
          </div>
        )}

        <Stats data={stats} loading={loadingStats} />

        <DueToday onRevisionDone={fetchDashboardData} />

        <AddTopicForm onTopicAdded={fetchDashboardData} />

        <div style={styles.exportWrapper}>
          <button onClick={handleExport} style={styles.exportBtn}>
            ↓ Download Backup (JSON)
          </button>
        </div>

        <TopicList subjects={subjects} />
      </main>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '0 1.5rem 3rem 1.5rem',
  },
  errorBanner: {
    backgroundColor: '#FADBD8',
    color: 'var(--stamp-red)',
    padding: '1rem',
    borderRadius: '6px',
    marginBottom: '1.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  retryBtn: {
    backgroundColor: 'var(--stamp-red)',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  exportWrapper: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '2rem',
  },
  exportBtn: {
    backgroundColor: 'transparent',
    border: '1px solid var(--indigo)',
    color: 'var(--indigo)',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: '600',
  }
};