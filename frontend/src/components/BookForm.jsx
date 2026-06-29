import React, { useState } from 'react';

const BookForm = ({ onSubmit, initialData = null, onCancel }) => {
  const [formData, setFormData] = useState(
    initialData || {
      title: '',
      author: '',
      isbn: '',
      published_year: new Date().getFullYear(),
      genre: '',
    }
  );
  const [loading, setLoading] = useState(false);

  const genres = ['Fiction', 'Non-Fiction', 'Science', 'History', 'Technology', 'Art', 'Biography'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit(formData);
    setLoading(false);
    if (!initialData) {
      setFormData({
        title: '',
        author: '',
        isbn: '',
        published_year: new Date().getFullYear(),
        genre: '',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">Titre *</label>
          <input
            type="text"
            required
            className="form-input"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Le Petit Prince"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Auteur *</label>
          <input
            type="text"
            required
            className="form-input"
            value={formData.author}
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            placeholder="Antoine de Saint-Exupéry"
          />
        </div>

        <div className="form-group">
          <label className="form-label">ISBN *</label>
          <input
            type="text"
            required
            className="form-input"
            value={formData.isbn}
            onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
            placeholder="978-2-07-040850-4"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Année de publication</label>
          <input
            type="number"
            className="form-input"
            value={formData.published_year}
            onChange={(e) =>
              setFormData({ ...formData, published_year: parseInt(e.target.value) })
            }
          />
        </div>

        <div className="form-group">
          <label className="form-label">Genre</label>
          <select
            className="form-select"
            value={formData.genre}
            onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
          >
            <option value="">Sélectionner un genre</option>
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Ajout en cours...' : initialData ? 'Mettre à jour' : 'Ajouter le livre'}
        </button>
        {onCancel && (
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Annuler
          </button>
        )}
      </div>
    </form>
  );
};

export default BookForm;