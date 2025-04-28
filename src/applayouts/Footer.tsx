import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="app-footer">
      <p className="app-footer-text">
        &copy; {new Date().getFullYear()} Jadamal Mahendra. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer; 