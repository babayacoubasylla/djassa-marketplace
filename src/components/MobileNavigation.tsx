import React from 'react';
import { useAuth } from '../contexts/AuthContext';

interface MobileNavigationProps {
  currentPage?: string;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({ currentPage }) => {
  const { user } = useAuth();

  // Navigation helper
  const navigateTo = (page: string) => {
    console.log('📱 MobileNavigation: navigateTo appelée pour', page);
    if (typeof (window as any).navigate === 'function') {
      (window as any).navigate(page);
    } else {
      console.error('❌ Fonction navigate non disponible');
    }
  };

  // Navigation différente selon le type d'utilisateur
  if (user?.role === 'seller') {
    return (
      <nav className="bottom-nav">
        <a 
          href="#" 
          data-nav="vendor"
          onClick={(e) => { e.preventDefault(); navigateTo('vendor'); }}
          className={`bottom-nav-item ${currentPage === 'vendor' ? 'active' : ''}`}
        >
          <div className="bottom-nav-icon">🏪</div>
          <span>Ma Boutique</span>
        </a>
        
        <a 
          href="#" 
          data-nav="orders"
          onClick={(e) => { e.preventDefault(); navigateTo('orders'); }}
          className={`bottom-nav-item ${currentPage === 'orders' ? 'active' : ''}`}
        >
          <div className="bottom-nav-icon">📦</div>
          <span>Commandes</span>
        </a>
        
        <a 
          href="#" 
          data-nav="explore"
          onClick={(e) => { e.preventDefault(); navigateTo('explore'); }}
          className={`bottom-nav-item ${currentPage === 'explore' ? 'active' : ''}`}
        >
          <div className="bottom-nav-icon">🔍</div>
          <span>Explorer</span>
        </a>
        
        <a 
          href="#" 
          data-nav="services"
          onClick={(e) => { e.preventDefault(); navigateTo('services'); }}
          className={`bottom-nav-item ${currentPage === 'services' ? 'active' : ''}`}
        >
          <div className="bottom-nav-icon">🏢</div>
          <span>Services</span>
        </a>
        
        <a 
          href="#" 
          data-nav="home"
          onClick={(e) => { e.preventDefault(); navigateTo('home'); }}
          className={`bottom-nav-item ${currentPage === 'home' ? 'active' : ''}`}
        >
          <div className="bottom-nav-icon">⚙️</div>
          <span>Plus</span>
        </a>
      </nav>
    );
  }
  
  if (user?.role === 'admin') {
    return (
      <nav className="bottom-nav">
        <a 
          href="#" 
          data-nav="admin"
          onClick={(e) => { e.preventDefault(); navigateTo('admin'); }}
          className={`bottom-nav-item ${currentPage === 'admin' ? 'active' : ''}`}
        >
          <div className="bottom-nav-icon">🔧</div>
          <span>Admin</span>
        </a>
        
        <a 
          href="#" 
          data-nav="explore"
          onClick={(e) => { e.preventDefault(); navigateTo('explore'); }}
          className={`bottom-nav-item ${currentPage === 'explore' ? 'active' : ''}`}
        >
          <div className="bottom-nav-icon">📊</div>
          <span>Données</span>
        </a>
        
        <a 
          href="#" 
          data-nav="orders"
          onClick={(e) => { e.preventDefault(); navigateTo('orders'); }}
          className={`bottom-nav-item ${currentPage === 'orders' ? 'active' : ''}`}
        >
          <div className="bottom-nav-icon">📋</div>
          <span>Commandes</span>
        </a>
        
        <a 
          href="#" 
          data-nav="services"
          onClick={(e) => { e.preventDefault(); navigateTo('services'); }}
          className={`bottom-nav-item ${currentPage === 'services' ? 'active' : ''}`}
        >
          <div className="bottom-nav-icon">🏢</div>
          <span>Services</span>
        </a>
        
        <a 
          href="#" 
          data-nav="home"
          onClick={(e) => { e.preventDefault(); navigateTo('home'); }}
          className={`bottom-nav-item ${currentPage === 'home' ? 'active' : ''}`}
        >
          <div className="bottom-nav-icon">🏠</div>
          <span>Accueil</span>
        </a>
      </nav>
    );
  }

  // Navigation pour clients et livreurs
  return (
    <nav className="bottom-nav">
      <a 
        href="#" 
        data-nav="home"
        onClick={(e) => { e.preventDefault(); navigateTo('home'); }}
        className={`bottom-nav-item ${currentPage === 'home' ? 'active' : ''}`}
      >
        <div className="bottom-nav-icon">🏠</div>
        <span>Accueil</span>
      </a>
      
      <a 
        href="#" 
        data-nav="explore"
        onClick={(e) => { e.preventDefault(); navigateTo('explore'); }}
        className={`bottom-nav-item ${currentPage === 'explore' ? 'active' : ''}`}
      >
        <div className="bottom-nav-icon">🛍️</div>
        <span>Explorer</span>
      </a>
      
      <a 
        href="#" 
        data-nav="delivery"
        onClick={(e) => { e.preventDefault(); navigateTo('delivery'); }}
        className={`bottom-nav-item ${currentPage === 'delivery' ? 'active' : ''}`}
      >
        <div className="bottom-nav-icon">🍽️</div>
        <span>Livraison</span>
      </a>
      
      {user && (
        <a 
          href="#" 
          data-nav="orders"
          onClick={(e) => { e.preventDefault(); navigateTo('orders'); }}
          className={`bottom-nav-item ${currentPage === 'orders' ? 'active' : ''}`}
        >
          <div className="bottom-nav-icon">📦</div>
          <span>Commandes</span>
        </a>
      )}
      
      <a 
        href="#" 
        data-nav="services"
        onClick={(e) => { e.preventDefault(); navigateTo('services'); }}
        className={`bottom-nav-item ${currentPage === 'services' ? 'active' : ''}`}
      >
        <div className="bottom-nav-icon">🏢</div>
        <span>Services</span>
      </a>
    </nav>
  );
};

export default MobileNavigation;