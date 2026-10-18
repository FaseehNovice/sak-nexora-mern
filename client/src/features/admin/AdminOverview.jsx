import { useEffect, useState } from 'react';
import { Alert, Avatar, Box, Button, Card, CardContent, Chip, CircularProgress, LinearProgress, Stack, Typography } from '@mui/material';
import { AddPhotoAlternateOutlinedIcon, CategoryOutlinedIcon, Inventory2OutlinedIcon, MailOutlineIcon, StarOutlineIcon } from '../../components/adminIcons.jsx';
import { api } from '../../api.js';
import { adminErrorMessage, isAuthError } from './adminUtils.js';

export default function Overview({ token, onAuthError, onNavigate }) {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      const health = await api('/health', { token });
      if (health.database !== 'connected') {
        throw new Error('MongoDB is disconnected. Restore the database connection before loading admin analytics.');
      }
      return Promise.all([
        api('/products?limit=1', { token }),
        api('/products?featured=true&limit=1', { token }),
        api('/categories', { token }),
        api('/categories/admin?limit=100', { token }),
        api('/enquiries?limit=1', { token }),
        api('/enquiries?status=new&limit=1', { token }),
      ]);
    })().then(([products, featured, categoryTree, categoryList, enquiries, newEnquiries]) => {
      if (!active) return;
      setStats({
        products: products.total,
        featured: featured.total,
        categories: categoryList.total,
        enquiries: enquiries.total,
        newEnquiries: newEnquiries.total,
        categoryTree,
      });
      setError('');
    }).catch((requestError) => {
      if (!active) return;
      if (isAuthError(requestError)) onAuthError();
      setError(adminErrorMessage(requestError));
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [token, onAuthError]);

  if (loading) return <Box className="admin-loading"><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!stats) return null;

  const categoryRows = [...stats.categoryTree].sort((a, b) => b.count - a.count);
  const largestCount = Math.max(1, ...categoryRows.map((category) => category.count));
  const metrics = [
    { label: 'Catalogue products', value: stats.products, caption: 'Across every product range', Icon: Inventory2OutlinedIcon, color: 'brass' },
    { label: 'Active categories', value: stats.categories, caption: 'Top-level ranges and subcategories', Icon: CategoryOutlinedIcon, color: 'stone' },
    { label: 'New enquiries', value: stats.newEnquiries, caption: `${stats.enquiries} enquiries in total`, Icon: MailOutlineIcon, color: 'green' },
    { label: 'Featured products', value: stats.featured, caption: 'Highlighted on the storefront', Icon: StarOutlineIcon, color: 'clay' },
  ];

  return (
    <Stack spacing={3} className="admin-content">
      <Box className="admin-welcome">
        <Box>
          <Typography className="admin-overline">Your catalogue at a glance</Typography>
          <Typography variant="h2">Good work starts with a clear view.</Typography>
          <Typography>Track your ranges, featured pieces and incoming customer requests.</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddPhotoAlternateOutlinedIcon />} onClick={() => onNavigate('products')}>
          Manage products
        </Button>
      </Box>

      <Box className="admin-metrics">
        {metrics.map(({ label, value, caption, Icon, color }) => (
          <Card className="admin-metric" key={label}>
            <CardContent>
              <Box className="admin-metric-top">
                <Typography>{label}</Typography>
                <Avatar className={`admin-metric-icon ${color}`}><Icon /></Avatar>
              </Box>
              <Typography className="admin-metric-value">{value.toLocaleString()}</Typography>
              <Typography className="admin-metric-caption">{caption}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Box className="admin-analytics-grid">
        <Card className="admin-analytics-card">
          <CardContent>
            <Box className="admin-section-heading">
              <Box><Typography variant="h3">Products by range</Typography><Typography>Distribution across top-level categories</Typography></Box>
              <Chip label={`${stats.products} total`} size="small" />
            </Box>
            {categoryRows.length ? categoryRows.map((category) => (
              <Box className="admin-range-row" key={category._id || category.slug}>
                <Box className="admin-range-label"><span>{category.name}</span><b>{category.count}</b></Box>
                <LinearProgress variant="determinate" value={(category.count / largestCount) * 100} />
              </Box>
            )) : <Typography className="admin-muted">No catalogue categories have been added yet.</Typography>}
          </CardContent>
        </Card>

        <Card className="admin-analytics-card admin-enquiry-summary">
          <CardContent>
            <Typography variant="h3">Enquiry inbox</Typography>
            <Typography>Customer requests waiting in your workspace.</Typography>
            <Box className="admin-enquiry-number">{stats.newEnquiries}</Box>
            <Typography className="admin-muted">New requests to review</Typography>
            <Button onClick={() => onNavigate('enquiries')} endIcon={<MailOutlineIcon />}>Open enquiries</Button>
          </CardContent>
        </Card>
      </Box>
    </Stack>
  );
}
