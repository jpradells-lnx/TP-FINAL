-- ESPECIALIDADES (ids 1 a 6)
INSERT INTO especialidades (nombre, descripcion, monto_consulta, duracion_turno_min, medicosDisponibles) VALUES
('Clínica Médica', 'Atención general y control de salud del adulto', 18000, 30, TRUE),
('Pediatría', 'Atención de niños y adolescentes', 20000, 30, TRUE),
('Cardiología', 'Diagnóstico y control de enfermedades del corazón', 28000, 40, TRUE),
('Dermatología', 'Cuidado y tratamiento de la piel', 25000, 20, TRUE),
('Traumatología', 'Lesiones de huesos, músculos y articulaciones', 26000, 30, TRUE),
('Oftalmología', 'Control de la vista y enfermedades oculares', 24000, 30, FALSE);

-- MÉDICOS (ids 1 a 9; Oftalmología queda sin médicos a propósito)
INSERT INTO medicos (especialidad, nombre, apellido, fechaDeNacimiento, mail) VALUES
(1, 'Laura', 'Fernández', '1978-03-14', 'laura.fernandez@turnosmedicos.com'),
(1, 'Martín', 'Gómez', '1985-07-22', 'martin.gomez@turnosmedicos.com'),
(2, 'Sofía', 'Ramírez', '1982-11-05', 'sofia.ramirez@turnosmedicos.com'),
(2, 'Diego', 'Herrera', '1975-01-30', 'diego.herrera@turnosmedicos.com'),
(3, 'Alejandro', 'Costa', '1970-09-18', 'alejandro.costa@turnosmedicos.com'),
(3, 'Valeria', 'Núñez', '1983-05-27', 'valeria.nunez@turnosmedicos.com'),
(4, 'Carolina', 'Ibáñez', '1988-12-09', 'carolina.ibanez@turnosmedicos.com'),
(5, 'Javier', 'Molina', '1980-04-16', 'javier.molina@turnosmedicos.com'),
(5, 'Lucía', 'Benítez', '1990-08-03', 'lucia.benitez@turnosmedicos.com');

-- PACIENTES (ids 1 a 8, datos inventados)
INSERT INTO pacientes (dni, nombre, apellido, fechaDeNacimiento, historiaClinica) VALUES
(30111222, 'Martina', 'López', '1992-02-11', 'Sin antecedentes relevantes.'),
(28456789, 'Federico', 'Suárez', '1987-06-25', 'Control anual al día.'),
(40222333, 'Camila', 'Rodríguez', '2000-10-02', NULL),
(35777888, 'Nicolás', 'Pereyra', '1994-12-19', 'Consulta previa por dolor de rodilla.'),
(22999000, 'Graciela', 'Domínguez', '1965-04-07', 'Seguimiento cardiológico.'),
(45123456, 'Tomás', 'Acosta', '2015-09-14', 'Vacunas completas.'),
(33444555, 'Julieta', 'Vega', '1991-01-28', NULL),
(27888999, 'Ricardo', 'Silva', '1979-08-30', 'Control de presión arterial.');

-- TURNOS (fechas futuras, sin repetir médico + fecha + hora)
INSERT INTO turnos (hora, fecha, estado, pacienteAsociado, medicoAsociado) VALUES
('09:00', '2026-11-23', 'reservado', 1, 1),
('09:30', '2026-11-23', 'reservado', 2, 1),
('10:00', '2026-11-23', 'reservado', 3, 2),
('11:00', '2026-11-24', 'reservado', 6, 3),
('08:30', '2026-11-24', 'reservado', 5, 5),
('09:10', '2026-11-24', 'cancelado', 8, 5),
('15:00', '2026-11-25', 'reservado', 4, 8),
('15:30', '2026-11-25', 'reservado', 7, 7),
('10:00', '2026-11-18', 'atendido', 2, 2),
('16:00', '2026-11-26', 'reservado', 1, 9);