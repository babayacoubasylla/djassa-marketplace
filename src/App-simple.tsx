import React from 'react';

function App() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #ff6b35, #f7931e)',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif',
      padding: '20px'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>🇨🇮 Djassa</h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
        Marketplace Ivoirien - Version Simple Test
      </p>
      
      <div style={{
        background: 'rgba(255,255,255,0.1)',
        padding: '20px',
        borderRadius: '10px',
        marginBottom: '20px'
      }}>
        <h3>✅ React fonctionne !</h3>
        <p>Cette interface est générée par React</p>
      </div>

      <div style={{
        background: 'rgba(255,255,255,0.1)',
        padding: '20px',
        borderRadius: '10px',
        textAlign: 'center'
      }}>
        <h3>🛍️ Fonctionnalités</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li>✅ Serveur Backend : Actif</li>
          <li>✅ MongoDB : Connecté</li>
          <li>✅ React : Chargé</li>
          <li>✅ API : Disponible</li>
        </ul>
      </div>

      <button 
        onClick={() => alert('React est entièrement fonctionnel !')}
        style={{
          background: '#28a745',
          color: 'white',
          padding: '15px 30px',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '16px',
          marginTop: '20px'
        }}
      >
        Test React
      </button>
    </div>
  );
}

export default App;