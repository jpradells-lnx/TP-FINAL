import { Router } from "express";
import { parseId } from "./esp_validaciones.js";
import { getEspecialidades, getEspecialidad, borrarEspecialidad, getMedicosPorEspecialidad, getTurnosLibres } from "./db/queries.js";

const router = Router();

router.get("/", async (req, res) => {
    try {
        res.json(await getEspecialidades());
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al obtener las especialidades" });
    }
});

router.get("/:id", async (req, res) => {
    const id = parseId(req.params.id);

    if (id === null) {
        res.sendStatus(400);
        return;
    }

    try {
        const especialidad = await getEspecialidad(id);
        if (!especialidad) {
            res.sendStatus(404)
            res.json(especialidad);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al obtener la especialidad" });
    }
});

router.delete("/:id", async (req, res) => {
    const id = parseId(req.params.id);
    if (id === null) return res.sendStatus(400);
    try {
        const borradas = await borrarEspecialidad(id);
        if (borradas === 0) {
            return res.sendStatus(404);
        }
        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al eliminar la especialidad" });
    }
});

router.get("/", async (req, res) => {
    const { especialidad } = req.query;
    if (!especialidad) {
        return res.status(400).json({ error: "Falta la especialidad" });
    }
    try {
        res.json(await getMedicosPorEspecialidad(especialidad));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al obtener los médicos por especialidad" });
    }
});

router.get("/:idMedico", async (req, res) => {
    const idMedico = parseId(req.params.idMedico);
    if (idMedico === null) return res.sendStatus(400).json({ error: "ID de médico inválido" });
    try {
        res.json(await getTurnosLibres(idMedico));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al obtener los turnos libres" });
    }
});

export default router;