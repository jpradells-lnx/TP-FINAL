import express from "express";
import cors from "cors";
import { db } from "./db/pool.js";

const app = express();
const port = 3000;

app.use(cors());

function parseId(textId){
    const id = Number(texto);

    if (!Number.isInteger(id) || id < 1) return null;

    return id;
}

app.get("/api/especialidades", async (req, res) => {
    const result = await db.query("SELECT * FROM especialidades ORDER BY nombre");
    res.json({ results: result.rows });
})