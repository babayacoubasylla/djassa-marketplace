import Product from '../models/Product.js';
import Vendor from '../models/Vendor.js';

// Données simulées des marchés ivoiriens pour le système de comparaison
export async function scrapeAllMarkets() {
  console.log('🎯 Début du scraping complet des marchés ivoiriens...');
  
  const results = {
    pharmacies: await scrapePharmacies(),
    supermarkets: await scrapeSupermarkets(),
    restaurants: await scrapeRestaurants(),
    traditionalMarkets: await scrapeTraditionalMarkets()
  };

  console.log('✅ Scraping complet terminé');
  return results;
}

export async function scrapePharmacies() {
  console.log('💊 Scraping des pharmacies...');
  
  const pharmacies = [
    {
      name: 'Pharmacie de la Paix',
      location: { coordinates: [-4.0167, 5.3500] }, // Plateau
      phone: '+225 20 22 50 60',
      commune: 'Plateau'
    },
    {
      name: 'Pharmacie Treichville',
      location: { coordinates: [-4.0167, 5.3167] }, // Treichville
      phone: '+225 21 24 84 10',
      commune: 'Treichville'
    },
    {
      name: 'Pharmacie Cocody',
      location: { coordinates: [-3.9833, 5.3667] }, // Cocody
      phone: '+225 22 44 15 20',
      commune: 'Cocody'
    },
    {
      name: 'Pharmacie Adjamé',
      location: { coordinates: [-4.0333, 5.3833] }, // Adjamé
      phone: '+225 20 37 82 45',
      commune: 'Adjamé'
    },
    {
      name: 'Pharmacie Yopougon',
      location: { coordinates: [-4.0833, 5.3333] }, // Yopougon
      phone: '+225 23 45 67 89',
      commune: 'Yopougon'
    }
  ];

  const products = [
    { name: 'Paracétamol 500mg', price: 250, category: 'Médicaments', subcategory: 'Antalgiques' },
    { name: 'Amoxicilline 250mg', price: 1500, category: 'Médicaments', subcategory: 'Antibiotiques' },
    { name: 'Doliprane 1000mg', price: 450, category: 'Médicaments', subcategory: 'Antalgiques' },
    { name: 'Efferalgan 500mg', price: 380, category: 'Médicaments', subcategory: 'Antalgiques' },
    { name: 'Aspirine 100mg', price: 200, category: 'Médicaments', subcategory: 'Antalgiques' },
    { name: 'Betadine solution', price: 850, category: 'Médicaments', subcategory: 'Antiseptiques' },
    { name: 'Smecta sachets', price: 1200, category: 'Médicaments', subcategory: 'Digestifs' },
    { name: 'Vitamine C 500mg', price: 800, category: 'Médicaments', subcategory: 'Vitamines' },
    { name: 'Nivaquine 100mg', price: 2500, category: 'Médicaments', subcategory: 'Antipaludiques' },
    { name: 'Coartem', price: 3500, category: 'Médicaments', subcategory: 'Antipaludiques' }
  ];

  const scrapedData = [];

  for (const pharmacy of pharmacies) {
    // Créer ou mettre à jour le vendeur
    let vendor = await Vendor.findOneAndUpdate(
      { businessName: pharmacy.name, dataSource: 'scraped' },
      {
        businessName: pharmacy.name,
        phone: pharmacy.phone,
        location: {
          type: 'Point',
          coordinates: pharmacy.location.coordinates,
          address: `${pharmacy.commune}, Abidjan`
        },
        category: 'Pharmacie',
        dataSource: 'scraped',
        accountStatus: 'approved',
        businessHours: {
          monday: { open: '08:00', close: '19:00' },
          tuesday: { open: '08:00', close: '19:00' },
          wednesday: { open: '08:00', close: '19:00' },
          thursday: { open: '08:00', close: '19:00' },
          friday: { open: '08:00', close: '19:00' },
          saturday: { open: '08:00', close: '18:00' },
          sunday: { open: '09:00', close: '17:00' }
        }
      },
      { upsert: true, new: true }
    );

    // Ajouter des produits avec variations de prix
    for (const product of products) {
      const priceVariation = Math.random() * 0.4 - 0.2; // ±20% de variation
      const finalPrice = Math.round(product.price * (1 + priceVariation));

      const productData = {
        name: product.name,
        description: `${product.name} disponible à ${pharmacy.name}`,
        category: product.category,
        subcategory: product.subcategory,
        vendor: vendor._id,
        pricing: {
          price: finalPrice,
          currency: 'FCFA',
          unit: 'boîte'
        },
        availability: {
          inStock: Math.random() > 0.1, // 90% de chance d'être en stock
          quantity: Math.floor(Math.random() * 50) + 10
        },
        images: [`https://via.placeholder.com/300x200?text=${encodeURIComponent(product.name)}`],
        tags: ['médicament', 'pharmacie', pharmacy.commune.toLowerCase()],
        dataSource: 'scraped'
      };

      await Product.findOneAndUpdate(
        { 
          name: product.name, 
          vendor: vendor._id,
          dataSource: 'scraped'
        },
        productData,
        { upsert: true, new: true }
      );

      scrapedData.push(productData);
    }
  }

  console.log(`💊 ${scrapedData.length} produits de pharmacie scrappés`);
  return scrapedData;
}

export async function scrapeSupermarkets() {
  console.log('🛒 Scraping des supermarchés...');

  const supermarkets = [
    {
      name: 'Prosuma Plateau',
      location: { coordinates: [-4.0167, 5.3500] },
      phone: '+225 20 22 33 44',
      commune: 'Plateau'
    },
    {
      name: 'Citydia Cocody',
      location: { coordinates: [-3.9833, 5.3667] },
      phone: '+225 22 44 55 66',
      commune: 'Cocody'
    },
    {
      name: 'Carrefour Yopougon',
      location: { coordinates: [-4.0833, 5.3333] },
      phone: '+225 23 45 67 88',
      commune: 'Yopougon'
    },
    {
      name: 'Hayat Marcory',
      location: { coordinates: [-4.0167, 5.2833] },
      phone: '+225 21 35 46 57',
      commune: 'Marcory'
    }
  ];

  const products = [
    { name: 'Riz parfumé 5kg', price: 3500, category: 'Alimentaire', subcategory: 'Céréales' },
    { name: 'Huile de palme 1L', price: 800, category: 'Alimentaire', subcategory: 'Huiles' },
    { name: 'Lait concentré sucré', price: 450, category: 'Alimentaire', subcategory: 'Laitages' },
    { name: 'Pain de mie', price: 300, category: 'Alimentaire', subcategory: 'Boulangerie' },
    { name: 'Œufs (12 pièces)', price: 1200, category: 'Alimentaire', subcategory: 'Protéines' },
    { name: 'Poisson fumé 500g', price: 2500, category: 'Alimentaire', subcategory: 'Protéines' },
    { name: 'Bananes plantain (5 pièces)', price: 500, category: 'Alimentaire', subcategory: 'Fruits' },
    { name: 'Tomates (1kg)', price: 800, category: 'Alimentaire', subcategory: 'Légumes' },
    { name: 'Oignons (1kg)', price: 400, category: 'Alimentaire', subcategory: 'Légumes' },
    { name: 'Savon de Marseille', price: 350, category: 'Hygiène', subcategory: 'Soins corps' }
  ];

  const scrapedData = [];

  for (const supermarket of supermarkets) {
    let vendor = await Vendor.findOneAndUpdate(
      { businessName: supermarket.name, dataSource: 'scraped' },
      {
        businessName: supermarket.name,
        phone: supermarket.phone,
        location: {
          type: 'Point',
          coordinates: supermarket.location.coordinates,
          address: `${supermarket.commune}, Abidjan`
        },
        category: 'Supermarché',
        dataSource: 'scraped',
        accountStatus: 'approved',
        businessHours: {
          monday: { open: '07:30', close: '21:00' },
          tuesday: { open: '07:30', close: '21:00' },
          wednesday: { open: '07:30', close: '21:00' },
          thursday: { open: '07:30', close: '21:00' },
          friday: { open: '07:30', close: '21:00' },
          saturday: { open: '07:30', close: '21:00' },
          sunday: { open: '08:00', close: '20:00' }
        }
      },
      { upsert: true, new: true }
    );

    for (const product of products) {
      const priceVariation = Math.random() * 0.3 - 0.15; // ±15% de variation
      const finalPrice = Math.round(product.price * (1 + priceVariation));

      const productData = {
        name: product.name,
        description: `${product.name} disponible chez ${supermarket.name}`,
        category: product.category,
        subcategory: product.subcategory,
        vendor: vendor._id,
        pricing: {
          price: finalPrice,
          currency: 'FCFA',
          unit: 'pièce'
        },
        availability: {
          inStock: Math.random() > 0.05, // 95% de chance d'être en stock
          quantity: Math.floor(Math.random() * 100) + 20
        },
        images: [`https://via.placeholder.com/300x200?text=${encodeURIComponent(product.name)}`],
        tags: ['alimentaire', 'supermarché', supermarket.commune.toLowerCase()],
        dataSource: 'scraped'
      };

      await Product.findOneAndUpdate(
        { 
          name: product.name, 
          vendor: vendor._id,
          dataSource: 'scraped'
        },
        productData,
        { upsert: true, new: true }
      );

      scrapedData.push(productData);
    }
  }

  console.log(`🛒 ${scrapedData.length} produits de supermarché scrappés`);
  return scrapedData;
}

export async function scrapeRestaurants() {
  console.log('🍽️ Scraping des restaurants...');

  const restaurants = [
    {
      name: 'Maquis Chez Tante Marie',
      location: { coordinates: [-4.0167, 5.3167] },
      phone: '+225 07 12 34 56',
      commune: 'Treichville'
    },
    {
      name: 'Restaurant Le Plateau',
      location: { coordinates: [-4.0167, 5.3500] },
      phone: '+225 20 30 40 50',
      commune: 'Plateau'
    },
    {
      name: 'Maquis Cocody',
      location: { coordinates: [-3.9833, 5.3667] },
      phone: '+225 22 33 44 55',
      commune: 'Cocody'
    },
    {
      name: 'Chez Fatou Adjamé',
      location: { coordinates: [-4.0333, 5.3833] },
      phone: '+225 05 67 89 01',
      commune: 'Adjamé'
    }
  ];

  const dishes = [
    { name: 'Attiéké poisson', price: 1500, category: 'Restaurant', subcategory: 'Plats locaux' },
    { name: 'Riz au gras', price: 1200, category: 'Restaurant', subcategory: 'Plats locaux' },
    { name: 'Foutou sauce arachide', price: 1800, category: 'Restaurant', subcategory: 'Plats locaux' },
    { name: 'Kedjenou de poulet', price: 2500, category: 'Restaurant', subcategory: 'Plats locaux' },
    { name: 'Alloco saucisse', price: 800, category: 'Restaurant', subcategory: 'Snacks' },
    { name: 'Garba', price: 400, category: 'Restaurant', subcategory: 'Snacks' },
    { name: 'Thieboudienne', price: 2000, category: 'Restaurant', subcategory: 'Plats locaux' },
    { name: 'Poulet braisé', price: 3000, category: 'Restaurant', subcategory: 'Grillades' },
    { name: 'Poisson braisé', price: 2500, category: 'Restaurant', subcategory: 'Grillades' },
    { name: 'Jus de bissap', price: 300, category: 'Restaurant', subcategory: 'Boissons' }
  ];

  const scrapedData = [];

  for (const restaurant of restaurants) {
    let vendor = await Vendor.findOneAndUpdate(
      { businessName: restaurant.name, dataSource: 'scraped' },
      {
        businessName: restaurant.name,
        phone: restaurant.phone,
        location: {
          type: 'Point',
          coordinates: restaurant.location.coordinates,
          address: `${restaurant.commune}, Abidjan`
        },
        category: 'Restaurant',
        dataSource: 'scraped',
        accountStatus: 'approved',
        businessHours: {
          monday: { open: '11:00', close: '22:00' },
          tuesday: { open: '11:00', close: '22:00' },
          wednesday: { open: '11:00', close: '22:00' },
          thursday: { open: '11:00', close: '22:00' },
          friday: { open: '11:00', close: '23:00' },
          saturday: { open: '11:00', close: '23:00' },
          sunday: { open: '12:00', close: '21:00' }
        }
      },
      { upsert: true, new: true }
    );

    for (const dish of dishes) {
      const priceVariation = Math.random() * 0.2 - 0.1; // ±10% de variation
      const finalPrice = Math.round(dish.price * (1 + priceVariation));

      const productData = {
        name: dish.name,
        description: `${dish.name} préparé avec amour chez ${restaurant.name}`,
        category: dish.category,
        subcategory: dish.subcategory,
        vendor: vendor._id,
        pricing: {
          price: finalPrice,
          currency: 'FCFA',
          unit: 'portion'
        },
        availability: {
          inStock: Math.random() > 0.15, // 85% de chance d'être disponible
          quantity: Math.floor(Math.random() * 20) + 5
        },
        images: [`https://via.placeholder.com/300x200?text=${encodeURIComponent(dish.name)}`],
        tags: ['restaurant', 'plat local', restaurant.commune.toLowerCase()],
        dataSource: 'scraped'
      };

      await Product.findOneAndUpdate(
        { 
          name: dish.name, 
          vendor: vendor._id,
          dataSource: 'scraped'
        },
        productData,
        { upsert: true, new: true }
      );

      scrapedData.push(productData);
    }
  }

  console.log(`🍽️ ${scrapedData.length} plats de restaurant scrappés`);
  return scrapedData;
}

export async function scrapeTraditionalMarkets() {
  console.log('🏪 Scraping des marchés traditionnels...');

  const markets = [
    {
      name: 'Marché de Treichville',
      location: { coordinates: [-4.0167, 5.3167] },
      phone: '+225 07 11 22 33',
      commune: 'Treichville'
    },
    {
      name: 'Marché de Cocody',
      location: { coordinates: [-3.9833, 5.3667] },
      phone: '+225 08 22 33 44',
      commune: 'Cocody'
    },
    {
      name: 'Marché d\'Adjamé',
      location: { coordinates: [-4.0333, 5.3833] },
      phone: '+225 09 33 44 55',
      commune: 'Adjamé'
    },
    {
      name: 'Marché de Yopougon',
      location: { coordinates: [-4.0833, 5.3333] },
      phone: '+225 06 44 55 66',
      commune: 'Yopougon'
    }
  ];

  const products = [
    { name: 'Ignames (1kg)', price: 600, category: 'Alimentaire', subcategory: 'Tubercules' },
    { name: 'Manioc (1kg)', price: 400, category: 'Alimentaire', subcategory: 'Tubercules' },
    { name: 'Plantain mûr (5 pièces)', price: 600, category: 'Alimentaire', subcategory: 'Fruits' },
    { name: 'Mangues (1kg)', price: 500, category: 'Alimentaire', subcategory: 'Fruits' },
    { name: 'Ananas (1 pièce)', price: 800, category: 'Alimentaire', subcategory: 'Fruits' },
    { name: 'Gombo (500g)', price: 300, category: 'Alimentaire', subcategory: 'Légumes' },
    { name: 'Épinards (1 botte)', price: 200, category: 'Alimentaire', subcategory: 'Légumes' },
    { name: 'Piment rouge (100g)', price: 150, category: 'Alimentaire', subcategory: 'Épices' },
    { name: 'Gingembre (250g)', price: 400, category: 'Alimentaire', subcategory: 'Épices' },
    { name: 'Poisson tilapia (1kg)', price: 2000, category: 'Alimentaire', subcategory: 'Protéines' }
  ];

  const scrapedData = [];

  for (const market of markets) {
    let vendor = await Vendor.findOneAndUpdate(
      { businessName: market.name, dataSource: 'scraped' },
      {
        businessName: market.name,
        phone: market.phone,
        location: {
          type: 'Point',
          coordinates: market.location.coordinates,
          address: `${market.commune}, Abidjan`
        },
        category: 'Marché traditionnel',
        dataSource: 'scraped',
        accountStatus: 'approved',
        businessHours: {
          monday: { open: '06:00', close: '18:00' },
          tuesday: { open: '06:00', close: '18:00' },
          wednesday: { open: '06:00', close: '18:00' },
          thursday: { open: '06:00', close: '18:00' },
          friday: { open: '06:00', close: '18:00' },
          saturday: { open: '06:00', close: '18:00' },
          sunday: { open: '07:00', close: '17:00' }
        }
      },
      { upsert: true, new: true }
    );

    for (const product of products) {
      const priceVariation = Math.random() * 0.4 - 0.2; // ±20% de variation (marchés plus variables)
      const finalPrice = Math.round(product.price * (1 + priceVariation));

      const productData = {
        name: product.name,
        description: `${product.name} frais du ${market.name}`,
        category: product.category,
        subcategory: product.subcategory,
        vendor: vendor._id,
        pricing: {
          price: finalPrice,
          currency: 'FCFA',
          unit: 'kg'
        },
        availability: {
          inStock: Math.random() > 0.2, // 80% de chance d'être en stock
          quantity: Math.floor(Math.random() * 30) + 10
        },
        images: [`https://via.placeholder.com/300x200?text=${encodeURIComponent(product.name)}`],
        tags: ['frais', 'marché traditionnel', market.commune.toLowerCase()],
        dataSource: 'scraped'
      };

      await Product.findOneAndUpdate(
        { 
          name: product.name, 
          vendor: vendor._id,
          dataSource: 'scraped'
        },
        productData,
        { upsert: true, new: true }
      );

      scrapedData.push(productData);
    }
  }

  console.log(`🏪 ${scrapedData.length} produits de marché traditionnel scrappés`);
  return scrapedData;
}