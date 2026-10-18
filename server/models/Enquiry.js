import mongoose from 'mongoose';

const enquirySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  phone: { type: String, required: true, trim: true, maxlength: 30 },
  email: { type: String, trim: true, default: '', maxlength: 120 },
  business: { type: String, default: '', maxlength: 120 },
  message: { type: String, default: '', maxlength: 3000 },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: { type: String, required: true, maxlength: 200 },
    qty: { type: Number, min: 1, max: 9999, default: 1 },
  }],
  status: { type: String, enum: ['new', 'quoted', 'closed'], default: 'new' },
}, { timestamps: true });

enquirySchema.index({ status: 1, createdAt: -1 });

const Enquiry = mongoose.model('Enquiry', enquirySchema);

export default Enquiry;
