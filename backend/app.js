import express from "express";
import cors from "cors";
import especialidadesRouter from "./routes/esp_endpoints.js";
import medicosRouter from "./routes/medicos_endpoints.js";
import reservasRouter from "./routes/reservas_endpoints.js";
import pacientesRouter from "./routes/pacientes_endpoints.js";
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api/especialidades", especialidadesRouter);
app.use("/api/medicos", medicosRouter);
app.use("/api/reservas", reservasRouter);
app.use("/api/pacientes", pacientesRouter);

app.use((req, res) => {
    res.status(404).json({ error: "Ruta no encontrada" });
});

// Express 5 forwards errors thrown in async handlers here.
app.use((err, req, res, next) => {
    const status = err.status ?? err.statusCode ?? 500;
    if (status >= 500) console.error(err);
    res.status(status).json({ error: status >= 500 ? "Error interno del servidor" : err.message });
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
