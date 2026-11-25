const selectEspecialidad = document.getElementById("especialidad");
const selectMedico = document.getElementById("idMedico");
const contenedorTurnos = document.getElementById("turnosDisponibles");
const formTurno = document.getElementById("form-turno");
const botonPedir = document.getElementById("botonPedir");
const mensajeTurno = document.getElementById("mensajeTurno");
const inputDni = document.getElementById("dniPaciente");

function mostrarMensajeSacarTurno(texto, tipo) {
    mensajeTurno.innerText = texto;
    mensajeTurno.className = `mensaje-turno ${tipo}`;
}

function ocultarMensajeSacarTurno() {
    mensajeTurno.innerText = "";
    mensajeTurno.className = "mensaje-turno oculto";
}

function mostrarMensajeTurnos(texto, tipo = "info") {
    const p = document.createElement("p");
    p.innerText = texto;
    p.className = `mensaje-turno ${tipo}`;
    contenedorTurnos.replaceChildren(p);
}

function resetearMedicos() {
    selectMedico.replaceChildren(new Option("Elegí primero una especialidad", ""));
    selectMedico.disabled = true;
}

function formatearFecha(fecha) {
    const [anio, mes, dia] = fecha.split("-");
    return `${dia}/${mes}/${anio}`;
}

function agregarTurno(turno) {
    const { id, hora, fecha } = turno;

    // Cada turno es un <label> con un radio adentro: al hacer click queda seleccionado
    // y el form lo incluye solo como "turno".
    const cardTurno = document.createElement("label");
    cardTurno.className = "cardTurno";

    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "turno";
    radio.value = id;

    const cardHora = document.createElement("p");
    cardHora.className = "cardHora";
    cardHora.innerText = `Hora: ${hora}`;

    const cardFecha = document.createElement("h2");
    cardFecha.innerText = formatearFecha(fecha);

    const detallesTurno = document.createElement("div");
    detallesTurno.className = "card-detallesTurno";

    detallesTurno.append(cardFecha, cardHora);
    cardTurno.append(radio, detallesTurno);

    contenedorTurnos.appendChild(cardTurno);
}

selectEspecialidad.addEventListener("change", () => {
    cargarMedicos(selectEspecialidad.value);
});

selectMedico.addEventListener("change", () => {
    cargarTurnoMedico(selectMedico.value);
});

// Solo deja escribir números en el DNI
inputDni.addEventListener("input", () => {
    inputDni.value = inputDni.value.replace(/\D/g, "");
});

// Valida el form y devuelve el mensaje de error, o null si está todo bien
function validarFormTurno(datos) {
    if (!datos.get("especialidad")) return "Elegí una especialidad.";
    if (!/^[0-9]{8}$/.test(datos.get("dniPaciente"))) {
        return "DNI inválido: tiene que tener exactamente 8 números.";
    }
    return null;
}

// Un <button> dentro de un <form> es type="submit" por defecto aunque no lo diga,
// por eso sacarle el atributo no cambiaba nada. Hay que cancelar el submit del form.
// El form tiene "novalidate" para que los errores se muestren en mensajeTurno
// y no en el cartel del navegador.
formTurno.addEventListener("submit", (event) => {
    event.preventDefault();
    const datos = new FormData(formTurno);

    const error = validarFormTurno(datos);
    if (error) {
        mostrarMensajeSacarTurno(error, "error");
        return;
    }

    sacarTurnoNuevo(
        datos.get("dniPaciente"),
        datos.get("especialidad"),
        datos.get("idMedico"),
        datos.get("turno")
    );
});

async function iniciar() {
    const idEspecialidad = sessionStorage.getItem("especialidad");
    sessionStorage.removeItem("especialidad");

    await cargarSelectEspecialidades();

    if (!idEspecialidad) return;

    selectEspecialidad.value = idEspecialidad;
    if (selectEspecialidad.value === idEspecialidad) {
        cargarMedicos(idEspecialidad);
    }
}

async function cargarSelectEspecialidades() {
    try {
        const respuesta = await fetch(`${API_URL}/especialidades`);
        if (!respuesta.ok) throw new Error("Error " + respuesta.status);

        const especialidades = await respuesta.json();

        selectEspecialidad.replaceChildren(new Option("Elegí una especialidad", ""));
        especialidades.forEach((esp) => {
            selectEspecialidad.add(new Option(esp.nombre, esp.id));
        });
    } catch (err) {
        selectEspecialidad.replaceChildren(new Option("No se pudieron cargar", ""));
        console.error(err);
    }
}

async function cargarMedicos(idEspecialidad) {
    contenedorTurnos.replaceChildren();

    if (!idEspecialidad) {
        resetearMedicos();
        return;
    }
    selectMedico.disabled = true;
    selectMedico.replaceChildren(new Option("Cargando...", ""));

    try {
        const respuesta = await fetch(`${API_URL}/medicos?especialidad=${idEspecialidad}`);
        if (!respuesta.ok) throw new Error("Error " + respuesta.status);

        const medicos = await respuesta.json();

        selectMedico.replaceChildren(new Option("Sin preferencia", ""));
        medicos.forEach((m) => {
            selectMedico.add(new Option(`${m.apellido}, ${m.nombre}`, m.id));
        });
        selectMedico.disabled = false;
    } catch (err) {
        selectMedico.replaceChildren(new Option("No se pudieron cargar", ""));
        console.error(err);
    }
}

async function cargarTurnoMedico(idMedico) {
    if (!idMedico) {
        contenedorTurnos.replaceChildren();
        return;
    }
    mostrarMensajeTurnos("Cargando turnos...");

    try {
        const respuesta = await fetch(`${API_URL}/medicos/${idMedico}/turnos?estado=libre`);
        if (!respuesta.ok) throw new Error("Error " + respuesta.status);

        const turnos = await respuesta.json();

        if (selectMedico.value !== idMedico) return;

        if (turnos.length === 0) {
            mostrarMensajeTurnos("Este médico no tiene turnos disponibles.");
            return;
        }

        contenedorTurnos.replaceChildren();
        turnos.forEach(agregarTurno);
    } catch (err) {
        if (selectMedico.value !== idMedico) return;
        mostrarMensajeTurnos("No se pudieron cargar los turnos.", "error");
        console.error(err);
    }
}

async function sacarTurnoNuevo(dni, idEspecialidad, idMedico, idTurno) {
    botonPedir.disabled = true;
    ocultarMensajeSacarTurno();

    try {
        const respuesta = await fetch(`${API_URL}/reservas`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                dni,
                especialidad: idEspecialidad,
                medico: idMedico || null,
                turno: idTurno || null
            })
        });
        const datos = await respuesta.json();

        if (!respuesta.ok) {
            mostrarMensajeSacarTurno(datos.error ?? "No se pudo sacar el turno.", "error");
            return;
        }

        const { fecha, hora, medico } = datos;
        mostrarMensajeSacarTurno(
            `¡Turno reservado! ${formatearFecha(fecha)} a las ${hora} con ${medico.nombre} ${medico.apellido}.`,
            "exito"
        );

        // Refresca la lista para que el turno reservado deje de aparecer
        if (selectMedico.value) cargarTurnoMedico(selectMedico.value);
    } catch (err) {
        mostrarMensajeSacarTurno("No se pudo conectar con el servidor.", "error");
        console.error(err);
    } finally {
        botonPedir.disabled = false;
    }
}

iniciar();