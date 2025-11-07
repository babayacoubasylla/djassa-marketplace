import React from 'react';
import logoImage from '../assets/dj1.png';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ 
  size = 'medium', 
  showText = true,
  className = '' 
}) => {
  return (
    <div className={`djassa-logo djassa-logo-${size} ${className}`}>
      <img 
        src={logoImage} 
        alt="Djassa Logo" 
        className="djassa-logo-image"
      />
      {showText && (
        <span className="djassa-logo-text">DJASSA</span>
      )}
    </div>
  );
};

export default Logo;