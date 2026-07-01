import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';

dotenv.config();

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

async function seedDB() {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mobilehub';
  console.log(`Connecting to MongoDB at ${mongoURI}...`);
  
  try {
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB.');
    
    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products.');
    
    // Seed products
    const inserted = await Product.insertMany(MOCK_PRODUCTS);
    console.log(`Successfully seeded ${inserted.length} products!`);
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed.');
  }
}

seedDB();
