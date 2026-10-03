import { useEffect, useMemo, useRef, useState } from 'react';
import api from '../../api';
import { Alert } from '../ui';

const MAX_MB = 8;

const emptyForm = {
  name: '',
  category: '',
  priceFrom: '',
  durationMinutes: '',
  description: '',
  imageUrl: '',
  featured: false,
  active: true,
};

/**
 * Upload (or edit) a style: photo dropzone plus every detail the website shows.
 * Text fields are appended to the FormData before the file, so the server can
 * name the saved photo after the style.
 */
export default function StyleUploadForm({
  categories = [],
  onSaved,
  editing = null,
  onCancelEdit,
  onError,
}) {
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileRef = useRef(null);

  useEffect(() => {
    if (editing) {
      setForm({
        name: editing.name || '',
        category: editing.category || '',
        priceFrom: editing.priceFrom ?? '',
        durationMinutes: editing.durationMinutes ?? '',
        description: editing.description || '',
        imageUrl: '',
        featured: Boolean(editing.featured),
        active: Boolean(editing.active),
      });
      setPreview(editing.imageUrl || '');
      setFile(null);
    } else {
      setForm(emptyForm);
      setPreview('');
      setFile(null);
    }
    setError('');
  }, [editing]);

  useEffect(() => {
    if (!file) return undefined;
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const suggestions = useMemo(() => categories.map((entry) => entry.name), [categories]);

  const chooseFile = (nextFile) => {
    if (!nextFile) return;
    if (!nextFile.type.startsWith('image/')) {
      setError('Please choose an image file (JPG, PNG, WEBP, AVIF or GIF).');
      return;
    }
    if (nextFile.size > MAX_MB * 1024 * 1024) {
      setError(
        `That photo is ${(nextFile.size / 1024 / 1024).toFixed(1)} MB — please keep it under ${MAX_MB} MB.`
      );
      return;
    }
    setError('');
    setFile(nextFile);
  };

  const update = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setForm((current) => ({ ...current, [field]: value }));
  };

  const clearPhoto = () => {
    setFile(null);
    setPreview('');
    setForm((current) => ({ ...current, imageUrl: '' }));
    if (fileRef.current) fileRef.current.value = '';
  };

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    setSuccess('');

    if (form.name.trim().length < 2) {
      setError('Give the style a name so customers know what they are booking.');
      setBusy(false);
      return;
    }

    const payload = new FormData();
    payload.append('name', form.name.trim());
    payload.append('category', form.category.trim() || suggestions[0] || 'Braids & Twists');
    payload.append('description', form.description);
    payload.append('priceFrom', form.priceFrom);
    payload.append('durationMinutes', form.durationMinutes);
    payload.append('featured', form.featured ? '1' : '0');
    payload.append('active', form.active ? '1' : '0');
    if (form.imageUrl && !file) payload.append('imageUrl', form.imageUrl);
    if (file) payload.append('image', file);

    try {
      const response = editing
        ? await api.adminUpdateStyle(editing.id, payload)
        : await api.adminCreateStyle(payload);

      setSuccess(
        editing ? `“${response.style.name}” updated.` : `“${response.style.name}” is now on the menu.`
      );
      onSaved?.(response.style);
      if (!editing) {
        setForm(emptyForm);
        clearPhoto();
      }
    } catch (saveError) {
      setError(saveError.message);
      onError?.(saveError);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="form-card" onSubmit={submit}>
      <span className="eyebrow">{editing ? 'Edit style' : 'Add a new style'}</span>
      <h3 style={{ marginBottom: '1.2rem' }}>
        {editing ? `Editing: ${editing.name}` : 'Upload a style to the menu'}
      </h3>

      <Alert type="error">{error}</Alert>
      <Alert type="success">{success}</Alert>

      {/* photo dropzone / preview */}
      {preview ? (
        <div className="preview" style={{ marginBottom: '1rem' }}>
          <img src={preview} alt="Preview" />
          <button type="button" className="preview__remove" onClick={clearPhoto} aria-label="Remove photo">
            ✕
          </button>
        </div>
      ) : (
        <div
          className={`dropzone${dragging ? ' is-dragging' : ''}`}
          style={{ marginBottom: '1rem' }}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); chooseFile(e.dataTransfer.files[0]); }}
        >
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={(e) => chooseFile(e.target.files[0])}
          />
          <span className="eyebrow" style={{ margin: 0 }}>Drop a photo here</span>
          <p className="dropzone__hint">JPG, PNG, WEBP or AVIF · max {MAX_MB} MB</p>
        </div>
      )}

      <div className="form">
        <div className="field field--full">
          <label htmlFor="style-name">Style name *</label>
          <input
            id="style-name"
            value={form.name}
            onChange={update('name')}
            placeholder="e.g. Knotless Braids - Small"
            required
          />
        </div>

        <div className="field">
          <label htmlFor="style-category">Category</label>
          <input
            id="style-category"
            value={form.category}
            onChange={update('category')}
            placeholder="e.g. Braids & Twists"
            list="category-suggestions"
          />
          <datalist id="category-suggestions">
            {suggestions.map((name) => (
              <option key={name} value={name} />
            ))}
          </datalist>
        </div>

        <div className="field">
          <label htmlFor="style-price">Price from ($)</label>
          <input
            id="style-price"
            type="number"
            min="0"
            step="5"
            value={form.priceFrom}
            onChange={update('priceFrom')}
            placeholder="e.g. 150"
          />
        </div>

        <div className="field">
          <label htmlFor="style-duration">Chair time (minutes)</label>
          <input
            id="style-duration"
            type="number"
            min="0"
            step="15"
            value={form.durationMinutes}
            onChange={update('durationMinutes')}
            placeholder="e.g. 240"
          />
        </div>

        <div className="field field--full">
          <label htmlFor="style-desc">Description</label>
          <textarea
            id="style-desc"
            value={form.description}
            onChange={update('description')}
            placeholder="What makes this style special? What is included?"
          />
        </div>

        <div className="field">
          <label className="checkbox">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={update('featured')}
            />
            <span>Featured on the home page</span>
          </label>
        </div>

        <div className="field">
          <label className="checkbox">
            <input
              type="checkbox"
              checked={form.active}
              onChange={update('active')}
            />
            <span>Visible on the public menu</span>
          </label>
        </div>
      </div>

      <div className="btn-row" style={{ marginTop: '1.4rem' }}>
        <button type="submit" className="btn btn--gold" disabled={busy}>
          {busy ? 'Saving…' : editing ? 'Update style' : 'Add to menu'}
        </button>
        {editing && onCancelEdit && (
          <button type="button" className="btn btn--ghost" onClick={onCancelEdit}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}