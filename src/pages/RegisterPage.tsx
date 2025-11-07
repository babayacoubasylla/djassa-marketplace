import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Logo from '../components/Logo';

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'buyer' as 'buyer' | 'seller'
  });
  const [error, setError] = useState('');
  const { register, loading, user } = useAuth();

  // Redirection automatique si l'utilisateur est déjà connecté
  useEffect(() => {
    if (user) {
      window.location.href = '/';
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password || !formData.name) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    try {
      await register(formData);
      // La redirection se fera automatiquement via useEffect quand user changera
    } catch (err) {
      setError('Erreur lors de l\'inscription. Veuillez réessayer.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card fade-in">
        <div className="auth-header">
          <div className="flex items-center justify-center mb-4">
            <Logo size="large" showText={false} />
          </div>
          <h1 className="auth-title">Rejoignez Djassa</h1>
          <p className="auth-subtitle">Créez votre compte et découvrez le meilleur de la Côte d'Ivoire</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-group">
            <label className="form-label">
              👤 Nom complet
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Entrez votre nom complet"
              className="form-input"
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              📧 Adresse email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="votre@email.com"
              className="form-input"
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              🔐 Mot de passe
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Créez un mot de passe sécurisé"
              className="form-input"
              disabled={loading}
              required
              minLength={6}
            />
            <p className="text-xs text-text-muted mt-1">
              Minimum 6 caractères
            </p>
          </div>

          <div className="form-group">
            <label className="form-label">
              🎭 Type de compte
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className={`cursor-pointer p-4 border-2 rounded-lg transition-all ${
                formData.role === 'buyer' 
                  ? 'border-primary bg-primary/5 text-primary' 
                  : 'border-border-color hover:border-primary/50'
              }`}>
                <input
                  type="radio"
                  name="role"
                  value="buyer"
                  checked={formData.role === 'buyer'}
                  onChange={handleChange}
                  className="sr-only"
                  disabled={loading}
                />
                <div className="text-center">
                  <div className="text-2xl mb-2">🛍️</div>
                  <div className="font-medium">Acheteur</div>
                  <div className="text-xs text-text-muted mt-1">
                    Explorez et achetez
                  </div>
                </div>
              </label>

              <label className={`cursor-pointer p-4 border-2 rounded-lg transition-all ${
                formData.role === 'seller' 
                  ? 'border-primary bg-primary/5 text-primary' 
                  : 'border-border-color hover:border-primary/50'
              }`}>
                <input
                  type="radio"
                  name="role"
                  value="seller"
                  checked={formData.role === 'seller'}
                  onChange={handleChange}
                  className="sr-only"
                  disabled={loading}
                />
                <div className="text-center">
                  <div className="text-2xl mb-2">🏪</div>
                  <div className="font-medium">Vendeur</div>
                  <div className="text-xs text-text-muted mt-1">
                    Vendez vos produits
                  </div>
                </div>
              </label>
            </div>
          </div>

          {error && (
            <div className="bg-error/10 border border-error/20 text-error px-4 py-3 rounded-lg text-sm">
              <div className="flex items-center gap-2">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            </div>
          )}

          <button
            type="submit"
            className={`btn btn-primary btn-lg btn-full ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="loading-spinner"></div>
                <span>Création du compte...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span>✨</span>
                <span>Créer mon compte</span>
              </div>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <div className="text-text-muted mb-4">
            <div className="flex items-center">
              <div className="flex-1 h-px bg-border-color"></div>
              <span className="px-4 text-sm">Déjà un compte ?</span>
              <div className="flex-1 h-px bg-border-color"></div>
            </div>
          </div>
          <a 
            href="/login" 
            className="btn btn-outline btn-lg btn-full"
          >
            <div className="flex items-center gap-2">
              <span>🚀</span>
              <span>Se connecter</span>
            </div>
          </a>
        </div>

        <div className="mt-6 text-center">
          <a href="/" className="text-primary hover:text-primary-dark text-sm font-medium">
            ← Retour à l'accueil
          </a>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;