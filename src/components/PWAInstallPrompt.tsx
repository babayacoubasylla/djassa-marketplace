import React, { useEffect, useState } from 'react';

interface PWAInstallProps {
  onInstall?: () => void;
}

const PWAInstallPrompt: React.FC<PWAInstallProps> = ({ onInstall }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Détecter iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Détecter si déjà installé
    const standalone = window.matchMedia('(display-mode: standalone)').matches || 
                      (window.navigator as any).standalone;
    setIsStandalone(standalone);

    // Écouter l'événement beforeinstallprompt
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('App installée avec succès');
        onInstall?.();
      }
      
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Réafficher dans 24h
    localStorage.setItem('djassa-install-dismissed', Date.now().toString());
  };

  // Ne pas afficher si déjà installé ou récemment refusé
  if (isStandalone) return null;
  
  const lastDismissed = localStorage.getItem('djassa-install-dismissed');
  if (lastDismissed && Date.now() - parseInt(lastDismissed) < 24 * 60 * 60 * 1000) {
    return null;
  }

  if (isIOS && !isStandalone) {
    return (
      <div className="fixed bottom-4 left-4 right-4 bg-primary text-white p-4 rounded-lg shadow-lg z-50 animate-fade-in">
        <div className="flex items-start gap-3">
          <div className="text-2xl">📱</div>
          <div className="flex-1">
            <h3 className="font-semibold mb-1">Installer Djassa</h3>
            <p className="text-sm opacity-90 mb-3">
              Pour installer cette app: touchez <span className="font-semibold">⋯</span> puis 
              <span className="font-semibold"> "Ajouter à l'écran d'accueil"</span>
            </p>
            <div className="flex gap-2">
              <button 
                onClick={handleDismiss}
                className="btn btn-outline btn-sm"
                style={{ color: 'white', borderColor: 'white' }}
              >
                Plus tard
              </button>
            </div>
          </div>
          <button 
            onClick={handleDismiss}
            className="text-white opacity-70 hover:opacity-100"
          >
            ✕
          </button>
        </div>
      </div>
    );
  }

  if (showPrompt && deferredPrompt) {
    return (
      <div className="fixed bottom-4 left-4 right-4 bg-primary text-white p-4 rounded-lg shadow-lg z-50 animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="text-2xl">📱</div>
          <div className="flex-1">
            <h3 className="font-semibold mb-1">Installer Djassa</h3>
            <p className="text-sm opacity-90 mb-3">
              Accédez plus rapidement à tous vos services favoris
            </p>
          </div>
        </div>
        <div className="flex gap-2 mt-2">
          <button 
            onClick={handleInstall}
            className="btn btn-secondary btn-sm flex-1"
          >
            📱 Installer
          </button>
          <button 
            onClick={handleDismiss}
            className="btn btn-outline btn-sm"
            style={{ color: 'white', borderColor: 'white' }}
          >
            Plus tard
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default PWAInstallPrompt;