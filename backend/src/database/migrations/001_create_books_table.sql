CREATE DATABASE IF NOT EXISTS library_db;
USE library_db;

CREATE TABLE IF NOT EXISTS books (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    isbn VARCHAR(20) UNIQUE NOT NULL,
    published_year INT NOT NULL,
    genre VARCHAR(100) NOT NULL,
    available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_author (author),
    INDEX idx_genre (genre),
    INDEX idx_available (available),
    INDEX idx_isbn (isbn)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertion de données de test
INSERT INTO books (title, author, isbn, published_year, genre, available) VALUES
('Clean Code', 'Robert C. Martin', '9780132350884', 2008, 'Technology', true),
('The Pragmatic Programmer', 'David Thomas', '9780201616224', 1999, 'Technology', true),
('Design Patterns', 'Erich Gamma', '9780201633610', 1994, 'Technology', false),
('The Art of Computer Programming', 'Donald Knuth', '9780201896831', 1968, 'Science', true),
('Sapiens', 'Yuval Noah Harari', '9780062316097', 2011, 'History', true),
('1984', 'George Orwell', '9780451524935', 1949, 'Fiction', true),
('Le Petit Prince', 'Antoine de Saint-Exupéry', '9782070408504', 1943, 'Fiction', true);