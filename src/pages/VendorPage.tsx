import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface VendorStats {
  totalSales: number;
  totalOrders: number;
  activeProducts: number;
  rating: number;
  revenue: number;
}

interface VendorShop {
  name: string;
  logo: string;
  description: string;
  address: string;
  phone: string;
  isVerified: boolean;
}

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  status: 'active' | 'paused' | 'out_of_stock';
  image: string;
  views: number;
  sales: number;
}

const VendorPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'add' | 'shop'>('dashboard');
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    images: [] as string[]
  });
  const [shopInfo, setShopInfo] = useState<VendorShop>({
    name: 'Ma Boutique Mobile',
    logo: '/api/placeholder/100/100',
    description: 'Vente de produits de qualité depuis mon mobile',
    address: 'Abidjan, Côte d\'Ivoire',
    phone: '+225 01 23 45 67 89',
    isVerified: true
  });
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  // Statistiques du vendeur
  const stats: VendorStats = {
    totalSales: 127,
    totalOrders: 89,
    activeProducts: 23,
    rating: 4.7,
    revenue: 485000
  };

  // Produits du vendeur
  const products: Product[] = [
    {
      id: '1',
      name: 'Samsung Galaxy A54',
      price: 185000,
      stock: 15,
      status: 'active',
      image: '/api/placeholder/150/150',
      views: 234,
      sales: 12
    },
    {
      id: '2',
      name: 'iPhone 13',
      price: 450000,
      stock: 0,
      status: 'out_of_stock',
      image: '/api/placeholder/150/150',
      views: 567,
      sales: 8
    },
    {
      id: '3',
      name: 'AirPods Pro',
      price: 125000,
      stock: 25,
      status: 'active',
      image: '/api/placeholder/150/150',
      views: 189,
      sales: 15
    }
  ];

  const categories = [
    'Électronique', 'Mode', 'Maison', 'Sport', 'Beauté', 'Auto', 'Livres'
  ];

  const handleImageUpload = (files: FileList | null, isLogo: boolean = false) => {
    if (!files) return;
    
    // Simulation d'upload d'images
    const newImages = Array.from(files).map((file) => {
      const url = URL.createObjectURL(file);
      return url;
    });
    
    if (isLogo && newImages.length > 0) {
      setShopInfo({...shopInfo, logo: newImages[0]});
    } else {
      setSelectedImages([...selectedImages, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price);
  };

  const getStatusColor = (status: Product['status']) => {
    switch (status) {
      case 'active': return 'text-success';
      case 'paused': return 'text-warning';
      case 'out_of_stock': return 'text-danger';
    }
  };

  const getStatusText = (status: Product['status']) => {
    switch (status) {
      case 'active': return 'Actif';
      case 'paused': return 'En pause';
      case 'out_of_stock': return 'Rupture';
    }
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    // Logique d'ajout de produit
    console.log('Nouveau produit:', newProduct);
    // Reset form
    setNewProduct({
      name: '',
      description: '',
      price: '',
      category: '',
      stock: '',
      images: []
    });
    setActiveTab('products');
  };

  const renderTabButtons = () => (
    <div className="bg-white border-b sticky top-16 z-10">
      <div className="container">
        <div className="flex overflow-x-auto">
          {[
            { id: 'dashboard', label: 'Tableau de bord', icon: '📊' },
            { id: 'products', label: 'Produits', icon: '📦' },
            { id: 'orders', label: 'Commandes', icon: '🛒' },
            { id: 'add', label: 'Ajouter', icon: '➕' },
            { id: 'shop', label: 'Ma Boutique', icon: '🏪' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-primary text-primary bg-orange-50'
                  : 'border-transparent text-gray-600'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="container py-4 space-y-6">
      {/* Salutation */}
      <div className="bg-gradient-to-r from-orange-400 to-red-500 text-white p-6 rounded-lg">
        <h1 className="text-xl font-bold mb-2">
          Bonjour {user?.name?.split(' ')[0]}! 👋
        </h1>
        <p className="opacity-90">
          Gérez votre boutique depuis votre mobile
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-primary">
            {formatPrice(stats.revenue)} F
          </div>
          <div className="text-sm text-gray-600">Revenus totaux</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-success">
            {stats.totalOrders}
          </div>
          <div className="text-sm text-gray-600">Commandes</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-secondary">
            {stats.activeProducts}
          </div>
          <div className="text-sm text-gray-600">Produits actifs</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-warning">
            ⭐ {stats.rating}
          </div>
          <div className="text-sm text-gray-600">Note moyenne</div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b">
          <h2 className="font-semibold">🚀 Actions rapides</h2>
        </div>
        <div className="p-4 space-y-3">
          <button
            onClick={() => setActiveTab('add')}
            className="w-full btn btn-primary"
          >
            ➕ Ajouter un produit
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className="w-full btn btn-outline"
          >
            📋 Voir les commandes
          </button>
          <button className="w-full btn btn-outline">
            📊 Voir les statistiques détaillées
          </button>
        </div>
      </div>

      {/* Produits populaires */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b">
          <h2 className="font-semibold">🔥 Vos produits populaires</h2>
        </div>
        <div className="divide-y">
          {products.slice(0, 3).map((product) => (
            <div key={product.id} className="p-4 flex items-center gap-3">
              <img
                src={product.image}
                alt={product.name}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div className="flex-1">
                <div className="font-medium text-sm">{product.name}</div>
                <div className="text-primary text-sm font-semibold">
                  {formatPrice(product.price)} F
                </div>
              </div>
              <div className="text-right text-xs text-gray-500">
                <div>{product.views} vues</div>
                <div>{product.sales} ventes</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderProducts = () => (
    <div className="container py-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">📦 Mes Produits</h2>
        <button
          onClick={() => setActiveTab('add')}
          className="btn btn-primary btn-sm"
        >
          ➕ Ajouter
        </button>
      </div>

      <div className="space-y-3">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex gap-3">
              <img
                src={product.image}
                alt={product.name}
                className="w-20 h-20 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h3 className="font-medium mb-1">{product.name}</h3>
                <div className="text-primary font-semibold mb-2">
                  {formatPrice(product.price)} F
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-600">
                  <span>Stock: {product.stock}</span>
                  <span className={getStatusColor(product.status)}>
                    {getStatusText(product.status)}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button className="btn btn-outline btn-sm">
                  ✏️
                </button>
                <button className="btn btn-danger btn-sm">
                  🗑️
                </button>
              </div>
            </div>
            
            <div className="mt-3 pt-3 border-t flex justify-between text-sm text-gray-600">
              <span>👁️ {product.views} vues</span>
              <span>🛒 {product.sales} ventes</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="container py-4">
      <h2 className="text-lg font-semibold mb-4">🛒 Commandes récentes</h2>
      
      <div className="space-y-3">
        {[
          { id: 'CMD-001', customer: 'Kouame Jean', total: 185000, status: 'pending', items: 1 },
          { id: 'CMD-002', customer: 'Fatou Diallo', total: 125000, status: 'confirmed', items: 2 },
          { id: 'CMD-003', customer: 'Moussa Traore', total: 450000, status: 'shipped', items: 1 }
        ].map((order) => (
          <div key={order.id} className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="font-medium">{order.id}</div>
                <div className="text-sm text-gray-600">{order.customer}</div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-primary">
                  {formatPrice(order.total)} F
                </div>
                <div className="text-xs text-gray-500">
                  {order.items} article{order.items > 1 ? 's' : ''}
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className={`badge ${
                order.status === 'pending' ? 'badge-warning' :
                order.status === 'confirmed' ? 'badge-primary' : 'badge-success'
              }`}>
                {order.status === 'pending' ? 'En attente' :
                 order.status === 'confirmed' ? 'Confirmée' : 'Expédiée'}
              </span>
              <button className="btn btn-outline btn-sm">
                Voir détails
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAddProduct = () => (
    <div className="container py-4">
      <h2 className="text-lg font-semibold mb-4">➕ Ajouter un produit</h2>
      
      <form onSubmit={handleAddProduct} className="space-y-4">
        <div className="bg-white rounded-lg shadow-sm border p-4 space-y-4">
          <div className="form-group">
            <label className="form-label">📝 Nom du produit</label>
            <input
              type="text"
              value={newProduct.name}
              onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
              className="form-control"
              placeholder="Ex: Samsung Galaxy A54"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">📄 Description</label>
            <textarea
              value={newProduct.description}
              onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
              className="form-control"
              rows={3}
              placeholder="Décrivez votre produit..."
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">💰 Prix (FCFA)</label>
              <input
                type="number"
                value={newProduct.price}
                onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                className="form-control"
                placeholder="0"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">📦 Stock</label>
              <input
                type="number"
                value={newProduct.stock}
                onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                className="form-control"
                placeholder="0"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">🏷️ Catégorie</label>
            <select
              value={newProduct.category}
              onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
              className="form-control"
              title="Sélectionner une catégorie"
              required
            >
              <option value="">Choisir une catégorie</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">📸 Images du produit</label>
            <div className="space-y-3">
              {/* Zone d'upload */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <div className="text-4xl mb-2">�</div>
                <p className="text-gray-600 mb-3 text-sm">
                  Ajoutez des photos depuis votre mobile
                </p>
                <input
                  type="file"
                  id="product-images"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e.target.files)}
                  className="hidden"
                />
                <label
                  htmlFor="product-images"
                  className="btn btn-outline btn-sm cursor-pointer"
                >
                  📷 Choisir photos
                </label>
              </div>
              
              {/* Aperçu des images sélectionnées */}
              {selectedImages.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {selectedImages.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`Image ${index + 1}`}
                        className="w-full h-20 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setActiveTab('products')}
              className="btn btn-outline flex-1"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="btn btn-primary flex-1"
            >
              ✅ Publier
            </button>
          </div>
        </div>
      </form>
    </div>
  );

  const renderShopSettings = () => (
    <div className="container py-4 space-y-6">
      <h2 className="text-lg font-semibold mb-4">🏪 Ma Boutique</h2>
      
      {/* Informations de la boutique */}
      <div className="bg-white rounded-lg shadow-sm border p-4 space-y-4">
        {/* Logo de la boutique */}
        <div className="text-center">
          <div className="relative inline-block">
            <img
              src={shopInfo.logo}
              alt="Logo boutique"
              className="w-24 h-24 rounded-full object-cover border-4 border-primary"
            />
            <input
              type="file"
              id="shop-logo"
              accept="image/*"
              onChange={(e) => handleImageUpload(e.target.files, true)}
              className="hidden"
            />
            <label
              htmlFor="shop-logo"
              className="absolute bottom-0 right-0 bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center cursor-pointer"
            >
              📷
            </label>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Touchez l'icône 📷 pour changer votre logo
          </p>
        </div>

        {/* Informations boutique */}
        <div className="space-y-4">
          <div className="form-group">
            <label className="form-label">🏪 Nom de la boutique</label>
            <input
              type="text"
              value={shopInfo.name}
              onChange={(e) => setShopInfo({...shopInfo, name: e.target.value})}
              className="form-control"
              placeholder="Nom de votre boutique"
            />
          </div>

          <div className="form-group">
            <label className="form-label">📝 Description</label>
            <textarea
              value={shopInfo.description}
              onChange={(e) => setShopInfo({...shopInfo, description: e.target.value})}
              className="form-control"
              rows={3}
              placeholder="Décrivez votre boutique..."
            />
          </div>

          <div className="form-group">
            <label className="form-label">📍 Adresse</label>
            <input
              type="text"
              value={shopInfo.address}
              onChange={(e) => setShopInfo({...shopInfo, address: e.target.value})}
              className="form-control"
              placeholder="Adresse de votre boutique"
            />
          </div>

          <div className="form-group">
            <label className="form-label">📞 Téléphone</label>
            <input
              type="tel"
              value={shopInfo.phone}
              onChange={(e) => setShopInfo({...shopInfo, phone: e.target.value})}
              className="form-control"
              placeholder="+225 XX XX XX XX XX"
            />
          </div>
        </div>

        <button className="w-full btn btn-primary">
          ✅ Sauvegarder les modifications
        </button>
      </div>

      {/* Aperçu de la boutique */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b">
          <h3 className="font-semibold">👁️ Aperçu de votre boutique</h3>
          <p className="text-sm text-gray-600">
            Voici comment les clients voient votre boutique
          </p>
        </div>
        
        <div className="p-4">
          <div className="flex items-start gap-4">
            <img
              src={shopInfo.logo}
              alt="Logo"
              className="w-16 h-16 rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold">{shopInfo.name}</h4>
                {shopInfo.isVerified && <span className="text-success">✅</span>}
              </div>
              <p className="text-sm text-gray-600 mb-2">{shopInfo.description}</p>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>📍 {shopInfo.address}</span>
                <span>⭐ {stats.rating}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conseils pour mobile */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-800 mb-2">
          💡 Conseils pour votre boutique mobile
        </h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Utilisez un logo carré et net pour un meilleur rendu</li>
          <li>• Prenez des photos bien éclairées avec votre mobile</li>
          <li>• Ajoutez une description claire et attractive</li>
          <li>• Mettez à jour régulièrement vos produits</li>
        </ul>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={shopInfo.logo}
                alt="Logo boutique"
                className="w-12 h-12 rounded-full object-cover border-2 border-primary"
              />
              <div>
                <h1 className="text-xl font-bold text-gray-800">
                  {shopInfo.name}
                </h1>
                <p className="text-sm text-gray-600">
                  Gérez depuis votre mobile 📱
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-right">
                <div className="text-sm font-medium">⭐ {stats.rating}</div>
                <div className="text-xs text-gray-500">Note</div>
              </div>
              {shopInfo.isVerified && (
                <div className="text-success text-xl">✅</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {renderTabButtons()}

      {activeTab === 'dashboard' && renderDashboard()}
      {activeTab === 'products' && renderProducts()}
      {activeTab === 'orders' && renderOrders()}
      {activeTab === 'add' && renderAddProduct()}
      {activeTab === 'shop' && renderShopSettings()}
    </div>
  );
};

export default VendorPage;