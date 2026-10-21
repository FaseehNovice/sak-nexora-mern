import { useCallback, useEffect, useState } from 'react';
import {
  Alert, Avatar, Box, Button, Chip, Divider, Snackbar, Stack, ThemeProvider, Typography, createTheme,
} from '@mui/material';
import {
  AnalyticsOutlinedIcon, CategoryOutlinedIcon, Inventory2OutlinedIcon,
  LogoutOutlinedIcon, MailOutlineIcon, StorefrontOutlinedIcon,
} from '../components/adminIcons.jsx';
import { Link as RouterLink } from 'react-router-dom';
import AdminLogin from '../features/admin/AdminLogin.jsx';
import AdminOverview from '../features/admin/AdminOverview.jsx';
import AdminProducts from '../features/admin/AdminProducts.jsx';
import AdminCategories from '../features/admin/AdminCategories.jsx';
import AdminEnquiries from '../features/admin/AdminEnquiries.jsx';
import '../styles/admin.css';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#a87927', contrastText: '#fffdf8' },
    secondary: { main: '#282219' },
    background: { default: '#f3f0e9', paper: '#fffdf8' },
    text: { primary: '#28251f', secondary: '#777166' },
    error: { main: '#a44737' },
    success: { main: '#4c745b' },
  },
  typography: {
    fontFamily: '"Manrope", system-ui, sans-serif',
    button: { fontWeight: 700, textTransform: 'none' },
    h1: { fontFamily: '"Cormorant Garamond", Georgia, serif', fontWeight: 600 },
    h2: { fontFamily: '"Cormorant Garamond", Georgia, serif', fontWeight: 600 },
    h3: { fontFamily: '"Cormorant Garamond", Georgia, serif', fontWeight: 600 },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiButton: { styleOverrides: { root: { borderRadius: 8, minHeight: 40 } } },
    MuiCard: { styleOverrides: { root: { border: '1px solid #e6e0d5', boxShadow: 'none' } } },
    MuiOutlinedInput: { styleOverrides: { root: { background: '#fffdf8' } } },
    MuiTableCell: { styleOverrides: { head: { color: '#777166', fontWeight: 700 } } },
  },
});



const tabs = [
  { key: 'overview', label: 'Overview', Icon: AnalyticsOutlinedIcon },
  { key: 'products', label: 'Products', Icon: Inventory2OutlinedIcon },
  { key: 'categories', label: 'Categories', Icon: CategoryOutlinedIcon },
  { key: 'enquiries', label: 'Enquiries', Icon: MailOutlineIcon },
];





export default function Admin() {
  const [token, setToken] = useState(() => localStorage.getItem('sak-admin') || '');
  const [tab, setTab] = useState('overview');
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const notify = useCallback((message, severity = 'success') => setToast({ open: true, message, severity }), []);
  const logout = useCallback(() => {
    localStorage.removeItem('sak-admin');
    setToken('');
  }, []);

  useEffect(() => { document.title = 'Admin | SAK Nexora'; }, []);

  return (
    <ThemeProvider theme={theme}>
      {!token ? (
        <AdminLogin onNotify={notify} onToken={(nextToken) => {
          localStorage.setItem('sak-admin', nextToken);
          setToken(nextToken);
        }} />
      ) : (
        <Box className="admin-shell">
          <Box component="aside" className="admin-rail">
            <RouterLink to="/" className="admin-wordmark" aria-label="SAK Nexora home">
              <span className="admin-monogram">S</span>
              <span><b>SAK NEXORA</b><small>CATALOGUE STUDIO</small></span>
            </RouterLink>
            <Typography className="admin-nav-label">Workspace</Typography>
            <Stack className="admin-nav" spacing={0.6} sx={{ flexDirection: { xs: 'row', md: 'column' } }}>
              {tabs.map(({ key, label, Icon }) => (
                <Button
                  key={key}
                  className={tab === key ? 'admin-nav-active' : ''}
                  startIcon={<Icon />}
                  onClick={() => setTab(key)}
                  aria-current={tab === key ? 'page' : undefined}
                >
                  {label}
                </Button>
              ))}
            </Stack>
            <Box className="admin-rail-bottom">
              <Divider />
              <Button component={RouterLink} to="/" startIcon={<StorefrontOutlinedIcon />}>View storefront</Button>
              <Button startIcon={<LogoutOutlinedIcon />} onClick={logout}>Sign out</Button>
            </Box>
          </Box>

          <Box component="main" className="admin-workspace">
            <Box className="admin-toolbar">
              <Box>
                <Typography className="admin-overline">SAK NEXORA / ADMINISTRATION</Typography>
                <Typography variant="h1" className="admin-page-title">
                  {tabs.find((item) => item.key === tab)?.label}
                </Typography>
              </Box>
              <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                <Chip className="admin-live-chip" label="Admin workspace" size="small" />
                <Avatar className="admin-avatar">SN</Avatar>
              </Stack>
            </Box>

            {tab === 'overview' && <AdminOverview token={token} onAuthError={logout} onNavigate={setTab} onNotify={notify} />}
            {tab === 'products' && <AdminProducts token={token} onAuthError={logout} onNotify={notify} />}
            {tab === 'categories' && <AdminCategories token={token} onAuthError={logout} onNotify={notify} />}
            {tab === 'enquiries' && <AdminEnquiries token={token} onAuthError={logout} onNotify={notify} />}
          </Box>
        </Box>
      )}
      <Snackbar open={toast.open} autoHideDuration={4500} onClose={() => setToast((current) => ({ ...current, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert onClose={() => setToast((current) => ({ ...current, open: false }))} severity={toast.severity} variant="filled" sx={{ width: '100%' }}>{toast.message}</Alert>
      </Snackbar>
    </ThemeProvider>
  );
}















