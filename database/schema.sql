-- schema.sql
-- Script de inicialización de la base de datos para SIEAD

CREATE TABLE Usuario (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    tipo_rol VARCHAR(50) NOT NULL -- 'ASPIRANTE' o 'ADMIN'
);

-- Tabla para almacenar la información específica de un Aspirante.
-- Se relaciona 1 a 1 con Usuario.
CREATE TABLE Aspirante (
    usuario_id INT PRIMARY KEY REFERENCES Usuario(id) ON DELETE CASCADE,
    ruta_cv VARCHAR(255),
    datos_extraidos JSONB,
    puntaje_final FLOAT DEFAULT 0.0
);

CREATE TABLE Convocatoria (
    id SERIAL PRIMARY KEY,
    nombre_convocatoria VARCHAR(255) NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    fecha_cierre DATE NOT NULL
);

CREATE TABLE Postulacion (
    id SERIAL PRIMARY KEY,
    usuario_id INT NOT NULL REFERENCES Usuario(id) ON DELETE CASCADE,
    convocatoria_id INT NOT NULL REFERENCES Convocatoria(id) ON DELETE CASCADE,
    fecha_postulacion DATE NOT NULL,
    estado VARCHAR(50) NOT NULL, -- 'PENDIENTE', 'EVALUADO', 'RECHAZADO'
    ruta_cv VARCHAR(255) -- Se guarda un registro de la ruta por si se actualiza a futuro
);

CREATE TABLE Requisito (
    id SERIAL PRIMARY KEY,
    convocatoria_id INT NOT NULL REFERENCES Convocatoria(id) ON DELETE CASCADE,
    descripcion TEXT NOT NULL,
    peso FLOAT NOT NULL,
    valor_minimo FLOAT NOT NULL
);

CREATE TABLE Resultado (
    id SERIAL PRIMARY KEY,
    postulacion_id INT NOT NULL UNIQUE REFERENCES Postulacion(id) ON DELETE CASCADE,
    puntaje_total FLOAT NOT NULL,
    observaciones TEXT
);

-- Índices adicionales para rendimiento
CREATE INDEX idx_usuario_email ON Usuario(email);
CREATE INDEX idx_postulacion_usuario ON Postulacion(usuario_id);
CREATE INDEX idx_postulacion_convocatoria ON Postulacion(convocatoria_id);
CREATE INDEX idx_requisito_convocatoria ON Requisito(convocatoria_id);
