import React from 'react';
import logoImage from '../assets/dj1.png';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium', 
  text = 'Chargement...' 
}) => {
  return (
    <div className={`loading-container loading-${size}`}>
      <div className="loading-content">
        <div className="loading-logo-container">
          <img 
            src={logoImage} 
            alt="Djassa Logo" 
            className="loading-logo"
          />
          <div className="loading-spinner-ring"></div>
        </div>
        <p className="loading-text">{text}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;