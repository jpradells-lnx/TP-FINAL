CREATE TABLE Medicos (
ID SERIAL PRIMARY KEY,
especialidad REFERENCES especialidad.id,
nombre VARCHAR(50) NOT NULL,
apellido VARCHAR(50) NOT NULL,
fechaDeNacimiento DATE NOT NULL,
mail VARCHAR(50),
);

CREATE TABLE Pacientes (
id SERIAL PRIMARY KEY,
dni INT NOT NULL,
nombre VARCHAR(50) NOT NULL,
apellido VARCHAR(50) NOT NULL,
fechaDeNacimiento DATE NOT NULL,
historiaClinica VARCHAR(1000),
);

CREATE TABLE Turnos (
id SERIAL PRIMARY KEY,
hora TIME NOT NULL,
fecha DATE NOT NULL,
estado VARCHAR(20) NOT NULL
pacienteAsociado INT REFERENCES paciente(id),
medicoAsociado INT REFERENCES medico(id),
);

CREATE TABLE Especialidades (
id SERIAL PRIMARY KEY,
nombre VARCHAR(50) NOT NULL,
descripción VARCHAR(100),
monto_consulta INT NOT NULL,
duracion_turno_min INT NOT NULL DEFAULT 30,
medicosDisponibles BOOLEAN,
);