

-- Usuario de prueba: username = admin, password = 12345
-- El sistema fuerza el cambio de contraseña en el primer login.
CREATE TABLE usuario (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(255) UNIQUE,
  password_hash VARCHAR(255),
  debe_cambiar_password BOOLEAN DEFAULT TRUE
);


INSERT INTO usuario (username, password_hash, debe_cambiar_password)
VALUES ('admin', '$2b$10$tFbtu3ynJ9FlXA8OxWNq6u6YyFbkDF97ZSa8aufiJAzE8Aek040cu', TRUE);

CREATE TABLE persona (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(150),
  apellido VARCHAR(150),
  fecha_nacimiento DATE,
  rut VARCHAR(20),
  fono VARCHAR(20),
  direccion VARCHAR(150),
  tipo VARCHAR(30),
  observaciones TEXT,
  lugar_nacimiento TEXT NULL
);

CREATE TABLE reunion_prebaustizmal (
  id INT PRIMARY KEY AUTO_INCREMENT,
  fecha DATETIME,
  id_fk_persona_catequista INT,
  estado VARCHAR(50),
  FOREIGN KEY (id_fk_persona_catequista) REFERENCES persona(id)
);

CREATE TABLE tramite (
  id INT PRIMARY KEY AUTO_INCREMENT,
  fecha_ingreso DATE DEFAULT (CURRENT_DATE),
  estado VARCHAR(50) DEFAULT 'Iniciado',
  fecha_bautismo DATETIME,
  fecha_eliminacion DATETIME NULL DEFAULT NULL,
  id_fk_reunion_pre_bautizo INT NULL,
  es_historico BOOLEAN NOT NULL DEFAULT FALSE,
  FOREIGN KEY (id_fk_reunion_pre_bautizo) REFERENCES reunion_prebaustizmal (id)
);

CREATE TABLE participacion (
  id INT PRIMARY KEY AUTO_INCREMENT,
  id_fk_persona INT,
  id_fk_tramite INT,
  rol VARCHAR(30),
  UNIQUE (id_fk_persona, id_fk_tramite),
  FOREIGN KEY (id_fk_persona) REFERENCES persona(id),
  FOREIGN KEY (id_fk_tramite) REFERENCES tramite(id)
);

CREATE TABLE documento (
  id INT PRIMARY KEY AUTO_INCREMENT,
  tipo_documento VARCHAR(30),
  estado_documento VARCHAR(30),
  fecha_entrega DATE,
  id_fk_participacion INT,
  FOREIGN KEY (id_fk_participacion) REFERENCES participacion(id) ON DELETE CASCADE
);


