import { useState, useEffect } from 'react';
import { apiFetch } from '../utils/api';

export default function DueToday({ onRevisionDone }) {
  const [dueTopics, setDueTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeConfidenceMenu, setActiveConfidenceMenu] = useState(null); // Tracks which topic is showing the Weak/Okay/Strong menu

  const fetchDueTopics = async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/topics/due');
      setDueTopics(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDueTopics();
  }, []);

  const handleRevise = async (id, stage, confidence) => {
    try {
      await apiFetch(`/topics/${id}/revise`, {
        method: 'PATCH',
        body: JSON.stringify({ stage, confidence }),
      });
      setActiveConfidenceMenu(null);
      fetchDueTopics(); // Refresh this list to remove the completed item
      if (onRevisionDone) onRevisionDone(); // Tell the Dashboard to update the stats
    } catch (err) {
      alert(`Failed to update: ${err.message}`);
    }
  };

  if (loading) return <div style={styles.loading}>Loading due items...</div>;
  if (error) return <div style={styles.error}>Error: {error}</div>;

  return (
    <section style={styles.section}>
      <h2 className="serif" style={styles.title}>Action Required</h2>
      
      {dueTopics.length === 0 ? (
        <div style={styles.emptyState}>
          <p>Nothing due today. Log today's topics below.</p>
        </div>
      ) : (
        <div style={styles.list}>
          {dueTopics.map((item) => (
            <div key={item.id} style={styles.card}>
              <div style={styles.cardHeader}>
                <span className="mono" style={styles.stageBadge}>Day {item.stage}</span>
                {item.overdueBy > 0 ? (
                  <span style={styles.overdueText}>{item.overdueBy} days overdue</span>
                ) : (
                  <span style={styles.dueTodayText}>Due today</span>
                )}
              </div>
              
              <h3 className="serif" style={styles.topicTitle}>{item.topic}</h3>
              <p style={styles.subject}>{item.subject} • {item.priority} priority</p>

              {activeConfidenceMenu === item.id ? (
                <div style={styles.confidenceMenu}>
                  <p style={styles.confidenceLabel}>How well did you remember this?</p>
                  <div style={styles.buttonGroup}>
                    <button onClick={() => handleRevise(item.id, item.stage, 'weak')} style={{...styles.confBtn, backgroundColor: '#FADBD8', color: 'var(--stamp-red)'}}>Weak</button>
                    <button onClick={() => handleRevise(item.id, item.stage, 'okay')} style={{...styles.confBtn, backgroundColor: '#FCF3CF', color: '#B7950B'}}>Okay</button>
                    <button onClick={() => handleRevise(item.id, item.stage, 'strong')} style={{...styles.confBtn, backgroundColor: '#D5F5E3', color: 'var(--stamp-green)'}}>Strong</button>
                  </div>
                </div>
              ) : (
                <button onClick={() => setActiveConfidenceMenu(item.id)} style={styles.reviseBtn}>
                  Mark Revised
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

const styles = {
  section: {
    marginBottom: '3rem',
  },
  title: {
    fontSize: '1.5rem',
    borderBottom: '1px solid var(--rule)',
    paddingBottom: '0.5rem',
    marginBottom: '1rem',
  },
  loading: {
    padding: '2rem',
    textAlign: 'center',
    color: 'var(--ink-soft)',
  },
  error: {
    color: 'var(--stamp-red)',
    padding: '1rem',
    backgroundColor: '#FADBD8',
    borderRadius: '4px',
  },
  emptyState: {
    padding: '2rem',
    textAlign: 'center',
    backgroundColor: 'var(--paper-2)',
    borderRadius: '8px',
    border: '1px dashed var(--rule)',
    color: 'var(--ink-soft)',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  card: {
    backgroundColor: 'var(--paper-2)',
    border: '1px solid var(--stamp-red)', // Red border because it requires action
    borderRadius: '8px',
    padding: '1.25rem',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5rem',
  },
  stageBadge: {
    backgroundColor: 'var(--stamp-red)',
    color: 'white',
    padding: '0.2rem 0.6rem',
    borderRadius: '12px',
    fontSize: '0.8rem',
    fontWeight: 'bold',
  },
  overdueText: {
    color: 'var(--stamp-red)',
    fontSize: '0.85rem',
    fontWeight: '600',
  },
  dueTodayText: {
    color: 'var(--ink-soft)',
    fontSize: '0.85rem',
  },
  topicTitle: {
    fontSize: '1.25rem',
    marginBottom: '0.2rem',
  },
  subject: {
    fontSize: '0.85rem',
    color: 'var(--ink-soft)',
    marginBottom: '1rem',
  },
  reviseBtn: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: 'transparent',
    border: '2px solid var(--stamp-red)',
    color: 'var(--stamp-red)',
    fontWeight: '600',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  confidenceMenu: {
    backgroundColor: 'var(--paper)',
    padding: '1rem',
    borderRadius: '4px',
    border: '1px solid var(--rule)',
  },
  confidenceLabel: {
    fontSize: '0.85rem',
    marginBottom: '0.5rem',
    textAlign: 'center',
    fontWeight: '600',
  },
  buttonGroup: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '0.5rem',
  },
  confBtn: {
    padding: '0.5rem',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '600',
  }
};