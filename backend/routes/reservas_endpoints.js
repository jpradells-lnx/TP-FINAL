import { Router } from "express";
import { parseId, parseDni } from "../utils/validaciones.js";
import { getPacientePorDni, reservarTurno } from "../db/queries.js";

const router = Router();

// Body: { dni, especialidad, medico?, turno? }
// Sin médico: reserva el primer turno libre de la especialidad.
// Con médico: el primer turno libre de ese médico, o el turno indicado.
router.post("/", async (req, res) => {
    const { dni, especialidad, medico, turno } = req.body ?? {};

    const dniPaciente = parseDni(dni);
    if (dniPaciente === null) return res.status(400).json({ error: "DNI inválido" });

    const idEspecialidad = parseId(especialidad);
    if (idEspecialidad === null) return res.status(400).json({ error: "ID de especialidad inválido" });

    const idMedico = medico == null || medico === "" ? null : parseId(medico);
    if (idMedico === null && medico != null && medico !== "") {
        return res.status(400).json({ error: "ID de médico inválido" });
    }

    const idTurno = turno == null || turno === "" ? null : parseId(turno);
    if (idTurno === null && turno != null && turno !== "") {
        return res.status(400).json({ error: "ID de turno inválido" });
    }

    const paciente = await getPacientePorDni(dniPaciente);
    if (!paciente) return res.status(404).json({ error: "No hay ningún paciente registrado con ese DNI" });

    const reservado = await reservarTurno({ idPaciente: paciente.id, idEspecialidad, idMedico, idTurno });
    if (!reservado) {
        const error = idTurno
            ? "El turno elegido ya no está disponible"
            : idMedico
                ? "Este médico no tiene turnos disponibles"
                : "No hay turnos disponibles para esta especialidad";
        return res.status(409).json({ error });
    }

    res.status(201).json({ ...reservado, paciente });
});

export default router;
