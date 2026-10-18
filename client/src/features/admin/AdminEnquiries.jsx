import { useEffect, useState } from 'react';
import { Alert, Box, Button, Chip, CircularProgress, FormControl, IconButton, InputLabel, MenuItem, Pagination, Paper, Select, Stack, TextField, Typography } from '@mui/material';
import { DeleteOutlineIcon, MailOutlineIcon, SearchOutlinedIcon } from '../../components/adminIcons.jsx';
import { api, qs } from '../../api.js';
import { isAuthError } from './adminUtils.js';

export default function Enquiries({ token, onAuthError }) {
  const [list, setList] = useState({ items: [], total: 0, page: 1, pages: 0 });
  const [status, setStatus] = useState('');
  const [term, setTerm] = useState('');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [message, setMessage] = useState('');
  const [busyId, setBusyId] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    api(`/enquiries${qs({ status, q: query, page, limit: 12 })}`, { token })
      .then((result) => {
        if (active) { setList(result); setMessage(''); }
      })
      .catch((requestError) => {
        if (!active) return;
        if (isAuthError(requestError)) onAuthError();
        setMessage(requestError.message);
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [token, status, query, page, onAuthError]);

  const changeStatus = async (id, nextStatus) => {
    setBusyId(id);
    try {
      await api(`/enquiries/${id}`, { method: 'PATCH', body: { status: nextStatus }, token });
      setList((current) => ({
        ...current,
        items: status && status !== nextStatus
          ? current.items.filter((enquiry) => enquiry._id !== id)
          : current.items.map((enquiry) => enquiry._id === id ? { ...enquiry, status: nextStatus } : enquiry),
        total: status && status !== nextStatus ? Math.max(0, current.total - 1) : current.total,
      }));
      setMessage('');
    } catch (requestError) {
      if (isAuthError(requestError)) onAuthError();
      setMessage(requestError.message);
    } finally {
      setBusyId('');
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this enquiry?')) return;
    try {
      await api(`/enquiries/${id}`, { method: 'DELETE', token });
      setList((current) => ({ ...current, items: current.items.filter((item) => item._id !== id), total: Math.max(0, current.total - 1) }));
    } catch (requestError) {
      if (isAuthError(requestError)) onAuthError();
      setMessage(requestError.message);
    }
  };

  return (
    <Stack spacing={2.5} className="admin-content">
      <Box className="admin-list-toolbar">
        <Box><Typography variant="h3">Customer enquiries</Typography><Typography className="admin-muted">{list.total} requests in your inbox</Typography></Box>
        <form className="admin-enquiry-filters" onSubmit={(event) => { event.preventDefault(); setPage(1); setQuery(term.trim()); }}>
          <TextField size="small" placeholder="Search name, phone, business or item" value={term} onChange={(event) => setTerm(event.target.value)} />
          <FormControl size="small">
            <InputLabel id="enquiry-status">Status</InputLabel>
            <Select labelId="enquiry-status" label="Status" value={status} onChange={(event) => { setPage(1); setStatus(event.target.value); }}>
              <MenuItem value="">All statuses</MenuItem><MenuItem value="new">New</MenuItem><MenuItem value="quoted">Quoted</MenuItem><MenuItem value="closed">Closed</MenuItem>
            </Select>
          </FormControl>
          <Button type="submit" variant="outlined" startIcon={<SearchOutlinedIcon />}>Search</Button>
        </form>
      </Box>
      {message && <Alert severity="error">{message}</Alert>}
      {loading ? <Box className="admin-loading"><CircularProgress /></Box> : list.items.length ? (
        <Stack spacing={1.5}>
          {list.items.map((enquiry) => (
            <Paper className="admin-enquiry-card" elevation={0} key={enquiry._id}>
              <Box className="admin-enquiry-header">
                <Box>
                  <Typography className="admin-enquiry-name">{enquiry.name}</Typography>
                  {enquiry.business && <Typography className="admin-muted">{enquiry.business}</Typography>}
                  <Stack direction="row" spacing={1.5} sx={{ flexWrap: 'wrap' }}>
                    <a href={`https://wa.me/${enquiry.phone.replace(/\D/g, '').replace(/^0/, '92')}`} target="_blank" rel="noreferrer">{enquiry.phone}</a>
                    {enquiry.email && <a href={`mailto:${enquiry.email}`}>{enquiry.email}</a>}
                  </Stack>
                </Box>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                  <Typography className="admin-muted">{new Date(enquiry.createdAt).toLocaleDateString()}</Typography>
                  <FormControl size="small">
                    <Select value={enquiry.status} disabled={busyId === enquiry._id} onChange={(event) => changeStatus(enquiry._id, event.target.value)} aria-label={`Status for ${enquiry.name}`}>
                      <MenuItem value="new">New</MenuItem><MenuItem value="quoted">Quoted</MenuItem><MenuItem value="closed">Closed</MenuItem>
                    </Select>
                  </FormControl>
                  <IconButton color="error" aria-label={`Delete enquiry from ${enquiry.name}`} onClick={() => remove(enquiry._id)}><DeleteOutlineIcon /></IconButton>
                </Stack>
              </Box>
              {enquiry.items?.length > 0 && <Stack className="admin-enquiry-items" direction="row" sx={{ flexWrap: 'wrap', gap: 0.8 }}>
                {enquiry.items.map((item, index) => <Chip key={`${item.name}-${index}`} size="small" label={`${item.name} × ${item.qty}`} />)}
              </Stack>}
              {enquiry.message && <Typography className="admin-enquiry-message">{enquiry.message}</Typography>}
            </Paper>
          ))}
        </Stack>
      ) : <Paper className="admin-empty" elevation={0}><MailOutlineIcon /><Typography variant="h3">No enquiries to show</Typography><Typography>Customer requests will appear here when they contact you through the site.</Typography></Paper>}
      {list.pages > 1 && <Box className="admin-pagination"><Pagination count={list.pages} page={page} onChange={(_, nextPage) => setPage(nextPage)} color="primary" /></Box>}
    </Stack>
  );
}
