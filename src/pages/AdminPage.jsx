import { useCallback, useEffect, useState } from 'react';
import api, { adminToken } from '../api';
import AdminLogin from '../components/admin/AdminLogin';
import StyleUploadForm from '../components/admin/StyleUploadForm';
import { Alert, formatDate, formatDuration, formatPrice, Loader } from '../components/ui';
import { salon } from '../data/salon';
import '../styles/index.css';

const TABS = ['Styles', 'Bookings', 'Content'];
const STATUSES = ['new', 'contacted', 'confirmed', 'completed', 'cancelled'];

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [tab, setTab] = useState('Styles');

  /* ---------- check existing session on mount ---------- */
  useEffect(() => {
    const token = adminToken.get();
    if (!token) {
      setChecking(false);
      return;
    }
    api
      .adminSession()
      .then(() => setAuthed(true))
      .catch(() => adminToken.clear())
      .finally(() => setChecking(false));
  }, []);

  const onLoginSuccess = (response) => {
    adminToken.set(response.token);
    setAuthed(true);
  };

  const logout = async () => {
    try {
      await api.adminLogout();
    } catch {
      /* ignore */
    }
    adminToken.clear();
    setAuthed(false);
  };

  if (checking) {
    return (
      <div className="admin-shell section--ink">
        <div className="container">
          <Loader label="Checking your session" />
        </div>
      </div>
    );
  }

  if (!authed) {
    return <AdminLogin onSuccess={onLoginSuccess} />;
  }

  return (
    <div className="admin-shell section--ink">
      <div className="container">
        <div className="admin-head">
          <div>
            <span className="eyebrow">Studio back office</span>
            <h1>{salon.name}</h1>
          </div>
          <button type="button" className="btn btn--ghost btn--sm" onClick={logout}>
            Sign out
          </button>
        </div>

        <div className="admin-tabs">
          {TABS.map((name) => (
            <button
              key={name}
              type="button"
              className={`chip${tab === name ? ' is-active' : ''}`}
              onClick={() => setTab(name)}
            >
              {name}
            </button>
          ))}
        </div>

        {tab === 'Styles' && <StylesTab />}
        {tab === 'Bookings' && <BookingsTab />}
        {tab === 'Content' && <ContentTab />}
      </div>
    </div>
  );
}

/* ======================================================================= */
/*  Styles tab                                                              */
/* ======================================================================= */

function StylesTab() {
  const [styles, setStyles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null);
  const [filter, setFilter] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [stylesRes, catsRes] = await Promise.all([
        api.adminListStyles(),
        api.getCategories(),
      ]);
      setStyles(stylesRes.styles || []);
      setCounts(stylesRes.counts || {});
      setCategories(catsRes.categories || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const toggleFeatured = async (style) => {
    const fd = new FormData();
    fd.append('featured', style.featured ? '0' : '1');
    try {
      await api.adminUpdateStyle(style.id, fd);
      load();
    } catch (e) {
      setError(e.message);
    }
  };

  const toggleActive = async (style) => {
    const fd = new FormData();
    fd.append('active', style.active ? '0' : '1');
    try {
      await api.adminUpdateStyle(style.id, fd);
      load();
    } catch (e) {
      setError(e.message);
    }
  };

  const deleteStyle = async (style) => {
    if (!window.confirm(`Remove "${style.name}" from the menu permanently?`)) return;
    try {
      await api.adminDeleteStyle(style.id);
      load();
    } catch (e) {
      setError(e.message);
    }
  };

  const shown = filter
    ? styles.filter(
        (s) =>
          s.name.toLowerCase().includes(filter.toLowerCase()) ||
          s.category.toLowerCase().includes(filter.toLowerCase())
      )
    : styles;

  if (loading) return <Loader label="Loading styles" />;

  return (
    <>
      <Alert type="error">{error}</Alert>

      <div className="stat-row">
        <div>
          <strong>{counts.total || 0}</strong>
          <span>Total styles</span>
        </div>
        <div>
          <strong>{counts.active || 0}</strong>
          <span>Active</span>
        </div>
        <div>
          <strong>{counts.featured || 0}</strong>
          <span>Featured</span>
        </div>
      </div>

      <div className="admin-grid">
        <div>
          <StyleUploadForm
            categories={categories}
            editing={editing}
            onSaved={() => {
              load();
              setEditing(null);
            }}
            onCancelEdit={() => setEditing(null)}
          />

          {editing && (
            <button
              type="button"
              className="btn btn--ghost btn--sm btn--block"
              style={{ marginTop: '1rem' }}
              onClick={() => setEditing(null)}
            >
              Cancel edit — add a new style instead
            </button>
          )}
        </div>

        <div>
          <div className="search" style={{ marginBottom: '1rem' }}>
            <input
              type="search"
              placeholder="Filter styles…"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>

          <div className="record-list">
            {shown.map((style) => (
              <div className="record" key={style.id}>
                <img src={style.imageUrl} alt={style.name} loading="lazy" />
                <div>
                  <h4 className="record__name">{style.name}</h4>
                  <div className="record__meta">
                    <span>{style.category}</span>
                    <span>{formatPrice(style.priceFrom)}</span>
                    <span>{formatDuration(style.durationMinutes)}</span>
                    <span className={`badge ${style.active ? 'badge--live' : 'badge--draft'}`}>
                      {style.active ? 'Live' : 'Hidden'}
                    </span>
                    {style.featured && <span className="badge">★ Featured</span>}
                  </div>
                </div>
                <div className="record__actions">
                  <button
                    type="button"
                    className="icon-btn"
                    onClick={() => setEditing(style)}
                    title="Edit"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className={`icon-btn${style.featured ? ' is-on' : ''}`}
                    onClick={() => toggleFeatured(style)}
                    title="Toggle featured"
                  >
                    ★
                  </button>
                  <button
                    type="button"
                    className="icon-btn"
                    onClick={() => toggleActive(style)}
                    title="Toggle visibility"
                  >
                    {style.active ? 'Hide' : 'Show'}
                  </button>
                  <button
                    type="button"
                    className="icon-btn icon-btn--danger"
                    onClick={() => deleteStyle(style)}
                    title="Delete"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {shown.length === 0 && (
              <p className="empty-state">
                {filter ? 'No styles match that search.' : 'No styles yet — add your first one above.'}
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

/* ======================================================================= */
/*  Bookings tab                                                            */
/* ======================================================================= */

function BookingsTab() {
  const [bookings, setBookings] = useState([]);
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.adminListBookings();
      setBookings(res.bookings || []);
      setCounts(res.counts || {});
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const updateStatus = async (id, status) => {
    try {
      await api.adminUpdateBooking(id, status);
      load();
    } catch (e) {
      setError(e.message);
    }
  };

  const deleteBooking = async (booking) => {
    if (!window.confirm(`Delete the request from "${booking.name}"? This cannot be undone.`)) return;
    try {
      await api.adminDeleteBooking(booking.id);
      load();
    } catch (e) {
      setError(e.message);
    }
  };

  const shown =
    statusFilter === 'all'
      ? bookings
      : bookings.filter((b) => b.status === statusFilter);

  if (loading) return <Loader label="Loading appointment requests" />;

  return (
    <>
      <Alert type="error">{error}</Alert>

      <div className="stat-row">
        <div>
          <strong>{bookings.length}</strong>
          <span>Total</span>
        </div>
        {STATUSES.map((s) => (
          <div key={s}>
            <strong>{counts[s] || 0}</strong>
            <span>{s}</span>
          </div>
        ))}
      </div>

      <div className="filters" style={{ marginBottom: '1.4rem' }}>
        <button
          type="button"
          className={`chip${statusFilter === 'all' ? ' is-active' : ''}`}
          onClick={() => setStatusFilter('all')}
        >
          All
        </button>
        {STATUSES.map((s) => (
          <button
            key={s}
            type="button"
            className={`chip${statusFilter === s ? ' is-active' : ''}`}
            onClick={() => setStatusFilter(s)}
          >
            {s} {counts[s] ? `(${counts[s]})` : ''}
          </button>
        ))}
      </div>

      <div className="record-list">
        {shown.map((booking) => (
          <div className="booking" key={booking.id}>
            <div className="booking__top">
              <span className="booking__name">{booking.name}</span>
              <span className={`badge badge--${booking.status === 'new' ? 'live' : ''}`}>
                {booking.status}
              </span>
            </div>

            <div className="booking__contact">
              {booking.phone && <span>{booking.phone}</span>}
              {booking.phone && booking.email && <span> · </span>}
              {booking.email && (
                <a href={`mailto:${booking.email}`}>{booking.email}</a>
              )}
            </div>

            {booking.styleName && (
              <div className="booking__meta">
                <span>Style: {booking.styleName}</span>
              </div>
            )}

            <div className="booking__meta">
              {booking.preferredDate && <span>Date: {booking.preferredDate}</span>}
              {booking.preferredTime && <span>Time: {booking.preferredTime}</span>}
              <span>Received: {formatDate(booking.createdAt)}</span>
            </div>

            {booking.notes && <p className="booking__note">{booking.notes}</p>}

            <div className="booking__actions">
              <select
                className="status-select"
                value={booking.status}
                onChange={(e) => updateStatus(booking.id, e.target.value)}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="icon-btn icon-btn--danger"
                onClick={() => deleteBooking(booking)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {shown.length === 0 && (
          <p className="empty-state">
            {statusFilter === 'all'
              ? 'No appointment requests yet. When clients book from the website they will appear here.'
              : `No "${statusFilter}" requests.`}
          </p>
        )}
      </div>
    </>
  );
}

/* ======================================================================= */
/*  Content tab                                                             */
/* ======================================================================= */

function ContentTab() {
  const [form, setForm] = useState({
    announcement: '',
    heroEyebrow: '',
    heroTitle: '',
    heroSubtitle: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    api
      .getContent()
      .then((res) => {
        if (res.content) setForm(res.content);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const update = (field) => (e) => {
    setForm((current) => ({ ...current, [field]: e.target.value }));
    setSuccess('');
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await api.adminSaveContent(form);
      setSuccess('Home page content updated — changes are live.');
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader label="Loading content" />;

  return (
    <div style={{ maxWidth: 680 }}>
      <span className="eyebrow">Home page text</span>
      <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', marginBottom: '0.5rem' }}>
        Edit the hero and announcement bar
      </h2>
      <p className="field__hint" style={{ marginBottom: '1.6rem' }}>
        Changes take effect immediately for new visitors. Existing visitors see them on the next page load.
      </p>

      <Alert type="error">{error}</Alert>
      <Alert type="success">{success}</Alert>

      <form className="form-card" onSubmit={save}>
        <div className="form">
          <div className="field field--full">
            <label htmlFor="content-announcement">Announcement bar</label>
            <input
              id="content-announcement"
              value={form.announcement}
              onChange={update('announcement')}
              placeholder="e.g. Booking now open for the holiday season…"
            />
            <p className="field__hint">The gold ribbon at the very top of every page.</p>
          </div>

          <div className="field field--full">
            <label htmlFor="content-eyebrow">Hero eyebrow</label>
            <input
              id="content-eyebrow"
              value={form.heroEyebrow}
              onChange={update('heroEyebrow')}
              placeholder="e.g. Texas · Luxury Hair Studio"
            />
          </div>

          <div className="field field--full">
            <label htmlFor="content-title">Hero title</label>
            <input
              id="content-title"
              value={form.heroTitle}
              onChange={update('heroTitle')}
              placeholder="e.g. Where your crown is treated like art"
            />
            <p className="field__hint">
              The last 2–3 words appear in gold italic. Keep it short and impactful.
            </p>
          </div>

          <div className="field field--full">
            <label htmlFor="content-subtitle">Hero subtitle</label>
            <textarea
              id="content-subtitle"
              value={form.heroSubtitle}
              onChange={update('heroSubtitle')}
              placeholder="A longer sentence under the headline…"
              style={{ minHeight: 90 }}
            />
          </div>
        </div>

        <div className="btn-row" style={{ marginTop: '1.6rem' }}>
          <button type="submit" className="btn btn--gold" disabled={saving}>
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
