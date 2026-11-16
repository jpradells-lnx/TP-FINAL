import pg from "pg";

export const db = new pg.Pool({
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_NAME || "turnos_medicos"
});

db.on("error", (err) => {
    console.error("Error en la conexion con la base: ", err.message);
});