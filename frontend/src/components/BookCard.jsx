import React from 'react';

const BookCard = ({ book, onBorrow, onReturn, onDelete }) => {
  return (
    <div className="book-card">
      <div className="book-card-content">
        <div className="book-card-header">
          <div className="book-title">{book.title}</div>
          <span className={`book-status ${book.available ? 'status-available' : 'status-borrowed'}`}>
            {book.available ? 'Disponible' : 'Emprunté'}
          </span>
        </div>
        
        <div className="book-author">👤 {book.author}</div>
        <div className="book-detail">📚 ISBN: {book.isbn}</div>
        <div className="book-detail">📅 {book.published_year}</div>
        <div className="book-genre">{book.genre}</div>
        
        <div className="book-actions">
          {book.available && onBorrow && (
            <button className="btn-borrow" onClick={() => onBorrow(book.id)}>
              📖 Emprunter
            </button>
          )}
          {!book.available && onReturn && (
            <button className="btn-return" onClick={() => onReturn(book.id)}>
              ↩️ Retourner
            </button>
          )}
          {onDelete && (
            <button className="btn-delete" onClick={() => onDelete(book.id)}>
              🗑️
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookCard;