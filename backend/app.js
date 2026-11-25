import express from "express";
import cors from "cors";
import { db } from "./db/pool.js";
import especialidadesRouter from "./esp_endpoints.js";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use("/api/especialidades", especialidadesRouter);

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});