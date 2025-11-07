import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="grid grid-cols-4 mb-8">
            {/* À propos */}
            <div>
              <h3 className="font-semibold mb-4 text-primary">À propos de Djassa</h3>
              <ul className="space-y-2">
                <li><a href="/about" className="text-muted hover:text-primary">Notre histoire</a></li>
                <li><a href="/mission" className="text-muted hover:text-primary">Notre mission</a></li>
                <li><a href="/team" className="text-muted hover:text-primary">Notre équipe</a></li>
                <li><a href="/careers" className="text-muted hover:text-primary">Carrières</a></li>
              </ul>
            </div>

            {/* Acheteurs */}
            <div>
              <h3 className="font-semibold mb-4 text-primary">Pour les Acheteurs</h3>
              <ul className="space-y-2">
                <li><a href="/explore" className="text-muted hover:text-primary">Explorer les produits</a></li>
                <li><a href="/compare" className="text-muted hover:text-primary">Comparer les prix</a></li>
                <li><a href="/location" className="text-muted hover:text-primary">Près de moi</a></li>
                <li><a href="/help" className="text-muted hover:text-primary">Centre d'aide</a></li>
              </ul>
            </div>

            {/* Vendeurs */}
            <div>
              <h3 className="font-semibold mb-4 text-primary">Pour les Vendeurs</h3>
              <ul className="space-y-2">
                <li><a href="/register?type=seller" className="text-muted hover:text-primary">Devenir vendeur</a></li>
                <li><a href="/vendor" className="text-muted hover:text-primary">Gérer ma boutique</a></li>
                <li><a href="/seller-guide" className="text-muted hover:text-primary">Guide vendeur</a></li>
                <li><a href="/fees" className="text-muted hover:text-primary">Tarifs</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="font-semibold mb-4 text-primary">Support</h3>
              <ul className="space-y-2">
                <li><a href="/contact" className="text-muted hover:text-primary">Nous contacter</a></li>
                <li><a href="/faq" className="text-muted hover:text-primary">FAQ</a></li>
                <li><a href="/terms" className="text-muted hover:text-primary">Conditions d'utilisation</a></li>
                <li><a href="/privacy" className="text-muted hover:text-primary">Politique de confidentialité</a></li>
              </ul>
            </div>
          </div>

          {/* Contact Info */}
          <div className="border-t pt-6 mb-6">
            <div className="grid grid-cols-3 text-center">
              <div>
                <div className="text-2xl mb-2">📞</div>
                <p className="font-semibold">Service Client</p>
                <p className="text-muted">+225 07 09 37 82 25</p>
              </div>
              <div>
                <div className="text-2xl mb-2">📧</div>
                <p className="font-semibold">Email</p>
                <p className="text-muted">contact@djassa.ci</p>
              </div>
              <div>
                <div className="text-2xl mb-2">📍</div>
                <p className="font-semibold">Adresse</p>
                <p className="text-muted">Abidjan, Côte d'Ivoire</p>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t pt-6 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="font-bold text-primary">DJASSA</span>
              <span className="text-muted">© {currentYear} Tous droits réservés</span>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-muted">Suivez-nous :</span>
              <div className="flex gap-2">
                <a href="#" className="btn btn-ghost btn-sm">📘 Facebook</a>
                <a href="#" className="btn btn-ghost btn-sm">� Instagram</a>
                <a href="#" className="btn btn-ghost btn-sm">🐦 Twitter</a>
                <a href="#" className="btn btn-ghost btn-sm">� LinkedIn</a>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="border-t pt-6 text-center">
            <p className="text-muted mb-4">Méthodes de paiement acceptées :</p>
            <div className="flex justify-center items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🧡</span>
                <span className="font-medium">Orange Money</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">💛</span>
                <span className="font-medium">MTN Money</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🔴</span>
                <span className="font-medium">Moov Money</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">💳</span>
                <span className="font-medium">Cartes Bancaires</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;