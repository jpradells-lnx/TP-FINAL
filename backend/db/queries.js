import { db } from "./pool.js";

const SELECT_ESPECIALIDAD = `
    SELECT
        e.id,
        e.nombre,
        e.descripcion,
        e.monto_consulta,
        e.duracion,
        COALESCE(
            JSON_AGG(
                JSON_BUILD_OBJECT('id', m.id, 'nombre', m.nombre, 'apellido', m.apellido)
                ORDER BY m.apellido
            ) FILTER (WHERE m.id IS NOT NULL),
            '[]'
        ) AS medicos
    FROM especialidades e
    LEFT JOIN medicos m ON m.especialidad = e.id
`;

export async function getEspecialidades() {
    const result = await db.query(`${SELECT_ESPECIALIDAD} GROUP BY e.id ORDER BY e.id`);
    return result.rows;
}

export async function getEspecialidad(id) {
    const result = await db.query(`${SELECT_ESPECIALIDAD} WHERE e.id = $1 GROUP BY e.id`, [id]);
    return result.rows[0];
}

export async function existeEspecialidad(id) {
    const result = await db.query("SELECT 1 FROM especialidades WHERE id = $1", [id]);
    return result.rowCount > 0;
}

export async function borrarEspecialidad(id) {
    const result = await db.query("DELETE FROM especialidades WHERE id = $1", [id]);
    return result.rowCount;
}

export async function getMedicosPorEspecialidad(idEspecialidad) {
    const result = await db.query(
        "SELECT id, nombre, apellido FROM medicos WHERE especialidad = $1 ORDER BY apellido",
        [idEspecialidad]
    );
    return result.rows;
}

export async function existeMedico(id) {
    const result = await db.query("SELECT 1 FROM medicos WHERE id = $1", [id]);
    return result.rowCount > 0;
}

export async function getTurnosDeMedico(idMedico, estado) {
    const result = await db.query(`
        SELECT
            t.id,
            TO_CHAR(t.fecha, 'YYYY-MM-DD') AS fecha,
            TO_CHAR(t.hora, 'HH24:MI') AS hora,
            t.estado
        FROM turnos t
        WHERE t.medicoAsociado = $1
          AND ($2::VARCHAR IS NULL OR t.estado = $2)
        ORDER BY t.fecha, t.hora`,
        [idMedico, estado ?? null]
    );
    return result.rows;
}

export async function getPacientePorDni(dni) {
    const result = await db.query("SELECT id, nombre, apellido FROM pacientes WHERE dni = $1 LIMIT 1", [dni]);
    return result.rows[0];
}

// Busca y reserva en una sola query el primer turno libre y futuro que cumpla los filtros:
// siempre la especialidad, y opcionalmente un médico y/o un turno puntual.
// FOR UPDATE SKIP LOCKED evita que dos pedidos simultáneos reserven el mismo turno.
export async function reservarTurno({ idPaciente, idEspecialidad, idMedico, idTurno }) {
    const result = await db.query(`
        WITH elegido AS (
            SELECT t.id
            FROM turnos t
            JOIN medicos m ON m.id = t.medicoAsociado
            WHERE t.estado = 'libre'
              AND m.especialidad = $2
              AND ($3::INT IS NULL OR m.id = $3)
              AND ($4::INT IS NULL OR t.id = $4)
              AND t.fecha + t.hora > LOCALTIMESTAMP
            ORDER BY t.fecha, t.hora
            LIMIT 1
            FOR UPDATE OF t SKIP LOCKED
        )
        UPDATE turnos t
        SET estado = 'reservado', pacienteAsociado = $1
        FROM elegido e, medicos m
        WHERE t.id = e.id AND m.id = t.medicoAsociado
        RETURNING
            t.id,
            TO_CHAR(t.fecha, 'YYYY-MM-DD') AS fecha,
            TO_CHAR(t.hora, 'HH24:MI') AS hora,
            JSON_BUILD_OBJECT('id', m.id, 'nombre', m.nombre, 'apellido', m.apellido) AS medico`,
        [idPaciente, idEspecialidad, idMedico ?? null, idTurno ?? null]
    );
    return result.rows[0];
}


export async function crearPaciente({dni, contra, nombre, apellido, fechaDeNacimiento, historiaClinica}){
    const result = await db.query(`INSERT INTO pacientes 
        (dni, contra, nombre, apellido, fechaDeNacimiento, historiaClinica) VALUES ($1,$2,$3,$4,$5,$6)
        RETURNING id, dni, nombre, apellido`,
        [dni, contra, nombre, apellido, fechaDeNacimiento, historiaClinica ?? null]);
        return result.rows[0];
}

// Devuelve el paciente si el DNI y la contraseña coinciden, o undefined si no
export async function getPacienteLogin(dni, contra) {
    const result = await db.query(
        "SELECT id, dni, nombre, apellido FROM pacientes WHERE dni = $1 AND contra = $2 LIMIT 1",
        [dni, contra]
    );
    return result.rows[0];
}

export async function crearEspecialidad({ nombre, descripcion, monto, duracion }) {
    const result = await db.query(`INSERT INTO especialidades 
        (nombre, descripcion, monto_consulta, duracion) 
        VALUES ($1, $2, $3, $4) RETURNING *`,
        [nombre, descripcion, monto, duracion]);
    return result.rows[0];
}