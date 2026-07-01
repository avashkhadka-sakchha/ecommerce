/**
 * api.js - E-commerce API abstraction layer.
 * 
 * To connect to your Node.js + Express + MongoDB backend:
 * 1. Set `USE_BACKEND = true` below.
 * 2. Configure your API base URL (e.g. http://localhost:5000/api).
 * 3. Make sure your backend implements the corresponding API endpoints:
 *    - GET /api/products (supports query params: categories, brands, priceMin, priceMax, search, sort)
 *    - GET /api/products/:id (returns details of a specific product)
 *    - POST /api/orders (places a new order, stores in DB)
 *    - GET /api/orders (gets order history)
 *    - GET /api/profile (gets user profile information)
 *    - PUT /api/profile (updates profile information)
 */

const USE_BACKEND = false; // Set to true when backend is ready!
const API_BASE_URL = 'http://localhost:5000/api';

// --- MOCK DATABASE (USED WHEN USE_BACKEND IS FALSE) ---
const MOCK_PRODUCTS = [
  { 
    id: '1', 
    name: 'ProTouch Silicone Case — Midnight Blue', 
    category: 'Phone Cases', 
    price: 29.99, 
    originalPrice: 39.99, 
    rating: 4.5, 
    reviews: 124, 
    tag: 'NEW', 
    brand: 'Spigen',
    image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500&auto=format&fit=crop&q=70',
    images: [
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=700&auto=format&fit=crop&q=70',
      'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=700&auto=format&fit=crop&q=70',
      'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=700&auto=format&fit=crop&q=70'
    ],
    desc: 'Crafted from premium liquid silicone, this ProTouch case offers an exceptionally soft grip while delivering robust drop protection. Compatible with MagSafe accessories.',
    specs: {
      'Material': 'Liquid Silicone & Microfiber lining',
      'Compatibility': 'iPhone 15 Pro & Pro Max',
      'MagSafe': 'Yes, built-in N52 magnets',
      'Weight': '32g'
    },
    reviewsList: [
      { author: 'Sujal K.', rating: 5, comment: 'Perfect fit! The grip is wonderful and it feels very premium.', date: 'June 12, 2026' },
      { author: 'Niranjan P.', rating: 4, comment: 'Good case, collects a bit of lint but cleans easily.', date: 'May 28, 2026' }
    ]
  },
  { 
    id: '2', 
    name: 'UltraCharge 65W GaN Wall Charger', 
    category: 'Chargers', 
    price: 45.00, 
    rating: 4.8, 
    reviews: 89, 
    brand: 'Anker',
    image: 'https://images.unsplash.com/photo-1622445262465-2481c4574875?w=500&auto=format&fit=crop&q=70',
    images: [
      'https://images.unsplash.com/photo-1622445262465-2481c4574875?w=700&auto=format&fit=crop&q=70',
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=700&auto=format&fit=crop&q=70'
    ],
    desc: 'High-speed GaN (Gallium Nitride) wall charger capable of delivering 65W of power. Includes dual USB-C ports and one USB-A port for simultaneous charging.',
    specs: {
      'Output': '65W Max',
      'Technology': 'GaN (Gallium Nitride)',
      'Ports': '2x USB-C, 1x USB-A',
      'Plug Type': 'US Standard'
    },
    reviewsList: [
      { author: 'Rojan D.', rating: 5, comment: 'Charges my laptop and phone fast. Highly recommend.', date: 'June 18, 2026' }
    ]
  },
  { 
    id: '3', 
    name: 'AuraPods Pro Noise Cancelling Buds', 
    category: 'Earphones', 
    price: 129.99, 
    originalPrice: 159.99, 
    rating: 4.7, 
    reviews: 432, 
    tag: 'SALE', 
    brand: 'Belkin',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop&q=70',
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=700&auto=format&fit=crop&q=70',
      'https://images.unsplash.com/photo-1608156639585-b3a032ef9689?w=700&auto=format&fit=crop&q=70',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=700&auto=format&fit=crop&q=70'
    ],
    desc: 'Experience pure sound clarity with active noise cancellation and 36-hour total battery life. Designed for those who demand premium audio in a minimalist form factor.',
    specs: {
      'Drivers': '11mm custom-tuned',
      'ANC': 'Up to 40dB reduction',
      'Battery Life': '36 hours (with case)',
      'Bluetooth': 'v5.3'
    },
    reviewsList: [
      { author: 'Aayush T.', rating: 5, comment: 'Sound quality is superb, ANC works great in local buses.', date: 'June 20, 2026' }
    ]
  },
  { 
    id: '4', 
    name: 'TitanGlass Screen Protector 2-Pack', 
    category: 'Protectors', 
    price: 19.50, 
    rating: 4.6, 
    reviews: 210, 
    brand: 'Baseus',
    image: 'https://images.unsplash.com/photo-1605152276897-4f618f831968?w=500&auto=format&fit=crop&q=70',
    images: [
      'https://images.unsplash.com/photo-1605152276897-4f618f831968?w=700&auto=format&fit=crop&q=70'
    ],
    desc: 'Ultra-tough 9H tempered glass protector with edge-to-edge fit. Oleophobic coating protects against fingerprints and smudges.',
    specs: {
      'Hardness': '9H Tempered Glass',
      'Thickness': '0.33mm',
      'Package': 'Contains 2 protectors, alignment frame',
      'Features': 'Anti-fingerprint, bubble-free'
    },
    reviewsList: [
      { author: 'Pooja S.', rating: 4, comment: 'Easy to install with the included frame. Crystal clear.', date: 'May 10, 2026' }
    ]
  },
  { 
    id: '5', 
    name: 'PowerVault 20,000mAh Power Bank', 
    category: 'Power Banks', 
    price: 54.99, 
    rating: 4.9, 
    reviews: 156, 
    tag: 'NEW', 
    brand: 'Baseus',
    image: 'https://images.unsplash.com/photo-1609592424109-dd9892f1b17c?w=500&auto=format&fit=crop&q=70',
    images: [
      'https://images.unsplash.com/photo-1609592424109-dd9892f1b17c?w=700&auto=format&fit=crop&q=70'
    ],
    desc: '20,000mAh high capacity portable power source supporting 22.5W fast charging. Features digital display status indicators.',
    specs: {
      'Capacity': '20,000mAh',
      'Max Output': '22.5W PD Fast Charge',
      'Ports': '2x USB-A, 1x USB-C (Bidirectional)',
      'Weight': '380g'
    },
    reviewsList: [
      { author: 'Manish R.', rating: 5, comment: 'Excellent battery backup. Lasts for 3-4 charges on my phone.', date: 'June 05, 2026' }
    ]
  },
  { 
    id: '6', 
    name: 'Braided USB-C to Lightning Cable', 
    category: 'Cables', 
    price: 24.00, 
    rating: 4.4, 
    reviews: 340, 
    brand: 'Anker',
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500&auto=format&fit=crop&q=70',
    images: [
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=700&auto=format&fit=crop&q=70'
    ],
    desc: 'Durable double-braided nylon charging cord with Apple MFi certification. Reinforced connectors resist bending and breakage.',
    specs: {
      'Length': '1.8m (6ft)',
      'Connectors': 'USB-C to Lightning',
      'Material': 'Double-braided Nylon',
      'Certification': 'Apple MFi'
    },
    reviewsList: [
      { author: 'Karan A.', rating: 4, comment: 'Sturdy build quality. Fits perfectly with any bumper case.', date: 'April 14, 2026' }
    ]
  },
  { 
    id: '7', 
    name: 'EcoLeather MagSafe Wallet — Saddle', 
    category: 'Accessories', 
    price: 39.00, 
    rating: 4.3, 
    reviews: 88, 
    brand: 'Native Union',
    image: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=500&auto=format&fit=crop&q=70',
    images: [
      'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=700&auto=format&fit=crop&q=70'
    ],
    desc: 'Eco-conscious vegan leather wallet crafted with strong built-in magnets. Conveniently holds up to 3 credit cards securely.',
    specs: {
      'Material': 'Vegan EcoLeather',
      'Capacity': '3 Cards Max',
      'Magnet Strength': 'Double-strength N52',
      'Shielding': 'RFID Protected'
    },
    reviewsList: [
      { author: 'Rita B.', rating: 4, comment: 'Strong magnet, hasn’t slipped off yet. Color looks beautiful.', date: 'May 30, 2026' }
    ]
  },
  { 
    id: '8', 
    name: 'SwiftMount Magnetic Car Holder', 
    category: 'Accessories', 
    price: 32.50, 
    rating: 4.5, 
    reviews: 112, 
    brand: 'Spigen',
    image: 'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=500&auto=format&fit=crop&q=70',
    images: [
      'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=700&auto=format&fit=crop&q=70'
    ],
    desc: 'Dashboard/air vent mount featuring ultra-strong magnets to hold your phone securely in place even on bumpy roads.',
    specs: {
      'Mount Type': 'Vent/Dash (2-in-1)',
      'Rotation': '360 degree ball joint',
      'Magnets': '6x N50 Neodymium',
      'Material': 'PC/ABS with Silicone face'
    },
    reviewsList: [
      { author: 'Deepak G.', rating: 5, comment: 'Holds my massive phone without any issues. Easy setup.', date: 'June 01, 2026' }
    ]
  }
];

// Helper to simulate network latency
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  /**
   * Fetch all products based on filter query parameters
   * @param {Object} filters
   * @param {Array<string>} filters.categories
   * @param {Array<string>} filters.brands
   * @param {number} filters.priceMax
   * @param {string} filters.search
   * @param {string} filters.sort
   */
  async getProducts(filters = {}) {
    if (USE_BACKEND) {
      const queryParams = new URLSearchParams();
      if (filters.categories && filters.categories.length) {
        queryParams.append('categories', filters.categories.join(','));
      }
      if (filters.brands && filters.brands.length) {
        queryParams.append('brands', filters.brands.join(','));
      }
      if (filters.priceMax) {
        queryParams.append('priceMax', filters.priceMax);
      }
      if (filters.search) {
        queryParams.append('search', filters.search);
      }
      if (filters.sort) {
        queryParams.append('sort', filters.sort);
      }

      const response = await fetch(`${API_BASE_URL}/products?${queryParams.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch products');
      return await response.json();
    } else {
      await delay(150); // Simulate network latency
      let products = [...MOCK_PRODUCTS];

      // 1. Search Query Filter
      if (filters.search) {
        const q = filters.search.toLowerCase();
        products = products.filter(p => 
          p.name.toLowerCase().includes(q) || 
          p.desc.toLowerCase().includes(q) || 
          p.category.toLowerCase().includes(q)
        );
      }

      // 2. Categories Filter
      if (filters.categories && filters.categories.length > 0) {
        products = products.filter(p => filters.categories.includes(p.category));
      }

      // 3. Brands Filter
      if (filters.brands && filters.brands.length > 0) {
        products = products.filter(p => filters.brands.includes(p.brand));
      }

      // 4. Price Max Filter
      if (filters.priceMax) {
        products = products.filter(p => p.price <= parseFloat(filters.priceMax));
      }

      // 5. Sorting
      if (filters.sort) {
        if (filters.sort === 'Price: Low to High') {
          products.sort((a, b) => a.price - b.price);
        } else if (filters.sort === 'Price: High to Low') {
          products.sort((a, b) => b.price - a.price);
        } else if (filters.sort === 'Top Rated') {
          products.sort((a, b) => b.rating - a.rating);
        }
      }

      return products;
    }
  },

  /**
   * Fetch a single product detail
   * @param {string} id 
   */
  async getProductById(id) {
    if (USE_BACKEND) {
      const response = await fetch(`${API_BASE_URL}/products/${id}`);
      if (!response.ok) throw new Error('Product not found');
      return await response.json();
    } else {
      await delay(100);
      const product = MOCK_PRODUCTS.find(p => p.id === id);
      if (!product) throw new Error('Product not found');
      return product;
    }
  },

  /**
   * Place a new order
   * @param {Object} orderData 
   */
  async placeOrder(orderData) {
    if (USE_BACKEND) {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      if (!response.ok) throw new Error('Failed to place order');
      return await response.json();
    } else {
      await delay(200);
      const newOrder = {
        ...orderData,
        id: `#MH-${Math.floor(10000 + Math.random() * 90000)}`,
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
        status: 'Processing'
      };
      
      // Save locally to simulate backend persistence
      const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      savedOrders.unshift(newOrder);
      localStorage.setItem('orders', JSON.stringify(savedOrders));
      
      return newOrder;
    }
  },

  /**
   * Get order history
   */
  async getOrders() {
    if (USE_BACKEND) {
      const response = await fetch(`${API_BASE_URL}/orders`);
      if (!response.ok) throw new Error('Failed to fetch orders');
      return await response.json();
    } else {
      await delay(150);
      const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      if (savedOrders.length === 0) {
        // Seed default orders if none exist
        const seed = [
          { id: '#MH-28471', date: 'May 20, 2026', status: 'Delivered', total: 84.49, itemsCount: 2, items: [] },
          { id: '#MH-28201', date: 'May 10, 2026', status: 'Processing', total: 54.99, itemsCount: 1, items: [] }
        ];
        localStorage.setItem('orders', JSON.stringify(seed));
        return seed;
      }
      return savedOrders;
    }
  },

  /**
   * Get user profile
   */
  async getProfile() {
    if (USE_BACKEND) {
      const response = await fetch(`${API_BASE_URL}/profile`);
      if (!response.ok) throw new Error('Failed to fetch profile');
      return await response.json();
    } else {
      await delay(100);
      const profile = JSON.parse(localStorage.getItem('profile'));
      if (!profile) {
        const seedProfile = {
          firstName: 'Alex',
          lastName: 'Johnson',
          email: 'alex.johnson@example.com',
          phone: '+977 98XXXXXXXX',
          membership: 'Premium Member',
          addresses: [
            { id: 'addr-1', name: 'Home', isDefault: true, street: 'Thamel, Kathmandu', province: 'Bagmati Province, Nepal' }
          ]
        };
        localStorage.setItem('profile', JSON.stringify(seedProfile));
        return seedProfile;
      }
      return profile;
    }
  },

  /**
   * Update user profile
   * @param {Object} updatedProfile 
   */
  async updateProfile(updatedProfile) {
    if (USE_BACKEND) {
      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProfile)
      });
      if (!response.ok) throw new Error('Failed to update profile');
      return await response.json();
    } else {
      await delay(200);
      localStorage.setItem('profile', JSON.stringify(updatedProfile));
      return updatedProfile;
    }
  }
};
