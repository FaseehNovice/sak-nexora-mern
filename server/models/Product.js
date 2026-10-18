import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 160 },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 180 },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
  type: { type: String, default: '', maxlength: 100 },
  finish: { type: String, default: '', maxlength: 60 },
  images: { type: [String], validate: [(images) => images.length <= 12, 'A product can have no more than 12 images.'] },
  description: { type: String, default: '', maxlength: 3000 },
  featured: { type: Boolean, default: false },
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

export default Product;
