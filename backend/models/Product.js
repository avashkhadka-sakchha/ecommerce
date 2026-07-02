import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  author: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  date: { type: String, default: () => new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) }
});

const productSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  tag: { type: String },
  brand: { type: String, required: true },
  image: { type: String, required: true },
  images: [{ type: String }],
  desc: { type: String, required: true },
  specs: { type: Map, of: String, default: {} },
  reviewsList: [reviewSchema]
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
export default Product;
