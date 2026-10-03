/**
 * Tiny fetch wrapper around the Express API.
 *
 * In development Vite proxies /api and /uploads to http://localhost:4000, so
 * the browser only ever talks to one origin. If you ever host the API on a
 * different domain, set VITE_API_URL in client/.env.
 */
const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

const TOKEN_KEY = 'mboh.adminToken';

export const adminToken = {
  get: () => {
    try {
      return localStorage.getItem(TOKEN_KEY) || '';
    } catch {
      return '';
    }
  },
  set: (token) => {
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch {
      /* storage unavailable - session lasts until reload */
    }
  },
  clear: () => {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {
      /* ignore */
    }
  },
};

async function request(path, { method = 'GET', body, auth = false, headers = {} } = {}) {
  const options = { method, headers: { ...headers } };

  if (auth) {
    const token = adminToken.get();
    if (token) options.headers.Authorization = `Bearer ${token}`;
  }

  if (body instanceof FormData) {
    options.body = body; // let the browser set the multipart boundary
  } else if (body !== undefined) {
    options.headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(body);
  }

  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, options);
  } catch {
    throw new Error('We could not reach the studio server. Please check your connection and try again.');
  }

  const text = await response.text();
  let payload = null;
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = { error: text.slice(0, 300) };
    }
  }

  if (!response.ok) {
    const error = new Error(payload?.error || `Request failed (${response.status}).`);
    error.status = response.status;
    error.fields = payload?.errors || null;
    throw error;
  }

  return payload ?? {};
}

export const api = {
  /* ----------------------------------------------------------- public reads */
  getContent: () => request('/api/content'),
  getStyles: ({ category, featured, q, limit } = {}) => {
    const params = new URLSearchParams();
    if (category && category !== 'All') params.set('category', category);
    if (featured) params.set('featured', '1');
    if (q) params.set('q', q);
    if (limit) params.set('limit', String(limit));
    const query = params.toString();
    return request(`/api/styles${query ? `?${query}` : ''}`);
  },
  getStyle: (idOrSlug) => request(`/api/styles/${encodeURIComponent(idOrSlug)}`),
  getCategories: () => request('/api/categories'),
  getServices: () => request('/api/services'),
  getTestimonials: () => request('/api/testimonials'),
  createBooking: (payload) => request('/api/bookings', { method: 'POST', body: payload }),

  /* ----------------------------------------------------------------- admin */
  adminLogin: (passcode) => request('/api/admin/login', { method: 'POST', body: { passcode } }),
  adminLogout: () => request('/api/admin/logout', { method: 'POST', auth: true }),
  adminSession: () => request('/api/admin/session', { auth: true }),
  adminListStyles: () => request('/api/admin/styles', { auth: true }),
  adminCreateStyle: (formData) =>
    request('/api/admin/styles', { method: 'POST', body: formData, auth: true }),
  adminUpdateStyle: (id, formData) =>
    request(`/api/admin/styles/${id}`, { method: 'PATCH', body: formData, auth: true }),
  adminDeleteStyle: (id) => request(`/api/admin/styles/${id}`, { method: 'DELETE', auth: true }),
  adminListBookings: () => request('/api/admin/bookings', { auth: true }),
  adminUpdateBooking: (id, status) =>
    request(`/api/admin/bookings/${id}`, { method: 'PATCH', body: { status }, auth: true }),
  adminDeleteBooking: (id) =>
    request(`/api/admin/bookings/${id}`, { method: 'DELETE', auth: true }),
  adminSaveContent: (content) =>
    request('/api/admin/content', { method: 'PATCH', body: content, auth: true }),
};

export default api;