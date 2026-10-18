import mongoose from 'mongoose';

export default function errorHandler(err, req, res, next) {
  console.error(err);
  if (res.headersSent) return next(err);
  if (err.name === 'MulterError') {
    const status = err.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
    const message = err.code === 'LIMIT_FILE_SIZE'
      ? 'Each product image must be 8 MB or smaller.'
      : `Product image upload rejected (${err.code}). Add up to 12 images per product.`;
    return res.status(status).json({ message });
  }
  if (err.type === 'entity.parse.failed') return res.status(400).json({ message: 'The request body must contain valid JSON.' });
  if (err.type === 'entity.too.large') return res.status(413).json({ message: 'The request body is too large.' });
  if (err.statusCode && err.statusCode >= 400 && err.statusCode < 600) {
    return res.status(err.statusCode).json({ message: err.message });
  }
  if (err.code === 11000) return res.status(409).json({ message: 'An item with that slug already exists.' });
  if (err.name === 'ValidationError') return res.status(400).json({ message: Object.values(err.errors)[0].message });
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ message: 'MongoDB is unavailable. Check the server connection and database access, then try again.' });
  }
  res.status(500).json({ message: 'Something went wrong on our side. Try again.' });
}
