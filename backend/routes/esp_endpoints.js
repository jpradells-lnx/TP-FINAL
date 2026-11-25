import { Router } from "express";
import { parseId } from "./esp_validaciones.js";
import { getEspecialidades, getEspecialidad, borrarEspecialidad } from "./db/queries.js";

const router = Router();

router.get("/", async (req, res) => {
    res.json(await getEspecialidades());
});

router.get("/:id", async (req, res) => {
    const id = parseId(req.params.id);
    if (id === null) return res.status(400).json({ error: "ID de especialidad inválido" });

    const especialidad = await getEspecialidad(id);
    if (!especialidad) return res.status(404).json({ error: "Especialidad no encontrada" });

    res.json(especialidad);
});

router.delete("/:id", async (req, res) => {
    const id = parseId(req.params.id);
    if (id === null) return res.status(400).json({ error: "ID de especialidad inválido" });

    const borradas = await borrarEspecialidad(id);
    if (borradas === 0) return res.status(404).json({ error: "Especialidad no encontrada" });

    res.sendStatus(204);
});

export default router;
