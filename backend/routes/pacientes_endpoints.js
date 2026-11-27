import { Router } from "express";
import { parseDni, parseId } from "../utils/validaciones.js";
import { getPacientePorDni, getPacientePorId, getPacienteLogin, crearPaciente } from "../db/queries.js";

const router = Router();

const REGEX_NOMBRE = /^[\p{L}][\p{L} '-]{0,49}$/u;
const MAX_HISTORIA_CLINICA = 1000;
const EDAD_MINIMA = 3;
const MIN_CONTRA = 4;
const MAX_CONTRA = 12;
// Al menos una mayúscula, una minúscula, un número y un carácter especial (cualquier cosa que no sea letra ni número)
const REGEX_CONTRA = /^(?=.*\p{Lu})(?=.*\p{Ll})(?=.*\d)(?=.*[^\p{L}\d]).+$/u;

router.get("/:id", async (req, res) => {
   const id = parseId(req.params.id);
   if (id === null) return res.status(400).json({error: "Id invalido"});

   try {
        const paciente = await getPacientePorId(id);
        if (!paciente) return res.status(404).json({error: "Paciente no encontrado"});
        return res.json(paciente);
   } catch (error) {
        console.error(error);
        return res.status(500).json({error: "No se pudo obtener el paciente"});
   }
});

router.post("/login", async (req, res) => {
    const { dni, contra } = req.body ?? {};

    const dniPaciente = parseDni(dni);
    if (dniPaciente === null || typeof contra !== "string" || contra.length === 0) {
        return res.status(400).json({ error: "DNI o contraseña inválidos" });
    }

    try {
        const paciente = await getPacienteLogin(dniPaciente, contra);
        if (!paciente) {
            return res.status(401).json({ error: "DNI o contraseña incorrectos" });
        }
        return res.json(paciente);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "No se pudo iniciar sesión" });
    }
});

router.post("/", async (req, res) => {
    const { dni, contra, nombre, apellido, fechaDeNacimiento, historiaClinica } = req.body ?? {};

    const dniPaciente = parseDni(dni);
    if (dniPaciente === null) {
        return res.status(400).json({ error: "DNI inválido" });
    }

    if (typeof contra !== "string" || contra.length < MIN_CONTRA || contra.length > MAX_CONTRA) {
        return res.status(400).json({
            error: `La contraseña debe tener entre ${MIN_CONTRA} y ${MAX_CONTRA} caracteres`
        });
    }
    if (!REGEX_CONTRA.test(contra)) {
        return res.status(400).json({
            error: "La contraseña debe tener al menos una mayúscula, una minúscula, un número y un carácter especial"
        });
    }

    const nombreLimpio = typeof nombre === "string" ? nombre.trim() : "";
    if (!REGEX_NOMBRE.test(nombreLimpio)) {
        return res.status(400).json({ error: "Nombre inválido" });
    }

    const apellidoLimpio = typeof apellido === "string" ? apellido.trim() : "";
    if (!REGEX_NOMBRE.test(apellidoLimpio)) {
        return res.status(400).json({ error: "Apellido inválido" });
    }

    if (typeof fechaDeNacimiento !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(fechaDeNacimiento)) {
        return res.status(400).json({ error: "Fecha de nacimiento inválida" });
    }
    const [anio, mes, dia] = fechaDeNacimiento.split("-").map(Number);
    const fecha = new Date(anio, mes - 1, dia);
    if (fecha.getFullYear() !== anio || fecha.getMonth() !== mes - 1 || fecha.getDate() !== dia) {
        return res.status(400).json({ error: "Fecha de nacimiento inválida" });
    }
    if (fecha > new Date()) {
        return res.status(400).json({ error: "La fecha de nacimiento no puede ser futura" });
    }
    const fechaEdadMinima = new Date();
    fechaEdadMinima.setFullYear(fechaEdadMinima.getFullYear() - EDAD_MINIMA);
    if (fecha > fechaEdadMinima) {
        return res.status(400).json({ error: `El paciente debe tener al menos ${EDAD_MINIMA} años` });
    }

    if (historiaClinica != null && typeof historiaClinica !== "string") {
        return res.status(400).json({ error: "Historia clínica inválida" });
    }
    const historiaLimpia = historiaClinica?.trim() || null;
    if (historiaLimpia && historiaLimpia.length > MAX_HISTORIA_CLINICA) {
        return res.status(400).json({
            error: `La historia clínica no puede superar los ${MAX_HISTORIA_CLINICA} caracteres`
        });
    }

    try {
        const paciente = await getPacientePorDni(dniPaciente);
        if (paciente) {
            return res.status(409).json({ error: "Ya existe un paciente registrado con ese DNI" });
        }

        const nuevoPaciente = await crearPaciente({
            dni: dniPaciente,
            contra,
            nombre: nombreLimpio,
            apellido: apellidoLimpio,
            fechaDeNacimiento,
            historiaClinica: historiaLimpia
        });

        // 201 porque estamos creando un nuevo recurso en la base de datos
        return res.status(201).json({
            mensaje: "Paciente registrado correctamente",
            paciente: nuevoPaciente
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "No se pudo registrar al paciente" });
    }
});

export default router;
