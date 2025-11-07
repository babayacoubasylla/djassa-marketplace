import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import Logo from './Logo';

interface NavigationProps {
  currentPage?: string;
}

const Navigation: React.FC<NavigationProps> = ({ currentPage }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  // Navigation helper
  const navigateTo = (page: string) => {
    console.log('🔗 Navigation.tsx: navigateTo appelée pour', page);
    if (typeof (window as any).navigate === 'function') {
      (window as any).navigate(page);
    } else {
      console.error('❌ Fonction navigate non disponible');
    }
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <div className="navbar-brand">
            <a href="/" title="Djassa - Accueil">
              <Logo size="medium" />
            </a>
          </div>

          <ul className="navbar-nav">
            <li>
              <a 
                href="#" 
                data-nav="home"
                onClick={(e) => { e.preventDefault(); navigateTo('home'); }}
                className={`navbar-link ${currentPage === 'home' ? 'active' : ''}`}
              >
                🏠 Accueil
              </a>
            </li>
            
            <li>
              <a 
                href="#" 
                data-nav="explore"
                onClick={(e) => { e.preventDefault(); navigateTo('explore'); }}
                className={`navbar-link ${currentPage === 'explore' ? 'active' : ''}`}
              >
                🛍️ Explorer
              </a>
            </li>
            
            <li>
              <a 
                href="#" 
                data-nav="services"
                onClick={(e) => { e.preventDefault(); navigateTo('services'); }}
                className={`navbar-link ${currentPage === 'services' ? 'active' : ''}`}
              >
                🏢 Services
              </a>
            </li>
            
            <li>
              <a 
                href="#" 
                data-nav="delivery"
                onClick={(e) => { e.preventDefault(); navigateTo('delivery'); }}
                className={`navbar-link ${currentPage === 'delivery' ? 'active' : ''}`}
              >
                🍽️ Livraison
              </a>
            </li>
            
            {user && (
              <li>
                <a 
                  href="#" 
                  data-nav="orders"
                  onClick={(e) => { e.preventDefault(); navigateTo('orders'); }}
                  className={`navbar-link ${currentPage === 'orders' ? 'active' : ''}`}
                >
                  📦 Mes Commandes
                </a>
              </li>
            )}
            
            <li>
              <a 
                href="#" 
                data-nav="compare"
                onClick={(e) => { e.preventDefault(); navigateTo('compare'); }}
                className={`navbar-link ${currentPage === 'compare' ? 'active' : ''}`}
              >
                ⚖️ Comparer
              </a>
            </li>

            {user?.role === 'admin' && (
              <li>
                <a 
                  href="#" 
                  data-nav="admin"
                  onClick={(e) => { e.preventDefault(); navigateTo('admin'); }}
                  className={`navbar-link ${currentPage === 'admin' ? 'active' : ''}`}
                >
                  🔧 Admin
                </a>
              </li>
            )}
            
            <li>
              <a 
                href="#" 
                data-nav="location"
                onClick={(e) => { e.preventDefault(); navigateTo('location'); }}
                className={`navbar-link ${currentPage === 'location' ? 'active' : ''}`}
              >
                📍 Près de moi
              </a>
            </li>
            
            {user?.role === 'seller' && (
              <li>
                <a 
                  href="#" 
                  data-nav="vendor"
                  onClick={(e) => { e.preventDefault(); navigateTo('vendor'); }}
                  className={`navbar-link ${currentPage === 'vendor' ? 'active' : ''}`}
                >
                  🏪 Ma Boutique
                </a>
              </li>
            )}

            {user ? (
              <li className="flex items-center gap-4">
                <span className="text-primary font-medium">
                  👤 {user.name} ({user.role === 'buyer' ? '🛍️ Acheteur' : '🏪 Vendeur'})
                </span>
                <button onClick={handleLogout} className="btn btn-outline btn-sm">
                  🚪 Déconnexion
                </button>
              </li>
            ) : (
              <>
                <li>
                  <a 
                    href="#" 
                    data-nav="home"
                    onClick={(e) => { e.preventDefault(); navigateTo('home'); }}
                    className="navbar-link"
                  >
                    🔑 Connexion
                  </a>
                </li>
                <li>
                  <a 
                    href="#" 
                    data-nav="register"
                    onClick={(e) => { e.preventDefault(); navigateTo('register'); }}
                    className="btn btn-primary btn-sm"
                  >
                    ✨ Inscription
                  </a>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;