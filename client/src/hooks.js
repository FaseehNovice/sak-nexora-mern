import { useEffect, useState } from 'react';
import { api } from './api';
import { defaultCategories } from './defaultCategories';

let catCache = null;
let catRequest = null;
let catVersion = 0;
const catListeners = new Set();

function loadCategories(force = false) {
  if (force) {
    catCache = null;
    catRequest = null;
    catVersion += 1;
  }
  if (catCache) return Promise.resolve(catCache);
  if (!catRequest) {
    const version = catVersion;
    catRequest = api('/categories').then((data) => {
      if (version === catVersion) catCache = data;
      return data;
    }).catch((error) => {
      if (version === catVersion) catRequest = null;
      throw error;
    });
  }
  return catRequest;
}

export async function refreshCategories() {
  const data = await loadCategories(true);
  catListeners.forEach((listener) => listener({ data, error: '' }));
  return data;
}

function visibleCategories(data, useFallback) {
  if (!Array.isArray(data)) throw new Error('The categories API returned an invalid response.');
  return useFallback && data.length === 0 ? defaultCategories : data;
}

export function useCategories({ useFallback = true } = {}) {
  const [state, setState] = useState({
    data: visibleCategories(catCache || [], useFallback),
    error: '',
  });
  useEffect(() => {
    let live = true;
    const update = (next) => {
      if (!live) return;
      try {
        setState({ ...next, data: visibleCategories(next.data, useFallback) });
      } catch (error) {
        setState({ data: useFallback ? defaultCategories : [], error: error.message });
      }
    };
    catListeners.add(update);
    if (catCache) update({ data: catCache, error: '' });
    loadCategories().then((data) => {
      if (live && data === catCache) update({ data, error: '' });
    }).catch((error) => {
      if (live) update({ data: catCache || [], error: error.message });
    });
    return () => { live = false; catListeners.delete(update); };
  }, [useFallback]);
  return { ...state, refresh: refreshCategories };
}

export function useFetch(path, deps = []) {
  const [state, set] = useState({ data: null, loading: true, error: '' });
  useEffect(() => {
    let live = true;
    set((s) => ({ ...s, loading: true, error: '' }));
    api(path).then((data) => live && set({ data, loading: false, error: '' }))
      .catch((e) => live && set({ data: null, loading: false, error: e.message }));
    return () => { live = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return state;
}
