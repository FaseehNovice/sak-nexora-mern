import * as categoriesService from '../services/categories.service.js';

export async function listCategories(_req, res, next) {
  try {
    res.json(await categoriesService.listCategories());
  } catch (error) {
    next(error);
  }
}

export async function listAdminCategories(req, res, next) {
  try {
    res.json(await categoriesService.listAdminCategories(req.query));
  } catch (error) {
    next(error);
  }
}

export async function createCategory(req, res, next) {
  try {
    res.status(201).json(await categoriesService.createCategory(req.body));
  } catch (error) {
    next(error);
  }
}

export async function updateCategory(req, res, next) {
  try {
    const category = await categoriesService.updateCategory(req.params.id, req.body);
    if (!category) return res.status(404).json({ message: 'Category not found.' });
    res.json(category);
  } catch (error) {
    next(error);
  }
}

export async function deleteCategory(req, res, next) {
  try {
    const result = await categoriesService.deleteCategory(req.params.id);
    if (!result) return res.status(404).json({ message: 'Category not found.' });
    if (result.conflict) return res.status(409).json({ message: result.conflict });
    res.json(result);
  } catch (error) {
    next(error);
  }
}
