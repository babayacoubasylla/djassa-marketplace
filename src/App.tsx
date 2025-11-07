import { useState, useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { CompareProvider } from './contexts/CompareContext';
import Navigation from './components/Navigation';
import MobileNavigation from './components/MobileNavigation';
import Footer from './components/Footer';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import NotificationSystem from './components/NotificationSystem';
import CustomerPage from './pages/CustomerPage';
import RegisterPage from './pages/RegisterPage';
import ExplorePage from './pages/ExplorePage';
import ServicesPage from './pages/ServicesPage';
import ComparePage from './pages/ComparePage';
import VendorPage from './pages/VendorPage';
import LocationPage from './pages/LocationPage';
import AdminPage from './pages/AdminPage';
import DeliveryPage from './pages/DeliveryPage';
import DeliveryPersonPage from './pages/DeliveryPersonPage';
import OrdersPage from './pages/OrdersPage';
import './styles/global.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  // Navigation function that updates the state
  const navigate = (page: string) => {
    console.log('Navigating to:', page);
    setCurrentPage(page);
  };

  // Make navigate function available globally
  useEffect(() => {
    console.log('🚀 App: Configuration navigation globale');
    (window as any).navigate = navigate;
    
    // Add click handlers for navigation links
    const handleNavClick = (e: Event) => {
      const target = e.target as HTMLElement;
      console.log('🔗 Click detecté sur:', target.tagName, target.className);
      
      // Chercher l'élément avec data-nav dans la hiérarchie
      let currentElement = target;
      while (currentElement && currentElement !== document.body) {
        if (currentElement.hasAttribute && currentElement.hasAttribute('data-nav')) {
          e.preventDefault();
          e.stopPropagation();
          const page = currentElement.getAttribute('data-nav') || 'home';
          console.log('🎯 Navigation vers:', page);
          navigate(page);
          return;
        }
        currentElement = currentElement.parentElement!;
      }
      
      // Backup: check for onclick or href
      if (target.tagName === 'A' || target.tagName === 'BUTTON') {
        console.log('🔍 Élément navigation trouvé:', target.outerHTML.substring(0, 100));
      }
    };

    document.addEventListener('click', handleNavClick, true);
    
    // Test de la fonction navigate globale
    setTimeout(() => {
      console.log('🧪 Test fonction navigate globale:', typeof (window as any).navigate);
    }, 1000);
    
    return () => {
      document.removeEventListener('click', handleNavClick, true);
    };
  }, []);

  const renderPage = () => {
    console.log('Rendu de la page:', currentPage);
    switch (currentPage) {
      case 'home': 
        return <CustomerPage />;
      case 'explore': 
        return <ExplorePage />;
      case 'services': 
        return <ServicesPage />;
      case 'delivery': 
        return <DeliveryPage />;
      case 'orders': 
        return <OrdersPage />;
      case 'compare': 
        return <ComparePage />;
      case 'vendor': 
        return <VendorPage />;
      case 'location': 
        return <LocationPage />;
      case 'admin': 
        return <AdminPage />;
      case 'delivery-person': 
        return <DeliveryPersonPage />;
      case 'register': 
        return <RegisterPage />;
      default: 
        return <CustomerPage />;
    }
  };

  return (
    <AuthProvider>
      <CompareProvider>
        <NotificationSystem>
          <div className="App">
            <Navigation currentPage={currentPage} />
            <main className="main-content">
              {renderPage()}
            </main>
            <MobileNavigation currentPage={currentPage} />
            <Footer />
            <PWAInstallPrompt />
          </div>
        </NotificationSystem>
      </CompareProvider>
    </AuthProvider>
  );
}

export default App
