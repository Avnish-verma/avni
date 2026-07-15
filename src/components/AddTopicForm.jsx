import { useState, useEffect } from 'react';
import { apiFetch } from '../utils/api';

export default function AddTopicForm({ onTopicAdded }) {
  const [subjects, setSubjects] = useState([]);
  
  // Form Fields
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [notes, setNotes] = useState('');
  const [priority, setPriority] = useState('medium');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch unique subjects so we can populate the dropdown datalist
    apiFetch('/subjects')
      .then(data => setSubjects(data))
      .catch(err => console.error("Could not load subjects", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !topic.trim()) {
      setError("Subject and Topic are required.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await apiFetch('/topics', {
        method: 'POST',
        body: JSON.stringify({ subject, topic, notes, priority }),
      });
      
      // Clear form on success
      setSubject('');
      setTopic('');
      setNotes('');
      setPriority('medium');
      
      if (onTopicAdded) onTopicAdded(); // Tell dashboard to update
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section style={styles.section}>
      <h2 className="serif" style={styles.title}>Log New Topic</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        
        <div style={styles.inputGroup}>
          <label style={styles.label}>Subject</label>
          <input
            type="text"
            list="subject-list"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g. Data Structures"
            style={styles.input}
          />
          <datalist id="subject-list">
            {subjects.map(s => <option key={s} value={s} />)}
          </datalist>
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Topic Title</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Binary Trees"
            style={styles.input}
          />
        </div>

        <div style={styles.row}>
          <div style={{...styles.inputGroup, flex: 2}}>
            <label style={styles.label}>Notes (Optional)</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Links or small notes"
              style={styles.input}
            />
          </div>

          <div style={{...styles.inputGroup, flex: 1}}>
            <label style={styles.label}>Priority</label>
            <select value={priority} onChange={(e) => setPriority(e.target.value)} style={styles.input}>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        {error && <p style={styles.error}>{error}</p>}

        <button type="submit" disabled={isLoading} style={styles.button}>
          {isLoading ? 'Saving...' : '+ Log Topic for Today'}
        </button>
      </form>
    </section>
  );
}

const styles = {
  section: {
    marginBottom: '3rem',
    backgroundColor: 'var(--paper-2)',
    padding: '1.5rem',
    borderRadius: '8px',
    border: '1px solid var(--rule)',
  },
  title: {
    fontSize: '1.25rem',
    marginBottom: '1rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  row: {
    display: 'flex',
    gap: '1rem',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
  },
  label: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: 'var(--ink-soft)',
  },
  input: {
    padding: '0.75rem',
    border: '1px solid var(--rule)',
    borderRadius: '4px',
    backgroundColor: 'var(--paper)',
    outline: 'none',
  },
  button: {
    padding: '0.8rem',
    backgroundColor: 'var(--indigo)',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '600',
    marginTop: '0.5rem',
  },
  error: {
    color: 'var(--stamp-red)',
    fontSize: '0.85rem',
    margin: 0,
  }
};