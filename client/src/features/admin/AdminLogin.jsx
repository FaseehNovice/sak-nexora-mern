import { useEffect, useState } from 'react';
import { Alert, Box, Button, CircularProgress, Paper, TextField, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { api } from '../../api.js';

export default function Login({ onToken, onNotify }) {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [setup, setSetup] = useState(null);
  const [setupError, setSetupError] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    api('/auth/status')
      .then((status) => { if (active) setSetup(status); })
      .catch((requestError) => { if (active) setSetupError(requestError.message); });
    return () => { active = false; };
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const result = await api('/auth/login', { method: 'POST', body: credentials });
      onToken(result.token);
    } catch (requestError) {
      setError(requestError.message);
      onNotify(requestError.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="admin-login-shell">
      <Box className="admin-login-brand">
        <RouterLink to="/" className="admin-wordmark" aria-label="Return to SAK Nexora storefront">
          <span className="admin-monogram">S</span>
          <span><b>SAK NEXORA</b><small>CATALOGUE STUDIO</small></span>
        </RouterLink>
        <Box className="admin-login-visual">
          <Typography className="admin-overline">A considered collection</Typography>
          <Typography variant="h2">Every detail,<br />in its place.</Typography>
          <Typography>Manage your product ranges, images and customer enquiries from one workspace.</Typography>
        </Box>
        <Typography className="admin-login-footnote">Furniture, tableware and hospitality essentials.</Typography>
      </Box>
      <Box className="admin-login-panel">
        <Paper className="admin-login-card" elevation={0}>
          <Typography className="admin-overline">Private workspace</Typography>
          <Typography variant="h1">Admin sign in</Typography>
          <Typography className="admin-login-copy">Sign in with the administrator credentials configured on the server.</Typography>

          {setup?.configured === false && (
            <Alert severity="warning" className="admin-setup-alert">
              <b>Admin sign-in needs setup.</b>
              <br />
              Add {setup.missing.join(', ')} to the server environment, then restart the API.
            </Alert>
          )}
          {setupError && <Alert severity="error" className="admin-setup-alert">{setupError}</Alert>}
          {error && <Alert severity="error" className="admin-setup-alert" role="alert">{error}</Alert>}

          <Box component="form" onSubmit={submit} className="admin-login-form">
            <TextField
              fullWidth required type="email" label="Email address" autoComplete="username"
              value={credentials.email}
              onChange={(event) => setCredentials((current) => ({ ...current, email: event.target.value }))}
            />
            <TextField
              fullWidth required type="password" label="Password" autoComplete="current-password"
              value={credentials.password}
              onChange={(event) => setCredentials((current) => ({ ...current, password: event.target.value }))}
            />
            <Button fullWidth variant="contained" type="submit" disabled={loading || setup?.configured === false}>
              {loading ? <CircularProgress size={20} color="inherit" /> : 'Sign in to admin'}
            </Button>
            <Button fullWidth component={RouterLink} to="/" color="inherit">Back to the storefront</Button>
          </Box>
          <Typography className="admin-login-security">Administrator access is private and protected.</Typography>
        </Paper>
      </Box>
    </Box>
  );
}
