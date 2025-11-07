import express from 'express';
import Product from '../models/Product.js';
import Vendor from '../models/Vendor.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Obtenir tous les produits avec filtres et pagination
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      subcategory,
      search,
      minPrice,
      maxPrice,
      vendor,
      available = true,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      lat,
      lng,
      radius = 10000 // 10km par défaut
    } = req.query;

    // Construire le filtre
    const filter = {};
    
    if (category) filter.category = category;
    if (subcategory) filter.subcategory = subcategory;
    if (vendor) filter.vendor = vendor;
    if (available) filter.availability.inStock = true;
    
    if (minPrice || maxPrice) {
      filter.pricing = {};
      if (minPrice) filter['pricing.price'] = { $gte: parseFloat(minPrice) };
      if (maxPrice) {
        filter['pricing.price'] = { 
          ...filter['pricing.price'], 
          $lte: parseFloat(maxPrice) 
        };
      }
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'tags': { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Agrégation pour inclure les données du vendeur et filtrage géographique
    const pipeline = [
      { $match: filter },
      {
        $lookup: {
          from: 'vendors',
          localField: 'vendor',
          foreignField: '_id',
          as: 'vendorInfo'
        }
      },
      { $unwind: '$vendorInfo' }
    ];

    // Filtrage géographique si coordonnées fournies
    if (lat && lng) {
      pipeline.push({
        $match: {
          'vendorInfo.location.coordinates': {
            $near: {
              $geometry: {
                type: 'Point',
                coordinates: [parseFloat(lng), parseFloat(lat)]
              },
              $maxDistance: parseInt(radius)
            }
          }
        }
      });
    }

    // Tri
    const sortObj = {};
    sortObj[sortBy] = sortOrder === 'desc' ? -1 : 1;
    pipeline.push({ $sort: sortObj });

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: parseInt(limit) });

    // Projection pour optimiser la réponse
    pipeline.push({
      $project: {
        name: 1,
        description: 1,
        category: 1,
        subcategory: 1,
        images: { $slice: ['$images', 1] }, // Première image seulement
        pricing: 1,
        availability: 1,
        ratings: 1,
        tags: 1,
        createdAt: 1,
        'vendorInfo._id': 1,
        'vendorInfo.businessName': 1,
        'vendorInfo.location': 1,
        'vendorInfo.ratings.average': 1
      }
    });

    const products = await Product.aggregate(pipeline);

    // Compter le total pour la pagination
    const totalPipeline = [
      { $match: filter },
      {
        $lookup: {
          from: 'vendors',
          localField: 'vendor',
          foreignField: '_id',
          as: 'vendorInfo'
        }
      },
      { $unwind: '$vendorInfo' }
    ];

    if (lat && lng) {
      totalPipeline.push({
        $match: {
          'vendorInfo.location.coordinates': {
            $near: {
              $geometry: {
                type: 'Point',
                coordinates: [parseFloat(lng), parseFloat(lat)]
              },
              $maxDistance: parseInt(radius)
            }
          }
        }
      });
    }

    totalPipeline.push({ $count: 'total' });
    const totalResult = await Product.aggregate(totalPipeline);
    const total = totalResult[0]?.total || 0;

    res.json({
      products,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / parseInt(limit)),
        count: products.length,
        totalItems: total
      }
    });

  } catch (error) {
    console.error('Erreur récupération produits:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des produits' });
  }
});

// Obtenir un produit par ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('vendor', 'businessName location ratings phone deliveryInfo')
      .populate('reviews.user', 'firstName lastName');

    if (!product) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    res.json(product);

  } catch (error) {
    console.error('Erreur récupération produit:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération du produit' });
  }
});

// Recherche de produits similaires
router.get('/:id/similar', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    const similarProducts = await Product.find({
      _id: { $ne: product._id },
      $or: [
        { category: product.category },
        { subcategory: product.subcategory },
        { tags: { $in: product.tags } }
      ],
      'availability.inStock': true
    })
    .populate('vendor', 'businessName location ratings')
    .limit(10)
    .sort({ 'ratings.average': -1 });

    res.json(similarProducts);

  } catch (error) {
    console.error('Erreur produits similaires:', error);
    res.status(500).json({ message: 'Erreur lors de la recherche de produits similaires' });
  }
});

// Ajouter un produit (vendeur uniquement)
router.post('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.userType !== 'vendor') {
      return res.status(403).json({ message: 'Accès réservé aux vendeurs' });
    }

    const productData = {
      ...req.body,
      vendor: req.user.userId
    };

    const product = new Product(productData);
    await product.save();

    // Mettre à jour le nombre de produits du vendeur
    await Vendor.findByIdAndUpdate(req.user.userId, {
      $inc: { 'stats.totalProducts': 1 }
    });

    res.status(201).json({
      message: 'Produit créé avec succès',
      product
    });

  } catch (error) {
    console.error('Erreur création produit:', error);
    res.status(500).json({ message: 'Erreur lors de la création du produit' });
  }
});

// Mettre à jour un produit
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    // Vérifier que c'est le vendeur propriétaire
    if (req.user.userType !== 'vendor' || product.vendor.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Non autorisé' });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    ).populate('vendor', 'businessName location');

    res.json({
      message: 'Produit mis à jour avec succès',
      product: updatedProduct
    });

  } catch (error) {
    console.error('Erreur mise à jour produit:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du produit' });
  }
});

// Supprimer un produit
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    // Vérifier que c'est le vendeur propriétaire
    if (req.user.userType !== 'vendor' || product.vendor.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Non autorisé' });
    }

    await Product.findByIdAndDelete(req.params.id);

    // Mettre à jour le nombre de produits du vendeur
    await Vendor.findByIdAndUpdate(req.user.userId, {
      $inc: { 'stats.totalProducts': -1 }
    });

    res.json({ message: 'Produit supprimé avec succès' });

  } catch (error) {
    console.error('Erreur suppression produit:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression du produit' });
  }
});

// Ajouter un avis sur un produit
router.post('/:id/review', authMiddleware, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    // Vérifier si l'utilisateur a déjà donné un avis
    const existingReview = product.reviews.find(
      review => review.user.toString() === req.user.userId
    );

    if (existingReview) {
      return res.status(400).json({ message: 'Vous avez déjà évalué ce produit' });
    }

    // Ajouter l'avis
    product.reviews.push({
      user: req.user.userId,
      rating: parseInt(rating),
      comment,
      createdAt: new Date()
    });

    // Recalculer les statistiques de notation
    const totalRatings = product.reviews.length;
    const averageRating = product.reviews.reduce((sum, review) => sum + review.rating, 0) / totalRatings;

    product.ratings = {
      average: Math.round(averageRating * 10) / 10,
      count: totalRatings
    };

    await product.save();

    res.json({
      message: 'Avis ajouté avec succès',
      ratings: product.ratings
    });

  } catch (error) {
    console.error('Erreur ajout avis:', error);
    res.status(500).json({ message: 'Erreur lors de l\'ajout de l\'avis' });
  }
});

// Obtenir les catégories disponibles
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    const subcategories = await Product.distinct('subcategory');

    res.json({
      categories: categories.sort(),
      subcategories: subcategories.sort()
    });

  } catch (error) {
    console.error('Erreur récupération catégories:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des catégories' });
  }
});

export default router;