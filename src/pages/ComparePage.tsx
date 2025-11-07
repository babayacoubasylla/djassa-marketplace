import React from 'react';
import { useCompare } from '../contexts/CompareContext';

const ComparePage: React.FC = () => {
  const { compareList, removeFromCompare, clearCompare } = useCompare();

  if (compareList.length === 0) {
    return (
      <div className="compare-empty">
        <div className="compare-empty-content">
          <h2>🔍 Comparateur de Produits</h2>
          <p>Vous n'avez pas encore de produits à comparer.</p>
          <p>Ajoutez des produits depuis la page d'exploration pour les comparer ici.</p>
          <a href="/explore" className="cta-button primary">
            Explorer les produits
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="compare-page">
      <div className="compare-header">
        <h1>🔍 Comparateur de Produits</h1>
        <div className="compare-actions">
          <span>{compareList.length}/3 produits</span>
          <button onClick={clearCompare} className="clear-button">
            Vider le comparateur
          </button>
        </div>
      </div>

      <div className="compare-table">
        <div className="compare-row compare-images">
          <div className="compare-cell-label">Images</div>
          {compareList.map(product => (
            <div key={product.id} className="compare-cell">
              <div className="product-image-container">
                <img 
                  src={product.images[0] || '/placeholder-product.jpg'} 
                  alt={product.name}
                  className="product-image"
                />
                <button 
                  onClick={() => removeFromCompare(product.id)}
                  className="remove-button"
                >
                  ❌
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="compare-row">
          <div className="compare-cell-label">Nom</div>
          {compareList.map(product => (
            <div key={product.id} className="compare-cell">
              <h3>{product.name}</h3>
            </div>
          ))}
        </div>

        <div className="compare-row">
          <div className="compare-cell-label">Prix</div>
          {compareList.map(product => (
            <div key={product.id} className="compare-cell">
              <div className="price">
                {product.price.toLocaleString()} {product.currency}
              </div>
            </div>
          ))}
        </div>

        <div className="compare-row">
          <div className="compare-cell-label">Vendeur</div>
          {compareList.map(product => (
            <div key={product.id} className="compare-cell">
              <div className="seller-info">
                <div>{product.seller.name}</div>
                <div className="rating">⭐ {product.seller.rating}/5</div>
              </div>
            </div>
          ))}
        </div>

        <div className="compare-row">
          <div className="compare-cell-label">Localisation</div>
          {compareList.map(product => (
            <div key={product.id} className="compare-cell">
              <div className="location">
                📍 {product.location.city}, {product.location.country}
              </div>
            </div>
          ))}
        </div>

        <div className="compare-row">
          <div className="compare-cell-label">Description</div>
          {compareList.map(product => (
            <div key={product.id} className="compare-cell">
              <p className="description">{product.description}</p>
            </div>
          ))}
        </div>

        <div className="compare-row">
          <div className="compare-cell-label">Catégorie</div>
          {compareList.map(product => (
            <div key={product.id} className="compare-cell">
              <span className="category">{product.category}</span>
            </div>
          ))}
        </div>

        <div className="compare-row">
          <div className="compare-cell-label">Actions</div>
          {compareList.map(product => (
            <div key={product.id} className="compare-cell">
              <div className="action-buttons">
                <button className="contact-button">
                  📞 Contacter
                </button>
                <button className="view-button">
                  👁️ Voir détails
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ComparePage;