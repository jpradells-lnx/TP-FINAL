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
