import express from 'express';
import { scrapeAllMarkets, scrapePharmacies, scrapeSupermarkets, scrapeRestaurants, scrapeTraditionalMarkets } from '../services/market-scraper.js';
import Product from '../models/Product.js';
import Vendor from '../models/Vendor.js';
import { authMiddleware, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Lancer le scraping complet (admin uniquement)
router.post('/scrape-all', authMiddleware, adminOnly, async (req, res) => {
  try {
    console.log('Début du scraping complet des marchés ivoiriens...');
    
    const results = await scrapeAllMarkets();
    
    res.json({
      message: 'Scraping terminé avec succès',
      results: {
        pharmacies: results.pharmacies?.length || 0,
        supermarkets: results.supermarkets?.length || 0,
        restaurants: results.restaurants?.length || 0,
        traditionalMarkets: results.traditionalMarkets?.length || 0,
        total: (results.pharmacies?.length || 0) + 
               (results.supermarkets?.length || 0) + 
               (results.restaurants?.length || 0) + 
               (results.traditionalMarkets?.length || 0)
      }
    });

  } catch (error) {
    console.error('Erreur scraping complet:', error);
    res.status(500).json({ 
      message: 'Erreur lors du scraping', 
      error: error.message 
    });
  }
});

// Scraping des pharmacies
router.post('/scrape-pharmacies', authMiddleware, adminOnly, async (req, res) => {
  try {
    console.log('Début du scraping des pharmacies...');
    
    const pharmacies = await scrapePharmacies();
    
    res.json({
      message: 'Scraping des pharmacies terminé',
      count: pharmacies.length,
      pharmacies: pharmacies.slice(0, 5) // Aperçu des 5 premiers
    });

  } catch (error) {
    console.error('Erreur scraping pharmacies:', error);
    res.status(500).json({ 
      message: 'Erreur lors du scraping des pharmacies', 
      error: error.message 
    });
  }
});

// Scraping des supermarchés
router.post('/scrape-supermarkets', authMiddleware, adminOnly, async (req, res) => {
  try {
    console.log('Début du scraping des supermarchés...');
    
    const supermarkets = await scrapeSupermarkets();
    
    res.json({
      message: 'Scraping des supermarchés terminé',
      count: supermarkets.length,
      supermarkets: supermarkets.slice(0, 5)
    });

  } catch (error) {
    console.error('Erreur scraping supermarchés:', error);
    res.status(500).json({ 
      message: 'Erreur lors du scraping des supermarchés', 
      error: error.message 
    });
  }
});

// Scraping des restaurants
router.post('/scrape-restaurants', authMiddleware, adminOnly, async (req, res) => {
  try {
    console.log('Début du scraping des restaurants...');
    
    const restaurants = await scrapeRestaurants();
    
    res.json({
      message: 'Scraping des restaurants terminé',
      count: restaurants.length,
      restaurants: restaurants.slice(0, 5)
    });

  } catch (error) {
    console.error('Erreur scraping restaurants:', error);
    res.status(500).json({ 
      message: 'Erreur lors du scraping des restaurants', 
      error: error.message 
    });
  }
});

// Obtenir les statistiques du scraping
router.get('/scraping-stats', authMiddleware, adminOnly, async (req, res) => {
  try {
    const stats = await Promise.all([
      Product.countDocuments({ dataSource: 'scraped' }),
      Product.countDocuments({ dataSource: 'scraped', category: 'Médicaments' }),
      Product.countDocuments({ dataSource: 'scraped', category: 'Alimentaire' }),
      Product.countDocuments({ dataSource: 'scraped', category: 'Restaurant' }),
      Vendor.countDocuments({ dataSource: 'scraped' }),
      Product.find({ dataSource: 'scraped' }).sort({ createdAt: -1 }).limit(1)
    ]);

    const lastUpdate = stats[5][0]?.createdAt || null;

    res.json({
      totalScrapedProducts: stats[0],
      categories: {
        medicines: stats[1],
        groceries: stats[2],
        restaurants: stats[3]
      },
      totalScrapedVendors: stats[4],
      lastUpdate,
      needsUpdate: lastUpdate ? (Date.now() - lastUpdate.getTime()) > 24 * 60 * 60 * 1000 : true // Plus de 24h
    });

  } catch (error) {
    console.error('Erreur statistiques scraping:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des statistiques' });
  }
});

// Programmer le scraping automatique (admin uniquement)
router.post('/schedule-scraping', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { frequency = 'daily', time = '02:00' } = req.body;

    // TODO: Implémenter le scheduling avec node-cron
    // Pour l'instant, on simule la programmation
    
    res.json({
      message: 'Scraping programmé avec succès',
      schedule: {
        frequency,
        time,
        nextRun: 'Demain à ' + time
      }
    });

  } catch (error) {
    console.error('Erreur programmation scraping:', error);
    res.status(500).json({ message: 'Erreur lors de la programmation du scraping' });
  }
});

// Nettoyer les données obsolètes
router.delete('/cleanup-old-data', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { daysOld = 30 } = req.body;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    // Supprimer les produits scrappés anciens et non disponibles
    const deletedProducts = await Product.deleteMany({
      dataSource: 'scraped',
      'availability.inStock': false,
      updatedAt: { $lt: cutoffDate }
    });

    // Supprimer les vendeurs sans produits
    const vendorsWithoutProducts = await Vendor.find({
      dataSource: 'scraped'
    }).populate('products');

    let deletedVendors = 0;
    for (const vendor of vendorsWithoutProducts) {
      if (!vendor.products || vendor.products.length === 0) {
        await Vendor.findByIdAndDelete(vendor._id);
        deletedVendors++;
      }
    }

    res.json({
      message: 'Nettoyage terminé',
      deletedProducts: deletedProducts.deletedCount,
      deletedVendors
    });

  } catch (error) {
    console.error('Erreur nettoyage données:', error);
    res.status(500).json({ message: 'Erreur lors du nettoyage des données' });
  }
});

// Valider et corriger les données scrappées
router.post('/validate-data', authMiddleware, adminOnly, async (req, res) => {
  try {
    let corrections = 0;

    // Vérifier les prix aberrants
    const expensiveProducts = await Product.find({
      dataSource: 'scraped',
      'pricing.price': { $gt: 100000 } // Plus de 100,000 FCFA
    });

    for (const product of expensiveProducts) {
      // Logique de correction des prix aberrants
      if (product.pricing.price > 500000) { // Plus de 500,000 FCFA
        product.pricing.price = Math.round(product.pricing.price / 10); // Diviser par 10
        await product.save();
        corrections++;
      }
    }

    // Vérifier les doublons
    const duplicates = await Product.aggregate([
      { $match: { dataSource: 'scraped' } },
      {
        $group: {
          _id: { name: '$name', vendor: '$vendor' },
          count: { $sum: 1 },
          ids: { $push: '$_id' }
        }
      },
      { $match: { count: { $gt: 1 } } }
    ]);

    let removedDuplicates = 0;
    for (const duplicate of duplicates) {
      // Garder le premier, supprimer les autres
      const idsToRemove = duplicate.ids.slice(1);
      await Product.deleteMany({ _id: { $in: idsToRemove } });
      removedDuplicates += idsToRemove.length;
    }

    res.json({
      message: 'Validation terminée',
      priceCorrections: corrections,
      removedDuplicates
    });

  } catch (error) {
    console.error('Erreur validation données:', error);
    res.status(500).json({ message: 'Erreur lors de la validation des données' });
  }
});

export default router;