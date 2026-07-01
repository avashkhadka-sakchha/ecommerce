export default function Wrap({ children, style = {} }) {
  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 28px', ...style }}>
      {children}
    </div>
  );
}
