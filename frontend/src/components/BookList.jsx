import React, { useState, useEffect } from 'react';
import BookCard from './BookCard';
import BookForm from './BookForm';
import { apiService } from '../services/api';
import toast, { Toaster } from 'react-hot-toast';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGenre, setFilterGenre] = useState('');
  const [stats, setStats] = useState({ total: 0, available: 0, borrowed: 0 });
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    loadBooks();
    loadStats();
  }, []);

  const loadBooks = async () => {
    try {
      const response = await apiService.getBooks();
      setBooks(response.data || []);
      // Extract unique genres
      const uniqueGenres = [...new Set((response.data || []).map((b) => b.genre).filter(Boolean))];
      setGenres(uniqueGenres);
    } catch (error) {
      toast.error('Erreur lors du chargement des livres');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await apiService.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const handleCreateBook = async (bookData) => {
    try {
      await apiService.createBook(bookData);
      toast.success('Livre ajouté avec succès !');
      setShowForm(false);
      loadBooks();
      loadStats();
    } catch (error) {
      toast.error(error.message || 'Erreur lors de l\'ajout');
    }
  };

  const handleBorrow = async (id) => {
    try {
      await apiService.borrowBook(id);
      toast.success('Livre emprunté !');
      loadBooks();
      loadStats();
    } catch (error) {
      toast.error(error.message || 'Erreur lors de l\'emprunt');
    }
  };

  const handleReturn = async (id) => {
    try {
      await apiService.returnBook(id);
      toast.success('Livre retourné !');
      loadBooks();
      loadStats();
    } catch (error) {
      toast.error(error.message || 'Erreur lors du retour');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce livre ?')) {
      try {
        await apiService.deleteBook(id);
        toast.success('Livre supprimé');
        loadBooks();
        loadStats();
      } catch (error) {
        toast.error(error.message || 'Erreur lors de la suppression');
      }
    }
  };

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      searchTerm === '' ||
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = filterGenre === '' || book.genre === filterGenre;
    return matchesSearch && matchesGenre;
  });

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner">Chargement des livres...</div>
      </div>
    );
  }

  return (
    <div>
      <Toaster position="top-right" toastOptions={{ className: 'toast-success' }} />

      <header className="header">
        <div className="container">
          <h1>📚 Library Management System</h1>
        </div>
      </header>

      <main className="container">
        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card stat-blue">
            <div className="stat-number">{stats.total}</div>
            <div className="stat-label">Total des livres</div>
          </div>
          <div className="stat-card stat-green">
            <div className="stat-number">{stats.available}</div>
            <div className="stat-label">Disponibles</div>
          </div>
          <div className="stat-card stat-orange">
            <div className="stat-number">{stats.borrowed}</div>
            <div className="stat-label">Empruntés</div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="search-section">
          <div className="search-form">
            <input
              type="text"
              className="search-input"
              placeholder="🔍 Rechercher par titre ou auteur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="search-select"
              value={filterGenre}
              onChange={(e) => setFilterGenre(e.target.value)}
            >
              <option value="">Tous les genres</option>
              {genres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
            <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
              {showForm ? 'Annuler' : '+ Ajouter un livre'}
            </button>
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <div className="form-section">
            <div className="form-title">Ajouter un nouveau livre</div>
            <BookForm onSubmit={handleCreateBook} onCancel={() => setShowForm(false)} />
          </div>
        )}

        {/* Books Grid */}
        {filteredBooks.length === 0 ? (
          <div className="empty-state">
            {books.length === 0
              ? '✨ Aucun livre dans la bibliothèque. Ajoutez-en un !'
              : 'Aucun livre ne correspond à votre recherche'}
          </div>
        ) : (
          <div className="books-grid">
            {filteredBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onBorrow={handleBorrow}
                onReturn={handleReturn}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default BookList;