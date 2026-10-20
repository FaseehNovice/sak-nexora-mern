import { Box, Button, Card, CardContent, Chip, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import { AddPhotoAlternateOutlinedIcon, DeleteOutlineIcon, DownloadOutlinedIcon, EditOutlinedIcon, StarOutlineIcon } from '../../../components/adminIcons.jsx';

async function downloadImage(url, productName) {
  if (!url) return;
  const extension = url.split('?')[0].split('.').pop() || 'jpg';
  const filename = (productName || 'product').toLowerCase().replace(/[^a-z0-9.-]+/g, '-') + '-photo.' + extension;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Image download failed.');
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = objectUrl;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(objectUrl);
  } catch {
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    anchor.click();
  }
}

export default function ProductTile({ product, onEdit, onDelete }) {
  const images = product.images || [];
  return (
    <Card className="admin-product-tile">
      <Box className="admin-product-media">
        {images[0] ? <img className="admin-product-image primary" src={images[0]} alt={product.name} loading="lazy" /> : (
          <Box className="admin-product-placeholder"><AddPhotoAlternateOutlinedIcon /><span>No image</span></Box>
        )}
        {images[1] && <img className="admin-product-image alternate" src={images[1]} alt="" loading="lazy" />}
        {product.featured && <Chip className="admin-featured-chip" icon={<StarOutlineIcon />} label="Featured" size="small" />}
        <Typography className="admin-photo-count">{images.length} {images.length === 1 ? 'photo' : 'photos'}</Typography>
      </Box>
      <CardContent className="admin-product-details">
        <Typography className="admin-product-category">{product.category?.name || 'Uncategorized'}</Typography>
        <Typography className="admin-product-name">{product.name}</Typography>
        <Typography className="admin-product-finish">{[product.type, product.finish].filter(Boolean).join(' · ') || 'No type or finish specified'}</Typography>
        <Stack direction="row" spacing={1} className="admin-product-actions">
          <Button size="small" variant="outlined" startIcon={<EditOutlinedIcon />} onClick={onEdit}>Edit</Button>
          <Tooltip title={images[0] ? 'Download primary product photo' : 'No product photo to download'}>
            <span><IconButton size="small" disabled={!images[0]} aria-label={'Download ' + product.name + ' photo'} onClick={() => downloadImage(images[0], product.name)}><DownloadOutlinedIcon /></IconButton></span>
          </Tooltip>
          <Tooltip title="Delete product">
            <IconButton size="small" color="error" aria-label={`Delete ${product.name}`} onClick={onDelete}><DeleteOutlineIcon /></IconButton>
          </Tooltip>
        </Stack>
      </CardContent>
    </Card>
  );
}
