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