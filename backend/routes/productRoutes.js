import express from 'express';
import Product from '../models/Product.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Get all products (with search/filters/sort)
// @route   GET /api/products
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { categories, brands, priceMax, search, sort } = req.query;
    let query = {};

    // 1. Search filter
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { name: searchRegex },
        { desc: searchRegex },
        { category: searchRegex }
      ];
    }

    // 2. Categories filter (comma separated, e.g. categories=Phone Cases,Chargers)
    if (categories) {
      const categoryList = categories.split(',');
      query.category = { $in: categoryList };
    }

    // 3. Brands filter (comma separated, e.g. brands=Spigen,Anker)
    if (brands) {
      const brandList = brands.split(',');
      query.brand = { $in: brandList };
    }

    // 4. Price Max filter
    if (priceMax) {
      query.price = { $lte: parseFloat(priceMax) };
    }

    let productsQuery = Product.find(query);

    // 5. Sorting
    if (sort) {
      if (sort === 'Price: Low to High') {
        productsQuery = productsQuery.sort({ price: 1 });
      } else if (sort === 'Price: High to Low') {
        productsQuery = productsQuery.sort({ price: -1 });
      } else if (sort === 'Top Rated') {
        productsQuery = productsQuery.sort({ rating: -1 });
      }
    }

    const products = await productsQuery.exec();
    res.json(products);
  } catch (error) {
    console.error('Fetch products error:', error);
    res.status(500).json({ message: 'Server error, failed to fetch products' });
  }
});

// @desc    Get products uploaded by the logged-in user
// @route   GET /api/products/my
// @access  Private/Manager,Admin
router.get('/my', protect, authorize('manager', 'admin'), async (req, res) => {
  try {
    const products = await Product.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error('Fetch my products error:', error);
    res.status(500).json({ message: 'Server error, failed to fetch your products' });
  }
});

// @desc    Get single product by custom id
// @route   GET /api/products/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ id: req.params.id });

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error('Fetch product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Manager,Admin
router.post('/', protect, authorize('manager', 'admin'), async (req, res) => {
  try {
    const { name, category, price, originalPrice, tag, brand, image, images, desc, specs } = req.body;

    // Generate unique custom id (string integer based on timestamp)
    const id = Date.now().toString();

    const product = new Product({
      id,
      createdBy: req.user._id,
      name,
      category,
      price: parseFloat(price),
      originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
      tag: tag || '',
      brand,
      image,
      images: images || [image],
      desc,
      specs: specs || {},
      reviewsList: []
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Server error, failed to create product' });
  }
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Manager,Admin (only owner or admin)
router.put('/:id', protect, authorize('manager', 'admin'), async (req, res) => {
  try {
    const { name, category, price, originalPrice, tag, brand, image, images, desc, specs } = req.body;

    const product = await Product.findOne({ id: req.params.id });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Ownership check: only the creator or an admin can edit
    if (product.createdBy && product.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You can only edit products you uploaded' });
    }

    product.name = name || product.name;
    product.category = category || product.category;
    product.price = price !== undefined ? parseFloat(price) : product.price;
    product.originalPrice = originalPrice !== undefined ? parseFloat(originalPrice) : product.originalPrice;
    product.tag = tag !== undefined ? tag : product.tag;
    product.brand = brand || product.brand;
    product.image = image || product.image;
    product.images = images || product.images;
    product.desc = desc || product.desc;
    product.specs = specs || product.specs;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Server error, failed to update product' });
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Manager,Admin (only owner or admin)
router.delete('/:id', protect, authorize('manager', 'admin'), async (req, res) => {
  try {
    const product = await Product.findOne({ id: req.params.id });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Ownership check: only the creator or an admin can delete
    if (product.createdBy && product.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You can only delete products you uploaded' });
    }

    await Product.findOneAndDelete({ id: req.params.id });
    res.json({ message: 'Product removed' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error, failed to delete product' });
  }
});

export default router;
