export function NameDisplay() {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <div
      style={{
        position: 'fixed',
        top: '2rem',
        left: isMobile ? '50%' : '2rem',
        transform: isMobile ? 'translateX(-50%)' : 'none',
        zIndex: 15,
        textAlign: isMobile ? 'center' : 'left',
      }}
    >
      <h1
        style={{
          fontSize: isMobile ? '1.5rem' : '2.5rem',
          fontWeight: '700',
          color: '#1e3a8a',
          margin: 0,
          letterSpacing: '-0.025em',
        }}
      >
        Gaaurav Lath
      </h1>
      <p
        style={{
          fontSize: isMobile ? '0.75rem' : '0.875rem',
          color: '#3559c8',
          margin: '0.25rem 0 0 0',
          fontWeight: '500',
        }}
      >
        Data Scientist
      </p>
    </div>
  );
}
