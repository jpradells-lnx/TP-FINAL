import { Router } from "express";
import { parseId, ESTADOS_TURNO } from "./esp_validaciones.js";
import { getMedicosPorEspecialidad, existeEspecialidad, existeMedico, getTurnosDeMedico } from "./db/queries.js";

const router = Router();

router.get("/", async (req, res) => {
    const idEspecialidad = parseId(req.query.especialidad);
    if (idEspecialidad === null) return res.status(400).json({ error: "ID de especialidad inválido" });

    if (!(await existeEspecialidad(idEspecialidad))) {
        return res.status(404).json({ error: "Especialidad no encontrada" });
    }

    res.json(await getMedicosPorEspecialidad(idEspecialidad));
});

router.get("/:id/turnos", async (req, res) => {
    const idMedico = parseId(req.params.id);
    if (idMedico === null) return res.status(400).json({ error: "ID de médico inválido" });

    const { estado } = req.query;
    if (estado !== undefined && !ESTADOS_TURNO.includes(estado)) {
        return res.status(400).json({ error: `Estado inválido. Valores posibles: ${ESTADOS_TURNO.join(", ")}` });
    }

    if (!(await existeMedico(idMedico))) {
        return res.status(404).json({ error: "Médico no encontrado" });
    }

    res.json(await getTurnosDeMedico(idMedico, estado));
});

export default router;
