import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 120 },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
  description: { type: String, default: '', maxlength: 1000 },
  image: { type: String, default: '', maxlength: 2048 },
  order: { type: Number, default: 0, min: 0, max: 100000 },
});

const Category = mongoose.model('Category', categorySchema);

export default Category;
