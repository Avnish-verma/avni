import { useState, useEffect } from 'react';
import { apiFetch } from '../utils/api';
import { getTodayStr } from '../utils/dates';

export default function TopicList({ subjects }) {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Filters
  const [search, setSearch] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [showArchived, setShowArchived] = useState(false);

  const fetchTopics = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (search) queryParams.append('search', search);
      if (subjectFilter) queryParams.append('subject', subjectFilter);
      if (priorityFilter) queryParams.append('priority', priorityFilter);
      queryParams.append('status', showArchived ? 'all' : 'active');

      const data = await apiFetch(`/topics?${queryParams.toString()}`);
      setTopics(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch whenever a filter changes
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchTopics();
    }, 300); // 300ms debounce for the search bar
    return () => clearTimeout(delayDebounceFn);
  }, [search, subjectFilter, priorityFilter, showArchived]);

  const handleArchive = async (id) => {
    try {
      await apiFetch(`/topics/${id}/archive`, { method: 'PATCH' });
      fetchTopics();
    } catch (err) {
      alert(`Archive failed: ${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this topic?")) return;
    try {
      await apiFetch(`/topics/${id}`, { method: 'DELETE' });
      fetchTopics();
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  const today = getTodayStr();

  // Helper to determine the stamp style based on the 1-4-7 rule rules
  const getStampStyle = (isDone, dueDate) => {
    if (isDone) return styles.stampDone;
    if (dueDate <= today) return styles.stampDue;
    return styles.stampFuture;
  };

  return (
    <section style={styles.section}>
      <div style={styles.headerRow}>
        <h2 className="serif" style={styles.title}>Full Ledger</h2>
        
        {/* Filters */}
        <div style={styles.filters}>
          <input 
            type="text" 
            placeholder="Search topics..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)}
            style={styles.input}
          />
          <select value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)} style={styles.input}>
            <option value="">All Subjects</option>
            {subjects.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} style={styles.input}>
            <option value="">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <label style={styles.checkboxLabel}>
            <input 
              type="checkbox" 
              checked={showArchived} 
              onChange={(e) => setShowArchived(e.target.checked)} 
            /> Show Archived
          </label>
        </div>
      </div>

      {loading ? (
        <div style={styles.message}>Loading ledger...</div>
      ) : topics.length === 0 ? (
        <div style={styles.message}>No topics match these filters.</div>
      ) : (
        <div style={styles.list}>
          {topics.map(topic => (
            <div key={topic._id || topic.id} style={{...styles.card, opacity: topic.status === 'archived' ? 0.6 : 1}}>
              <div style={styles.cardMain}>
                <span className="mono" style={styles.subjectBadge}>{topic.subject}</span>
                <h3 className="serif" style={styles.topicTitle}>{topic.topic}</h3>
                {topic.notes && <p style={styles.notes}>{topic.notes}</p>}
                <div style={styles.metaRow}>
                  <span className="mono">Logged: {topic.dateAdded}</span>
                  <span>Priority: {topic.priority}</span>
                </div>
              </div>

              <div style={styles.cardRight}>
                {/* 1-4-7 Stamps */}
                <div style={styles.stampTrack}>
                  <div style={{...styles.stamp, ...styles.stampDone}}>1</div>
                  <div style={styles.stampLine} />
                  <div style={{...styles.stamp, ...getStampStyle(topic.day4Done, topic.day4Date)}}>4</div>
                  <div style={styles.stampLine} />
                  <div style={{...styles.stamp, ...getStampStyle(topic.day7Done, topic.day7Date)}}>7</div>
                </div>

                <div style={styles.actions}>
                  <button onClick={() => handleArchive(topic._id || topic.id)} style={styles.actionBtn}>
                    {topic.status === 'active' ? 'Archive' : 'Unarchive'}
                  </button>
                  <button onClick={() => handleDelete(topic._id || topic.id)} style={{...styles.actionBtn, color: 'var(--stamp-red)'}}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

const styles = {
  section: {
    marginTop: '3rem',
  },
  headerRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  title: {
    fontSize: '1.5rem',
    borderBottom: '1px solid var(--rule)',
    paddingBottom: '0.5rem',
  },
  filters: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.75rem',
    alignItems: 'center',
  },
  input: {
    padding: '0.5rem',
    border: '1px solid var(--rule)',
    borderRadius: '4px',
    backgroundColor: 'var(--paper)',
    fontSize: '0.9rem',
  },
  checkboxLabel: {
    fontSize: '0.9rem',
    color: 'var(--ink-soft)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
  },
  message: {
    padding: '2rem',
    textAlign: 'center',
    color: 'var(--ink-soft)',
    border: '1px dashed var(--rule)',
    borderRadius: '8px',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  card: {
    backgroundColor: 'var(--paper-2)',
    border: '1px solid var(--rule)',
    borderRadius: '8px',
    padding: '1.25rem',
    display: 'flex',
    justifyContent: 'space-between',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  cardMain: {
    flex: '1 1 300px',
  },
  subjectBadge: {
    backgroundColor: 'var(--rule)',
    padding: '0.2rem 0.5rem',
    borderRadius: '4px',
    fontSize: '0.75rem',
    textTransform: 'uppercase',
  },
  topicTitle: {
    fontSize: '1.25rem',
    margin: '0.5rem 0',
  },
  notes: {
    fontSize: '0.9rem',
    color: 'var(--ink-soft)',
    marginBottom: '0.75rem',
    fontStyle: 'italic',
  },
  metaRow: {
    display: 'flex',
    gap: '1rem',
    fontSize: '0.8rem',
    color: 'var(--ink-soft)',
  },
  cardRight: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    minWidth: '150px',
  },
  stampTrack: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  stamp: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'bold',
    fontFamily: 'IBM Plex Mono, monospace',
    fontSize: '0.9rem',
  },
  stampDone: {
    backgroundColor: 'var(--stamp-green)',
    color: 'white',
    border: '2px solid var(--stamp-green)',
  },
  stampDue: {
    backgroundColor: 'transparent',
    color: 'var(--stamp-red)',
    border: '2px solid var(--stamp-red)',
  },
  stampFuture: {
    backgroundColor: 'transparent',
    color: 'var(--ink-soft)',
    border: '2px dashed var(--rule-soft)',
  },
  stampLine: {
    width: '20px',
    height: '2px',
    backgroundColor: 'var(--rule)',
  },
  actions: {
    display: 'flex',
    gap: '0.5rem',
  },
  actionBtn: {
    background: 'transparent',
    border: '1px solid var(--rule)',
    padding: '0.3rem 0.6rem',
    borderRadius: '4px',
    fontSize: '0.8rem',
    cursor: 'pointer',
    color: 'var(--ink-soft)',
  }
};