import { useEffect, useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, IconButton, InputLabel, MenuItem, Select, Switch, TextField, Typography } from '@mui/material';
import { AddPhotoAlternateOutlinedIcon, DeleteOutlineIcon } from '../../../components/adminIcons.jsx';
import { MAX_PRODUCT_IMAGES } from '../constants.js';

export default function ProductDialog({ form, categories, busy, onClose, onChange, onSave, onAddImages }) {
  if (!form) return null;
  const update = (key, value) => onChange((current) => ({ ...current, [key]: value }));
  const removeExisting = (index) => update('images', form.images.filter((_, imageIndex) => imageIndex !== index));
  const removeNew = (index) => update('newImages', form.newImages.filter((_, imageIndex) => imageIndex !== index));

  return (
    <Dialog open fullWidth maxWidth="md" onClose={onClose} className="admin-dialog">
      <Box component="form" onSubmit={onSave}>
        <DialogTitle>{form._id ? 'Edit product' : 'Add a product'}<Typography component="p">Product details flow directly to the public catalogue.</Typography></DialogTitle>
        <DialogContent dividers>
          <Box className="admin-product-form-grid">
            <TextField required label="Product name" value={form.name} onChange={(event) => update('name', event.target.value)} />
            <TextField label="URL slug" helperText="Leave empty to generate it from the product name." value={form.slug} onChange={(event) => update('slug', event.target.value)} />
            <FormControl required>
              <InputLabel id="admin-product-category">Category</InputLabel>
              <Select labelId="admin-product-category" label="Category" value={form.category} onChange={(event) => update('category', event.target.value)}>
                {categories.map((category) => <MenuItem value={category._id} key={category._id}>{category.label}</MenuItem>)}
              </Select>
            </FormControl>
            <TextField label="Type" placeholder="Bar chairs & stools" value={form.type} onChange={(event) => update('type', event.target.value)} />
            <TextField label="Finish" placeholder="Polished steel" value={form.finish} onChange={(event) => update('finish', event.target.value)} />
            <Box className="admin-featured-toggle">
              <Box><Typography>Feature on storefront</Typography><Typography>Give this product priority in featured collections.</Typography></Box>
              <Switch checked={Boolean(form.featured)} onChange={(event) => update('featured', event.target.checked)} inputProps={{ 'aria-label': 'Feature product on storefront' }} />
            </Box>
            <TextField className="admin-description-field" multiline minRows={3} label="Description" value={form.description} onChange={(event) => update('description', event.target.value)} />
          </Box>

          <Box className="admin-upload-area">
            <Box><Typography variant="h3">Product photography</Typography><Typography>Upload up to {MAX_PRODUCT_IMAGES} JPEG, PNG, WebP or AVIF images. The first two rotate on hover in the catalogue.</Typography></Box>
            <Button component="label" variant="outlined" startIcon={<AddPhotoAlternateOutlinedIcon />} disabled={form.images.length + form.newImages.length >= MAX_PRODUCT_IMAGES}>
              Choose images
              <input hidden type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple onChange={onAddImages} />
            </Button>
          </Box>
          <Typography className="admin-image-limit">{form.images.length + form.newImages.length} / {MAX_PRODUCT_IMAGES} images selected</Typography>
          <Box className="admin-image-list">
            {form.images.map((src, index) => (
              <ImagePreview key={src} src={src} alt={`${form.name || 'Product'} photo ${index + 1}`} label={`Photo ${index + 1}`} onRemove={() => removeExisting(index)} />
            ))}
            {form.newImages.map((file, index) => (
              <ImagePreview key={`${file.name}-${file.lastModified}-${index}`} file={file} alt={file.name} label={file.name} onRemove={() => removeNew(index)} />
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button color="inherit" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={busy || categories.length === 0}>
            {busy ? 'Saving product…' : 'Save product'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

function ImagePreview({ src, file, alt, label, onRemove }) {
  const [preview, setPreview] = useState(src || '');
  useEffect(() => {
    if (!file) return undefined;
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  return (
    <Box className="admin-image-preview">
      {preview && <img src={preview} alt={alt} />}
      <Typography title={label}>{label}</Typography>
      <IconButton size="small" color="error" onClick={onRemove} aria-label={`Remove ${label}`}><DeleteOutlineIcon /></IconButton>
    </Box>
  );
}
