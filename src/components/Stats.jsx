export default function Stats({ data, loading }) {
  if (loading) {
    return <div className="mono" style={styles.loading}>Loading ledger stats...</div>;
  }

  if (!data) return null;

  return (
    <div style={styles.wrapper}>
      {/* 4-Block Stats Strip */}
      <div style={styles.strip}>
        <StatBlock label="Topics Logged" value={data.totalTopics} />
        <StatBlock label="Due Today" value={data.dueToday} highlight={data.dueToday > 0} />
        <StatBlock label="Revisions Done" value={data.revisionsCompletedTotal} />
        <StatBlock label="Current Streak" value={data.currentStreak ? `${data.currentStreak} days` : 'None'} />
      </div>

      {/* Weekly Insight Card */}
      <div style={styles.insightCard}>
        <p><strong>{data.revisionsCompletedThisWeek}</strong> revisions completed this week.</p>
        {/* Only render this line if the backend found a neglected subject */}
        {data.mostNeglectedSubject && (
          <p>Most neglected subject: <strong>{data.mostNeglectedSubject}</strong></p>
        )}
      </div>
    </div>
  );
}

// A tiny helper component just for the individual stat squares
function StatBlock({ label, value, highlight }) {
  return (
    <div style={{...styles.block, borderColor: highlight ? 'var(--stamp-red)' : 'var(--rule)'}}>
      <div className="mono" style={{...styles.value, color: highlight ? 'var(--stamp-red)' : 'var(--ink)'}}>
        {value}
      </div>
      <div style={styles.label}>{label}</div>
    </div>
  );
}

const styles = {
  wrapper: {
    marginBottom: '2.5rem',
  },
  loading: {
    padding: '2rem',
    textAlign: 'center',
    color: 'var(--ink-soft)',
    border: '1px dashed var(--rule)',
    borderRadius: '8px',
  },
  strip: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '1rem',
    marginBottom: '1rem',
  },
  block: {
    backgroundColor: 'var(--paper-2)',
    padding: '1.25rem',
    borderRadius: '6px',
    border: '1px solid var(--rule)',
    textAlign: 'center',
  },
  value: {
    fontSize: '1.75rem',
    fontWeight: '600',
    marginBottom: '0.25rem',
  },
  label: {
    fontSize: '0.8rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    color: 'var(--ink-soft)',
  },
  insightCard: {
    backgroundColor: 'var(--paper-2)',
    padding: '1rem 1.5rem',
    borderRadius: '6px',
    borderLeft: '4px solid var(--indigo)',
    fontSize: '0.95rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  }
};