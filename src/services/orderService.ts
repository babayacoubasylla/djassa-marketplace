// Service de gestion des commandes en temps réel
export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  options?: string[];
}

export interface DeliveryPerson {
  id: string;
  name: string;
  phone: string;
  photo?: string;
  rating: number;
  vehicle: 'bike' | 'scooter' | 'car';
  currentLocation?: {
    lat: number;
    lng: number;
    timestamp: number;
  };
}

export interface Order {
  id: string;
  customerId: string;
  type: 'restaurant' | 'course' | 'colis';
  status: 'pending' | 'confirmed' | 'preparing' | 'pickup' | 'transit' | 'delivered' | 'cancelled';
  
  // Informations de base
  title: string;
  description?: string;
  vendor: string;
  vendorId?: string;
  total: number;
  fees: {
    delivery: number;
    service: number;
    platform: number;
  };
  
  // Dates importantes
  createdAt: string;
  confirmedAt?: string;
  pickupTime?: string;
  deliveredAt?: string;
  estimatedDelivery: string;
  
  // Adresses
  addresses: {
    pickup: {
      name: string;
      address: string;
      coordinates: { lat: number; lng: number };
      phone?: string;
      instructions?: string;
    };
    delivery: {
      name: string;
      address: string;
      coordinates: { lat: number; lng: number };
      phone?: string;
      instructions?: string;
    };
  };
  
  // Articles commandés
  items?: OrderItem[];
  
  // Informations de livraison
  deliveryPerson?: DeliveryPerson;
  deliveryNotes?: string;
  
  // Paiement
  payment: {
    method: 'cash' | 'mobile_money' | 'card';
    status: 'pending' | 'paid' | 'failed';
    reference?: string;
  };
  
  // Suivi
  tracking: {
    updates: Array<{
      status: Order['status'];
      timestamp: string;
      message: string;
      location?: { lat: number; lng: number };
    }>;
  };
}

class OrderService {
  private static instance: OrderService;
  private orders: Map<string, Order> = new Map();
  private listeners: Set<(orders: Order[]) => void> = new Set();
  private statusListeners: Map<string, Set<(order: Order) => void>> = new Map();

  public static getInstance(): OrderService {
    if (!OrderService.instance) {
      OrderService.instance = new OrderService();
    }
    return OrderService.instance;
  }

  constructor() {
    this.loadOrdersFromStorage();
    this.initializeRealTimeUpdates();
  }

  // Charger les commandes depuis le localStorage
  private loadOrdersFromStorage() {
    const savedOrders = localStorage.getItem('djassa_orders');
    if (savedOrders) {
      const ordersArray = JSON.parse(savedOrders);
      ordersArray.forEach((order: Order) => {
        this.orders.set(order.id, order);
      });
    }
  }

  // Sauvegarder les commandes dans le localStorage
  private saveOrdersToStorage() {
    const ordersArray = Array.from(this.orders.values());
    localStorage.setItem('djassa_orders', JSON.stringify(ordersArray));
  }

  // Initialiser les mises à jour en temps réel
  private initializeRealTimeUpdates() {
    // Simuler des mises à jour de statut en temps réel
    setInterval(() => {
      this.simulateStatusUpdates();
    }, 30000); // Toutes les 30 secondes

    // Simuler les mises à jour de position des livreurs
    setInterval(() => {
      this.simulateDeliveryPersonLocationUpdates();
    }, 10000); // Toutes les 10 secondes
  }

  // Créer une nouvelle commande
  public createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'tracking'>): Order {
    const order: Order = {
      ...orderData,
      id: `ORD-${Date.now()}`,
      createdAt: new Date().toISOString(),
      tracking: {
        updates: [{
          status: orderData.status,
          timestamp: new Date().toISOString(),
          message: 'Commande créée avec succès'
        }]
      }
    };

    this.orders.set(order.id, order);
    this.saveOrdersToStorage();
    this.notifyListeners();
    
    return order;
  }

  // Obtenir toutes les commandes
  public getAllOrders(): Order[] {
    return Array.from(this.orders.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  // Obtenir les commandes d'un utilisateur
  public getOrdersByCustomerId(customerId: string): Order[] {
    return this.getAllOrders().filter(order => order.customerId === customerId);
  }

  // Obtenir une commande par ID
  public getOrderById(orderId: string): Order | undefined {
    return this.orders.get(orderId);
  }

  // Mettre à jour le statut d'une commande
  public updateOrderStatus(orderId: string, status: Order['status'], message?: string): boolean {
    const order = this.orders.get(orderId);
    if (!order) return false;

    order.status = status;

    // Ajouter une mise à jour de suivi
    order.tracking.updates.push({
      status,
      timestamp: new Date().toISOString(),
      message: message || this.getStatusMessage(status),
      location: order.deliveryPerson?.currentLocation
    });

    // Mettre à jour les timestamps appropriés
    const now = new Date().toISOString();
    switch (status) {
      case 'confirmed':
        order.confirmedAt = now;
        break;
      case 'pickup':
        order.pickupTime = now;
        break;
      case 'delivered':
        order.deliveredAt = now;
        break;
    }

    this.orders.set(orderId, order);
    this.saveOrdersToStorage();
    this.notifyListeners();
    this.notifyStatusListeners(orderId, order);

    return true;
  }

  // Assigner un livreur à une commande
  public assignDeliveryPerson(orderId: string, deliveryPerson: DeliveryPerson): boolean {
    const order = this.orders.get(orderId);
    if (!order) return false;

    order.deliveryPerson = deliveryPerson;
    order.tracking.updates.push({
      status: order.status,
      timestamp: new Date().toISOString(),
      message: `${deliveryPerson.name} a été assigné à votre commande`
    });

    this.orders.set(orderId, order);
    this.saveOrdersToStorage();
    this.notifyListeners();
    this.notifyStatusListeners(orderId, order);

    return true;
  }

  // Mettre à jour la position du livreur
  public updateDeliveryPersonLocation(
    orderId: string, 
    location: { lat: number; lng: number }
  ): boolean {
    const order = this.orders.get(orderId);
    if (!order || !order.deliveryPerson) return false;

    order.deliveryPerson.currentLocation = {
      ...location,
      timestamp: Date.now()
    };

    this.orders.set(orderId, order);
    this.notifyStatusListeners(orderId, order);

    return true;
  }

  // S'abonner aux mises à jour de commandes
  public subscribe(callback: (orders: Order[]) => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  // S'abonner aux mises à jour d'une commande spécifique
  public subscribeToOrder(orderId: string, callback: (order: Order) => void): () => void {
    if (!this.statusListeners.has(orderId)) {
      this.statusListeners.set(orderId, new Set());
    }
    this.statusListeners.get(orderId)!.add(callback);
    
    return () => {
      const listeners = this.statusListeners.get(orderId);
      if (listeners) {
        listeners.delete(callback);
        if (listeners.size === 0) {
          this.statusListeners.delete(orderId);
        }
      }
    };
  }

  // Notifier tous les listeners
  private notifyListeners() {
    const orders = this.getAllOrders();
    this.listeners.forEach(listener => listener(orders));
  }

  // Notifier les listeners d'une commande spécifique
  private notifyStatusListeners(orderId: string, order: Order) {
    const listeners = this.statusListeners.get(orderId);
    if (listeners) {
      listeners.forEach(listener => listener(order));
    }
  }

  // Obtenir le message par défaut pour un statut
  private getStatusMessage(status: Order['status']): string {
    switch (status) {
      case 'pending': return 'Commande en attente de confirmation';
      case 'confirmed': return 'Commande confirmée par le vendeur';
      case 'preparing': return 'Préparation de votre commande en cours';
      case 'pickup': return 'Le livreur récupère votre commande';
      case 'transit': return 'Votre commande est en route';
      case 'delivered': return 'Commande livrée avec succès';
      case 'cancelled': return 'Commande annulée';
      default: return 'Mise à jour du statut';
    }
  }

  // Simuler des mises à jour de statut
  private simulateStatusUpdates() {
    const activeOrders = this.getAllOrders().filter(order => 
      !['delivered', 'cancelled'].includes(order.status)
    );

    activeOrders.forEach(order => {
      if (Math.random() > 0.8) { // 20% de chance
        const nextStatus = this.getNextStatus(order.status);
        if (nextStatus) {
          this.updateOrderStatus(order.id, nextStatus);
        }
      }
    });
  }

  // Obtenir le prochain statut logique
  private getNextStatus(currentStatus: Order['status']): Order['status'] | null {
    const statusFlow: Record<Order['status'], Order['status'] | null> = {
      'pending': 'confirmed',
      'confirmed': 'preparing',
      'preparing': 'pickup',
      'pickup': 'transit',
      'transit': 'delivered',
      'delivered': null,
      'cancelled': null
    };

    return statusFlow[currentStatus];
  }

  // Simuler les mises à jour de position des livreurs
  private simulateDeliveryPersonLocationUpdates() {
    const ordersInTransit = this.getAllOrders().filter(order => 
      ['pickup', 'transit'].includes(order.status) && order.deliveryPerson
    );

    ordersInTransit.forEach(order => {
      if (order.deliveryPerson?.currentLocation) {
        // Simuler un mouvement aléatoire
        const newLocation = {
          lat: order.deliveryPerson.currentLocation.lat + (Math.random() - 0.5) * 0.001,
          lng: order.deliveryPerson.currentLocation.lng + (Math.random() - 0.5) * 0.001
        };
        this.updateDeliveryPersonLocation(order.id, newLocation);
      }
    });
  }

  // Méthodes utilitaires pour les statistiques
  public getOrderStats() {
    const orders = this.getAllOrders();
    return {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      active: orders.filter(o => !['delivered', 'cancelled'].includes(o.status)).length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
      totalRevenue: orders
        .filter(o => o.status === 'delivered')
        .reduce((sum, o) => sum + o.total, 0)
    };
  }
}

export default OrderService;