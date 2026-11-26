import { Router } from "express";
import { parseDni } from "../utils/validaciones.js";
import { getPacientePorDni, crearPaciente } from "../db/queries.js";

const router = Router();

router.post("/", async (req, res) => {
    const { dni, nombre, apellido, fechaDeNacimiento, historiaClinica } = req.body ?? {};

    const dniPaciente = parseDni(dni);

    if (dniPaciente === null) {
        return res.status(400).json({ error: "DNI inválido" });
    }    
    
    if (!nombre || /[0-9]/.test(nombre)) {
    return res.status(400).json({
        error: "Nombre inválido"
    });
    }

    if (!apellido || /[0-9]/.test(apellido)) {
    return res.status(400).json({
        error: "Apellido inválido"
    });
    }
    
    const paciente = await getPacientePorDni(dniPaciente);
    if (paciente) {
    return res.status(409).json({
        error: "Ya existe un paciente registrado con ese DNI"
    });
    }
        const fecha = new Date(fechaDeNacimiento + "T00:00:00");

        if (fecha > new Date()) {
            return res.status(400).json({
                error: "La fecha de nacimiento no puede ser futura"
            });
        }

        const fechaDieciocho = new Date();
        fechaDieciocho.setFullYear(fechaDieciocho.getFullYear() - 18);

        if (fecha > fechaDieciocho) {
            return res.status(400).json({
                error: "El paciente debe ser mayor de edad"
            });
        }
    
        if (historiaClinica && /[0-9]/.test(historiaClinica)) {
        return res.status(400).json({
        error: "La historia clínica no puede contener números"
        });
        }

        try {
            const nuevoPaciente = await crearPaciente({
                dni: dniPaciente,
                nombre,
                apellido,
                fechaDeNacimiento,
                historiaClinica: historiaClinica || null
            });
        //201 porque estamos creando un nuevo recurso en la base dedatos
            return res.status(201).json({
                mensaje: "Paciente registrado correctamente",
                paciente: nuevoPaciente
            });

        } catch (error) {
            console.error(error);

            return res.status(500).json({
                error: "No se pudo registrar al paciente"
            });
        }

});


export default router;
