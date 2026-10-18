import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Box, Button, CircularProgress, InputAdornment, Pagination, Paper, Stack, TextField, Typography } from '@mui/material';
import { AddPhotoAlternateOutlinedIcon, Inventory2OutlinedIcon, SearchOutlinedIcon } from '../../components/adminIcons.jsx';
import { api, qs } from '../../api.js';
import { isAuthError } from './adminUtils.js';
import { emptyProduct, MAX_PRODUCT_IMAGES } from './constants.js';
import ProductTile from './components/ProductTile.jsx';
import ProductDialog from './components/ProductDialog.jsx';

export default function Products({ token, onAuthError }) {
  const [categories, setCategories] = useState([]);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [list, setList] = useState({ items: [], pages: 1, total: 0 });
  const [form, setForm] = useState(null);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  const leafCategories = useMemo(() => categories.flatMap((category) => (
    category.children?.length
      ? category.children.map((child) => ({ ...child, label: `${category.name} / ${child.name}` }))
      : [{ ...category, label: category.name }]
  )), [categories]);

  const handleError = useCallback((requestError) => {
    if (isAuthError(requestError)) onAuthError();
    setMessage(requestError.message);
  }, [onAuthError]);

  const loadCategories = useCallback(async () => {
    try {
      const result = await api('/categories', { token });
      setCategories(result);
    } catch (requestError) {
      handleError(requestError);
    }
  }, [token, handleError]);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const result = await api(`/products${qs({ q: query, page, limit: 12 })}`, { token });
      setList(result);
      setMessage('');
    } catch (requestError) {
      handleError(requestError);
    } finally {
      setLoading(false);
    }
  }, [token, query, page, handleError]);

  useEffect(() => { loadCategories(); }, [loadCategories]);
  useEffect(() => { loadProducts(); }, [loadProducts]);

  const save = async (event) => {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setMessage('');
    const body = new FormData();
    ['name', 'slug', 'category', 'type', 'finish', 'description'].forEach((key) => body.append(key, form[key] || ''));
    body.append('featured', String(form.featured));
    body.append('existingImages', JSON.stringify(form.images));
    form.newImages.forEach((file) => body.append('images', file));
    try {
      const result = form._id
        ? await api(`/products/${form._id}`, { method: 'PUT', body, token })
        : await api('/products', { method: 'POST', body, token });
      setForm(null);
      await loadProducts();
      await loadCategories();
      setMessage(result.mediaCleanupWarning || 'Product saved.');
    } catch (requestError) {
      handleError(requestError);
    } finally {
      setBusy(false);
    }
  };

  const remove = async (product) => {
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    try {
      const result = await api(`/products/${product._id}`, { method: 'DELETE', token });
      await loadProducts();
      await loadCategories();
      setMessage(result.warning || 'Product deleted.');
    } catch (requestError) {
      handleError(requestError);
    }
  };

  const edit = (product) => setForm({
    ...product,
    category: product.category?._id || product.category,
    images: product.images || [],
    newImages: [],
  });

  const selectImages = (event) => {
    const picked = Array.from(event.target.files || []);
    event.target.value = '';
    const available = Math.max(0, MAX_PRODUCT_IMAGES - form.images.length - form.newImages.length);
    setMessage(picked.length > available ? `A product can have no more than ${MAX_PRODUCT_IMAGES} images.` : '');
    setForm((current) => ({ ...current, newImages: [...current.newImages, ...picked.slice(0, available)] }));
  };

  return (
    <Stack spacing={2.5} className="admin-content">
      <Box className="admin-list-toolbar">
        <TextField
          className="admin-product-search" size="small" placeholder="Search product name or finish"
          value={query} onChange={(event) => { setPage(1); setQuery(event.target.value); }}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchOutlinedIcon fontSize="small" /></InputAdornment> }}
          inputProps={{ 'aria-label': 'Search products' }}
        />
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
          <Typography className="admin-muted">{list.total} products</Typography>
          <Button variant="contained" startIcon={<AddPhotoAlternateOutlinedIcon />}
            disabled={!leafCategories.length}
            onClick={() => setForm({ ...emptyProduct, category: leafCategories[0]?._id || '' })}>
            Add product
          </Button>
        </Stack>
      </Box>
      {message && <Alert severity={/saved|deleted/i.test(message) ? 'success' : 'error'}>{message}</Alert>}
      {!leafCategories.length && <Alert severity="warning">Create a catalogue category before adding products.</Alert>}

      {loading ? <Box className="admin-loading"><CircularProgress /></Box> : list.items.length ? (
        <Box className="admin-product-grid">
          {list.items.map((product) => (
            <ProductTile key={product._id} product={product} onEdit={() => edit(product)} onDelete={() => remove(product)} />
          ))}
        </Box>
      ) : <Paper className="admin-empty" elevation={0}>
        <Inventory2OutlinedIcon />
        <Typography variant="h3">{query ? 'No matching products' : 'Your catalogue is ready to fill'}</Typography>
        <Typography>{query ? 'Try another search term.' : 'Add your first product, choose its range and upload the images shown on your storefront.'}</Typography>
        {!query && <Button variant="contained" onClick={() => setForm({ ...emptyProduct, category: leafCategories[0]?._id || '' })}>Add first product</Button>}
      </Paper>}

      {list.pages > 1 && <Box className="admin-pagination"><Pagination count={list.pages} page={page} onChange={(_, nextPage) => setPage(nextPage)} color="primary" /></Box>}

      <ProductDialog
        form={form} categories={leafCategories} busy={busy} onClose={() => setForm(null)}
        onChange={setForm} onSave={save} onAddImages={selectImages}
      />
    </Stack>
  );
}




