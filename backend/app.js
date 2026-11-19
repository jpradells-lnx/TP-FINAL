import express from "express";
import cors from "cors";
import { db } from "./db/pool.js";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get("/api/especialidades", async (req, res) => {
  const result = await db.query("SELECT * FROM especialidades ORDER BY id");
  res.json({ results: result.rows });
});

app.get("/api/especialidades/:id", async (req, res) => {
  const id = parseId(req.params.id);

  if (id === null) {
    res.sendStatus(400);
    return;
  }

  const result = await db.query("SELECT * FROM especialidades WHERE id = $1", [id]);

  if (result.rowCount === 0) {
    res.sendStatus(404);
    return;
  }

  res.json(result.rows[0]);
});

app.listen(3000, () => {
    console.log("Servidor escuchando en el puerto 3000");
});

function parseId(textId){
    const id = Number(texto);

    if (!Number.isInteger(id) || id < 1) return null;

    return id;
}

app.get("/api/especialidades", async (req, res) => {
    try {
        const result = await db.query(`
      SELECT 
        e.id,
        e.nombre,
        e.descripcion,
        e.monto_consulta,
        e.duracion_turno_min,
        STRING_AGG(m.nombre, ', ') AS medicos_asociados
        FROM especialidades e
        LEFT JOIN medicos m ON m.especialidad = e.id
        GROUP BY e.id
        ORDER BY e.id;
    `);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al obtener las especialidades" });
    }
})

app.get("/api/medicos", async (req, res) => {
    const { especialidad } = req.query;
    if (!especialidad) {
        return res.status(400).json({ error: "Falta la especialidad" });
    }
    try {
        const result = await db.query(
            "SELECT id, nombre, apellido FROM medicos WHERE especialidad = $1 ORDER BY apellido",
            [especialidad]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al obtener los médicos" });
    }
});