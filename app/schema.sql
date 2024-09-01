CREATE TABLE sections (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  image VARCHAR(255) NOT NULL
);

CREATE TABLE items (
  id SERIAL PRIMARY KEY,
  section_id INTEGER REFERENCES sections(id),
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  description TEXT,
  image VARCHAR(255) NOT NULL
);