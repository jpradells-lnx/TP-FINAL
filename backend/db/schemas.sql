CREATE TABLE pacientes (
id SERIAL PRIMARY KEY,
dni INT NOT NULL,
nombre VARCHAR(50) NOT NULL,
apellido VARCHAR(50) NOT NULL,
fechaDeNacimiento DATE NOT NULL,
historiaClinica VARCHAR(1000)
);

CREATE TABLE especialidades (
id SERIAL PRIMARY KEY,
nombre VARCHAR(50) NOT NULL,
descripción VARCHAR(100),
monto_consulta INT NOT NULL,
duracion_turno_min INT NOT NULL DEFAULT 30,
medicosDisponibles BOOLEAN
);

CREATE TABLE medicos (
ID SERIAL PRIMARY KEY,
especialidad INT REFERENCES especialidades(id),
nombre VARCHAR(50) NOT NULL,
apellido VARCHAR(50) NOT NULL,
fechaDeNacimiento DATE NOT NULL,
mail VARCHAR(50)
);


CREATE TABLE turnos (
id SERIAL PRIMARY KEY,
hora TIME NOT NULL,
fecha DATE NOT NULL,
estado VARCHAR(20) NOT NULL,
pacienteAsociado INT REFERENCES pacientes(id),
medicoAsociado INT REFERENCES medicos(id)
);