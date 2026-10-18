import { Box, Button, Card, CardContent, Chip, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import { AddPhotoAlternateOutlinedIcon, DeleteOutlineIcon, EditOutlinedIcon, StarOutlineIcon } from '../../../components/adminIcons.jsx';

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
          <Tooltip title="Delete product">
            <IconButton size="small" color="error" aria-label={`Delete ${product.name}`} onClick={onDelete}><DeleteOutlineIcon /></IconButton>
          </Tooltip>
        </Stack>
      </CardContent>
    </Card>
  );
}
