export default function SectionHeader({ label, title, action }) {
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'flex-end', 
      justifyContent: 'space-between', 
      marginBottom: 36, 
      paddingBottom: 20, 
      borderBottom: '1px solid var(--border)' 
    }}>
      <div>
        <div style={{ 
          fontSize: 11, 
          fontWeight: 700, 
          letterSpacing: '.1em', 
          textTransform: 'uppercase', 
          color: 'var(--accent)', 
          marginBottom: 6 
        }}>{label}</div>
        <h2 className="ff" style={{ 
          fontSize: 'clamp(24px,3vw,34px)', 
          fontWeight: 800, 
          color: 'var(--text)', 
          letterSpacing: '-.02em', 
          lineHeight: 1.1 
        }}>{title}</h2>
      </div>
      {action}
    </div>
  );
}
