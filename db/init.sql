USE fomokiller;

CREATE TABLE IF NOT EXISTS games (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  release_year INT,
  developer VARCHAR(100),
  genres VARCHAR(255),
  platforms VARCHAR(255),
  image_url VARCHAR(255),
  trailer_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO games (title, description, release_year, developer, genres, platforms, image_url, trailer_url)
VALUES
('Elden Ring', 'Un mundo abierto brutal y vasto.', 2022, 'FromSoftware', 'RPG, Aventura', 'PC, PS5, Xbox', 'https://via.placeholder.com/300x400', NULL),
('Hollow Knight', 'Metroidvania dibujado a mano.', 2017, 'Team Cherry', 'Indie, Plataformas', 'PC, Switch', 'https://via.placeholder.com/300x400', NULL),
('God of War Ragnarök', 'Kratos y Atreus contra el fin del mundo.', 2022, 'Santa Monica Studio', 'Acción, Aventura', 'PS5', 'https://via.placeholder.com/300x400', NULL),
('Stardew Valley', 'Relájate gestionando tu granja.', 2016, 'ConcernedApe', 'Simulación, Indie', 'PC, Switch, Mobile', 'https://via.placeholder.com/300x400', NULL);
