import { useCallback, useEffect, useState } from 'react';
import { Alert, Box, Button, Chip, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, IconButton, InputLabel, MenuItem, Paper, Select, Stack, Table, TableBody, TableCell, TableHead, TableRow, TextField, Tooltip, Typography } from '@mui/material';
import { AddPhotoAlternateOutlinedIcon, CategoryOutlinedIcon, DeleteOutlineIcon, EditOutlinedIcon } from '../../components/adminIcons.jsx';
import { api } from '../../api.js';
import { refreshCategories } from '../../hooks.js';
import { isAuthError } from './adminUtils.js';

function CategoryImagePreview({ src, file }) {
  const [preview, setPreview] = useState(src || '');
  useEffect(() => {
    if (!file) { setPreview(src || ''); return undefined; }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file, src]);
  return preview ? <Box sx={{ mt: 1 }}><img src={preview} alt="Category cover preview" style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 8 }} /></Box> : null;
}
export default function Categories({ token, onAuthError }) {
  const [tree, setTree] = useState([]);
  const [list, setList] = useState([]);
  const [form, setForm] = useState(null);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const roots = tree.filter((category) => !category.parent);

  const load = useCallback(async () => {
    try {
      const [categoryTree, result] = await Promise.all([
        api('/categories', { token }),
        api('/categories/admin?limit=100', { token }),
      ]);
      setTree(categoryTree);
      setList(result.items);
      setMessage('');
    } catch (requestError) {
      if (isAuthError(requestError)) onAuthError();
      setMessage(requestError.message);
    }
  }, [token, onAuthError]);

  useEffect(() => { load(); }, [load]);

  const save = async (event) => {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    try {
      const body = new FormData();
      ['name', 'slug', 'parent', 'description'].forEach((key) => body.append(key, form[key] || ''));
      body.append('order', String(Number(form.order) || 0));
      body.append('image', form.image || '');
      if (form.imageFile) body.append('image', form.imageFile);
      if (form._id) await api(`/categories/${form._id}`, { method: 'PUT', body, token });
      else await api('/categories', { method: 'POST', body, token });
      await refreshCategories();
      await load();
      setForm(null);
      setMessage('Category saved.');
    } catch (requestError) {
      if (isAuthError(requestError)) onAuthError();
      setMessage(requestError.message);
    } finally {
      setBusy(false);
    }
  };

  const remove = async (category) => {
    if (!window.confirm(`Delete "${category.name}"? Categories with products or subcategories cannot be deleted.`)) return;
    try {
      await api(`/categories/${category._id}`, { method: 'DELETE', token });
      await refreshCategories();
      await load();
      setMessage('Category deleted.');
    } catch (requestError) {
      if (isAuthError(requestError)) onAuthError();
      setMessage(requestError.message);
    }
  };

  const edit = (category) => setForm({
    _id: category._id, name: category.name, slug: category.slug,
    parent: category.parent?._id || category.parent || '',
    description: category.description || '', order: category.order || 0,
    image: category.image || '', imageFile: null,
  });

  return (
    <Stack spacing={2.5} className="admin-content">
      <Box className="admin-list-toolbar">
        <Box><Typography variant="h3">Catalogue structure</Typography><Typography className="admin-muted">Arrange ranges and subcategories. Product totals update from the catalogue.</Typography></Box>
        <Button variant="contained" startIcon={<CategoryOutlinedIcon />} onClick={() => setForm({ name: '', slug: '', parent: '', description: '', order: 0, image: '', imageFile: null })}>Add category</Button>
      </Box>
      {message && <Alert severity={/saved|deleted/i.test(message) ? 'success' : 'error'}>{message}</Alert>}
      <Paper className="admin-category-table" elevation={0}>
        <Table>
          <TableHead><TableRow><TableCell>Category</TableCell><TableCell>Parent range</TableCell><TableCell align="right">Products</TableCell><TableCell align="right">Actions</TableCell></TableRow></TableHead>
          <TableBody>
            {list.map((category) => (
              <TableRow key={category._id}>
                <TableCell><Typography className="admin-category-name">{category.name}</Typography><Typography className="admin-category-slug">/{category.slug}</Typography></TableCell>
                <TableCell>{category.parent ? roots.find((root) => root._id === String(category.parent))?.name || 'Parent range' : 'Top-level range'}</TableCell>
                <TableCell align="right"><Chip size="small" label={category.productCount} /></TableCell>
                <TableCell align="right">
                  <Tooltip title="Edit category"><IconButton aria-label={`Edit ${category.name}`} onClick={() => edit(category)}><EditOutlinedIcon /></IconButton></Tooltip>
                  <Tooltip title="Delete category"><span><IconButton color="error" aria-label={`Delete ${category.name}`} onClick={() => remove(category)}><DeleteOutlineIcon /></IconButton></span></Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {!list.length && <TableRow><TableCell colSpan={4}>{tree.length ? 'No categories are registered yet.' : 'Loading or unable to load categories.'}</TableCell></TableRow>}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={Boolean(form)} fullWidth maxWidth="sm" onClose={() => setForm(null)}>
        {form && <Box component="form" onSubmit={save}>
          <DialogTitle>{form._id ? 'Edit category' : 'Add a category'}</DialogTitle>
          <DialogContent className="admin-category-form">
            <TextField required label="Category name" inputProps={{ maxLength: 100 }} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
            <TextField label="URL slug" helperText="Leave empty to generate it from the name." inputProps={{ maxLength: 120 }} value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} />
            <FormControl>
              <InputLabel id="admin-parent-category">Parent category</InputLabel>
              <Select labelId="admin-parent-category" label="Parent category" value={form.parent} onChange={(event) => setForm({ ...form, parent: event.target.value })}>
                <MenuItem value="">No parent (top-level range)</MenuItem>
                {roots.filter((category) => category._id !== form._id).map((category) => <MenuItem value={category._id} key={category._id}>{category.name}</MenuItem>)}
              </Select>
            </FormControl>
            <TextField multiline minRows={3} label="Description" inputProps={{ maxLength: 1000 }} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
            <TextField type="number" label="Display order" inputProps={{ min: 0, max: 100000, step: 1 }} value={form.order} onChange={(event) => setForm({ ...form, order: event.target.value })} />
            <Box className="admin-upload-area">
              <Box><Typography variant="h3">Category cover image</Typography><Typography>Upload the image used on the public homepage. It will be stored in Cloudinary.</Typography></Box>
              <Button component="label" variant="outlined" startIcon={<AddPhotoAlternateOutlinedIcon />}>
                Choose image
                <input hidden type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={(event) => setForm({ ...form, imageFile: event.target.files?.[0] || null })} />
              </Button>
              {(form.image || form.imageFile) && <CategoryImagePreview src={form.image} file={form.imageFile} />}
            </Box>
          </DialogContent>
          <DialogActions><Button color="inherit" onClick={() => setForm(null)}>Cancel</Button><Button type="submit" variant="contained" disabled={busy}>{busy ? 'Saving…' : 'Save category'}</Button></DialogActions>
        </Box>}
      </Dialog>
    </Stack>
  );
}
