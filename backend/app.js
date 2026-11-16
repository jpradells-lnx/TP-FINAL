import express from "express";
import cors from "cors";
import { db } from "./db/pool.js";

const app = express();
const port = 3000;

app.use(cors());

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
        const result = await db.query("SELECT * FROM especialidades ORDER BY nombre");
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al obtener las especialidades" });
    }
})