import * as productsService from '../services/products.service.js';

export async function listProductFilters(req, res, next) {
  try {
    res.json(await productsService.listProductFilters(req.query));
  } catch (error) {
    next(error);
  }
}

export async function listProducts(req, res, next) {
  try {
    res.json(await productsService.listProducts(req.query));
  } catch (error) {
    next(error);
  }
}

export async function getProduct(req, res, next) {
  try {
    const product = await productsService.getProduct(req.params.slug);
    if (!product) return res.status(404).json({ message: 'That product could not be found.' });
    res.json(product);
  } catch (error) {
    next(error);
  }
}

export async function createProduct(req, res, next) {
  try {
    const product = await productsService.createProduct(
      req.body,
      req.files || [],
      req.is('multipart/form-data'),
    );
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
}

export async function updateProduct(req, res, next) {
  try {
    const product = await productsService.updateProduct(
      req.params.id,
      req.body,
      req.files || [],
      req.is('multipart/form-data'),
    );
    if (!product) return res.status(404).json({ message: 'Product not found.' });
    res.json(product);
  } catch (error) {
    next(error);
  }
}

export async function deleteProduct(req, res, next) {
  try {
    const result = await productsService.deleteProduct(req.params.id);
    if (!result) return res.status(404).json({ message: 'Product not found.' });
    res.json(result);
  } catch (error) {
    next(error);
  }
}
