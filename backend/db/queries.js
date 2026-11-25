import { db } from "./pool.js";

export async function getEspecialidad() {
    const result = await db.query("SELECT * FROM especialidades WHERE id = $1", [id]);
    return result.rows[0];
}

export async function getEspecialidades() {
    const result = await db.query(`
      SELECT 
        e.id,
        e.nombre,
        e.descripcion,
        e.monto_consulta,
        e.duracion,
        STRING_AGG(
        CONCAT_WS(' ', m.nombre, m.apellido),', ') AS medicos_asociados
        FROM especialidades e
        LEFT JOIN medicos m ON m.especialidad = e.id
        GROUP BY e.id
        ORDER BY e.id;
    `);
    return result.rows;
}

export async function borrarEspecialidad(id) {
    const result = await db.query("DELETE FROM especialidades WHERE id = $1", [id]);
    return result.rowCount;
}

export async function getMedicosPorEspecialidad(especialidad) {
    const result = await db.query(
        "SELECT id, nombre, apellido FROM medicos WHERE especialidad = $1 ORDER BY apellido",
        [especialidad]
    );
    return result.rows;
}

export async function getTurnosLibres(idMedico) {
    const result = await db.query(`
        SELECT 
        TO_CHAR(t.hora, 'HH24:MI') AS hora,
        TO_CHAR(t.fecha, 'YYYY-MM-DD') AS fecha
        FROM turnos t WHERE t.estado = 'libre' AND t.medicoAsociado = $1 ORDER BY t.fecha, t.hora`,[idMedico]);
    return result.rows;
}
