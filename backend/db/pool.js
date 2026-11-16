import pg from "pg";

export const db = new pg.Pool({
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "postgres",
    database: "turnos_medicos"
});

db.on("error", (err) => {
    console.error("Error en la conexion con la base: ", err.message);
});