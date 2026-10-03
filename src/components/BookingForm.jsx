import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api';
import { salon } from '../data/salon';
import { useSite } from '../context/SiteContext';
import { Alert, formatDuration, formatPrice, Icon } from './ui';

const EMPTY = {
  name: '',
  email: '',
  phone: '',
  styleId: '',
  preferredDate: '',
  preferredTime: 'Morning (9am – 12pm)',
  notes: '',
  consent: false,
};

const TIMES = [
  'Morning (9am – 12pm)',
  'Afternoon (12pm – 4pm)',
  'Evening (4pm – 7pm)',
  'Flexible — you choose',
];

/** Booking / contact form. Writes straight into the SQLite bookings table. */
export default function BookingForm({ compact = false }) {
  const { styles, services } = useSite();
  const [searchParams] = useSearchParams();
  const preselected = searchParams.get('style') || '';

  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [confirmation, setConfirmation] = useState(null);

  useEffect(() => {
    if (!preselected) return;
    const match = styles.find(
      (style) => style.slug === preselected || String(style.id) === preselected
    );
    if (match) {
      setForm((current) => ({
        ...current,
        styleId: String(match.id),
        notes: current.notes || `${match.name} — please confirm availability.`,
      }));
    }
  }, [preselected, styles]);

  const grouped = useMemo(() => {
    const map = new Map();
    styles.forEach((style) => {
      if (!map.has(style.category)) map.set(style.category, []);
      map.get(style.category).push(style);
    });
    return [...map.entries()];
  }, [styles]);

  const selectedStyle = styles.find((style) => String(style.id) === form.styleId);

  const update = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setForm((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({ ...current, [field]: undefined }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setStatus('sending');
    setError('');
    setFieldErrors({});

    try {
      const response = await api.createBooking({
        name: form.name,
        email: form.email,
        phone: form.phone,
        styleId: form.styleId ? Number(form.styleId) : null,
        styleName: selectedStyle?.name || '',
        preferredDate: form.preferredDate,
        preferredTime: form.preferredTime,
        notes: form.notes,
      });
      setConfirmation(response);
      setStatus('sent');
      setForm(EMPTY);
    } catch (submitError) {
      setStatus('error');
      setError(submitError.message);
      setFieldErrors(submitError.fields || {});
    }
  };

  if (status === 'sent') {
    return (
      <div className="form-success">
        <span className="form-success__mark" aria-hidden="true">
          ✓
        </span>
        <h3 style={{ margin: 0 }}>Your request is in the book</h3>
        <p style={{ margin: 0, maxWidth: '46ch' }}>
          {confirmation?.message || 'Thank you! You will hear back within 24 hours.'}
        </p>
        <p className="muted" style={{ margin: 0 }}>
          Need something sooner? Call {salon.phone}.
        </p>
        <div className="btn-row btn-row--center">
          <button type="button" className="btn btn--ghost btn--sm" onClick={() => setStatus('idle')}>
            Send another request
          </button>
          <a className="btn btn--gold btn--sm" href={`tel:${salon.phoneHref}`}>
            Call the studio
          </a>
        </div>
      </div>
    );
  }

  return (
    <form className={compact ? 'stack-sm' : 'form-card'} onSubmit={onSubmit} noValidate>
      <Alert type="error">{error}</Alert>
      <div className="form">
        <div className="field">
          <label htmlFor="booking-name">Your name *</label>
          <input
            id="booking-name"
            name="name"
            value={form.name}
            onChange={update('name')}
            placeholder="First and last name"
            autoComplete="name"
            required
          />
          {fieldErrors.name ? <p className="field__error">{fieldErrors.name}</p> : null}
        </div>

        <div className="field">
          <label htmlFor="booking-phone">Phone</label>
          <input
            id="booking-phone"
            name="phone"
            value={form.phone}
            onChange={update('phone')}
            placeholder="(713) 555-0142"
            autoComplete="tel"
            inputMode="tel"
          />
        </div>

        <div className="field">
          <label htmlFor="booking-email">Email</label>
          <input
            id="booking-email"
            name="email"
            type="email"
            value={form.email}
            onChange={update('email')}
            placeholder="you@email.com"
            autoComplete="email"
          />
          {fieldErrors.email ? <p className="field__error">{fieldErrors.email}</p> : null}
          {fieldErrors.contact ? <p className="field__error">{fieldErrors.contact}</p> : null}
        </div>

        <div className="field">
          <label htmlFor="booking-style">Style you would like</label>
          <select
            id="booking-style"
            name="styleId"
            value={form.styleId}
            onChange={update('styleId')}
          >
            <option value="">Not sure yet — help me choose</option>
            {grouped.map(([category, items]) => (
              <optgroup key={category} label={category}>
                {items.map((style) => (
                  <option key={style.id} value={style.id}>
                    {style.name} — {formatPrice(style.priceFrom)}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          {selectedStyle ? (
            <p className="field__hint">
              {formatDuration(selectedStyle.durationMinutes)} in the chair ·{' '}
              {formatPrice(selectedStyle.priceFrom)}
            </p>
          ) : (
            <p className="field__hint">
              Not sure? Browse the style menu — we will help you decide.
            </p>
          )}
        </div>

        <div className="field">
          <label htmlFor="booking-date">Preferred date</label>
          <input
            id="booking-date"
            name="preferredDate"
            type="date"
            value={form.preferredDate}
            onChange={update('preferredDate')}
          />
        </div>

        <div className="field">
          <label htmlFor="booking-time">Preferred time</label>
          <select
            id="booking-time"
            name="preferredTime"
            value={form.preferredTime}
            onChange={update('preferredTime')}
          >
            {TIMES.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        </div>

        <div className="field field--full">
          <label htmlFor="booking-notes">Tell us about your hair</label>
          <textarea
            id="booking-notes"
            name="notes"
            value={form.notes}
            onChange={update('notes')}
            placeholder="Hair length and texture, whether extensions are needed, previous styles, and anything else we should know."
          />
        </div>

        <div className="field field--full">
          <label className="checkbox" htmlFor="booking-consent">
            <input
              id="booking-consent"
              name="consent"
              type="checkbox"
              checked={form.consent}
              onChange={update('consent')}
            />
            <span>
              I would like to be contacted about my appointment by phone or email, and I understand a
              small deposit secures the chair.
            </span>
          </label>
        </div>
      </div>

      <div className="btn-row" style={{ marginTop: '1.6rem', alignItems: 'center' }}>
        <button type="submit" className="btn btn--gold" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending…' : 'Request appointment'}
        </button>
        <span className="muted" style={{ fontSize: '0.8rem' }}>
          <Icon
            name="clock"
            className="icon"
            style={{ width: 15, height: 15, display: 'inline', verticalAlign: '-2px' }}
          />{' '}
          Replies within 24 hours · {services.length} services available
        </span>
      </div>
    </form>
  );
}