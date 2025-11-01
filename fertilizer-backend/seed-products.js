const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  category: String,
  image: String,
  stock: { type: Number, default: 100 },
  rating: { type: Number, default: 4 },
  reviewCount: { type: Number, default: 0 }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

const sampleProducts = [
  {
    name: 'NPK 19:19:19 Fertilizer (1 Kg)',
    description: 'Complete balanced fertilizer with equal proportions of Nitrogen, Phosphorus and Potassium. Ideal for all crops during vegetative growth stage.',
    price: 145.00,
    category: 'NPK',
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400',
    stock: 150,
    rating: 4.5,
    reviewCount: 45
  },
  {
    name: 'Urea Fertilizer (50 Kg Bag)',
    description: 'High nitrogen content fertilizer (46% N). Best for promoting leafy growth in crops. Water soluble and quick acting.',
    price: 850.00,
    category: 'Nitrogen',
    image: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=400',
    stock: 200,
    rating: 4.8,
    reviewCount: 120
  },
  {
    name: 'DAP (Di-Ammonium Phosphate) 50 Kg',
    description: 'Contains 18% Nitrogen and 46% Phosphorus. Excellent for root development and flowering. Suitable for all crops.',
    price: 1250.00,
    category: 'Phosphorus',
    image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=400',
    stock: 180,
    rating: 4.7,
    reviewCount: 89
  },
  {
    name: 'Potash (MOP) Fertilizer 25 Kg',
    description: 'Muriate of Potash with 60% K2O. Improves fruit quality, disease resistance and overall plant vigor.',
    price: 680.00,
    category: 'Potassium',
    image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400',
    stock: 120,
    rating: 4.6,
    reviewCount: 67
  },
  {
    name: 'Organic Vermicompost (40 Kg)',
    description: '100% organic fertilizer made from earthworm castings. Rich in nutrients and beneficial microorganisms. Improves soil structure.',
    price: 420.00,
    category: 'Organic',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400',
    stock: 95,
    rating: 4.9,
    reviewCount: 156
  },
  {
    name: 'Neem Cake Organic Fertilizer (20 Kg)',
    description: 'Natural pest repellent and organic fertilizer. Rich in NPK and acts as soil conditioner. Safe for all crops.',
    price: 380.00,
    category: 'Organic',
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400',
    stock: 110,
    rating: 4.7,
    reviewCount: 92
  },
  {
    name: 'Calcium Nitrate Fertilizer (5 Kg)',
    description: 'Water soluble fertilizer providing Calcium and Nitrogen. Prevents blossom end rot in tomatoes and peppers.',
    price: 285.00,
    category: 'Micronutrients',
    image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400',
    stock: 75,
    rating: 4.4,
    reviewCount: 34
  },
  {
    name: 'Zinc Sulphate Fertilizer (1 Kg)',
    description: 'Essential micronutrient for enzyme activation. Prevents zinc deficiency in crops. Suitable for foliar and soil application.',
    price: 95.00,
    category: 'Micronutrients',
    image: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=400',
    stock: 140,
    rating: 4.5,
    reviewCount: 56
  },
  {
    name: 'Humic Acid Granules (5 Kg)',
    description: 'Improves nutrient uptake and soil structure. Enhances root development and increases crop yield naturally.',
    price: 520.00,
    category: 'Specialty',
    image: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400',
    stock: 88,
    rating: 4.6,
    reviewCount: 41
  },
  {
    name: 'Seaweed Extract Liquid (1 Liter)',
    description: 'Natural growth stimulant rich in plant hormones and trace elements. Improves stress tolerance and yield.',
    price: 450.00,
    category: 'Specialty',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400',
    stock: 65,
    rating: 4.8,
    reviewCount: 78
  },
  {
    name: 'Sulphur 90% WDG (1 Kg)',
    description: 'Water dispersible granules for sulphur deficiency correction. Also acts as fungicide. Safe for organic farming.',
    price: 125.00,
    category: 'Micronutrients',
    image: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?w=400',
    stock: 130,
    rating: 4.3,
    reviewCount: 29
  },
  {
    name: 'Bone Meal Organic Fertilizer (10 Kg)',
    description: 'Slow release phosphorus source. Excellent for flowering plants and root crops. 100% organic and safe.',
    price: 340.00,
    category: 'Organic',
    image: 'https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?w=400',
    stock: 72,
    rating: 4.7,
    reviewCount: 63
  },
  {
    name: 'Magnesium Sulphate (Epsom Salt) 5 Kg',
    description: 'Provides Magnesium and Sulphur. Essential for chlorophyll production. Prevents yellowing of leaves.',
    price: 180.00,
    category: 'Micronutrients',
    image: 'https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?w=400',
    stock: 105,
    rating: 4.6,
    reviewCount: 51
  },
  {
    name: 'NPK 12:32:16 Fertilizer (25 Kg)',
    description: 'High phosphorus formula for flowering and fruiting stage. Promotes strong root system and better yields.',
    price: 890.00,
    category: 'NPK',
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400',
    stock: 92,
    rating: 4.5,
    reviewCount: 38
  },
  {
    name: 'Chelated Iron EDTA (500g)',
    description: 'Highly effective iron supplement for plants. Prevents and cures iron chlorosis. Water soluble.',
    price: 220.00,
    category: 'Micronutrients',
    image: 'https://images.unsplash.com/photo-1617791160505-6f00504e3519?w=400',
    stock: 58,
    rating: 4.7,
    reviewCount: 44
  },
  {
    name: 'Compost Manure (50 Kg Bag)',
    description: 'Well decomposed organic matter. Improves soil fertility and water retention. Rich in beneficial microbes.',
    price: 280.00,
    category: 'Organic',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400',
    stock: 145,
    rating: 4.8,
    reviewCount: 112
  }
];

async function seedProducts() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'fertilizer'
    });

    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert sample products
    const inserted = await Product.insertMany(sampleProducts);
    console.log(`✅ Successfully inserted ${inserted.length} products!`);

    console.log('\nSample products:');
    inserted.slice(0, 3).forEach(product => {
      console.log(`- ${product.name} - ₹${product.price}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
}

seedProducts();
