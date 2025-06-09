import React, { useEffect, useState } from 'react';

const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setVisible(window.scrollY > 100);
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      onClick={scrollToTop}
      style={{
        position: 'fixed',
        bottom: '2.5rem',
        right: '1.5rem', // Corregido: sin espacio extra
        width: '60px',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '30px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #18191a 0%, #232526 100%)',
        color: '#fff',
        border: 'none',
        boxShadow: '0 8px 24px rgba(40, 80, 200, 0.2), 0 1.5px 4px rgba(0,0,0,0.25)',
        cursor: 'pointer',
        zIndex: 1000,
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.3s, transform 0.2s',
        transform: visible ? 'scale(1)' : 'scale(0.8)',
      }}
      aria-label="Scroll to top"
      tabIndex={visible ? 0 : -1}
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="12" fill="rgba(255,255,255,0.08)" />
        <path d="M12 16V8M12 8L8 12M12 8L16 12" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  );
};

export default ScrollToTopButton;