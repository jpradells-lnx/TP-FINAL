const selectEspecialidad = document.getElementById("especialidad");
const selectMedico = document.getElementById("idMedico");
const contenedorTurnos = document.getElementById("turnosDisponibles");

function mostrarMensajeTurnos(texto) {
    const p = document.createElement("p");
    p.innerText = texto;
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

function agregarTurno(hora, fecha) {
    const cardTurno = document.createElement("div");
    cardTurno.className = "cardTurno";

    const cardHora = document.createElement("p");
    cardHora.className = "cardHora";
    cardHora.innerText = `Hora: ${hora}`;

    const cardFecha = document.createElement("h2");
    cardFecha.innerText = formatearFecha(fecha);

    const detallesTurno = document.createElement("div");
    detallesTurno.className = "card-detallesTurno";

    detallesTurno.append(cardFecha, cardHora);
    cardTurno.appendChild(detallesTurno);

    contenedorTurnos.appendChild(cardTurno);
}

selectEspecialidad.addEventListener("change", () => {
    cargarMedicos(selectEspecialidad.value);
});

selectMedico.addEventListener("change", () => {
    cargarTurnoMedico(selectMedico.value);
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
        const respuesta = await fetch(`${API_URL}/turnos/${idMedico}`);
        if (!respuesta.ok) throw new Error("Error " + respuesta.status);

        const turnos = await respuesta.json();

        if (selectMedico.value !== idMedico) return;

        if (turnos.length === 0) {
            mostrarMensajeTurnos("Este médico no tiene turnos disponibles.");
            return;
        }

        contenedorTurnos.replaceChildren();
        turnos.forEach((turno) => agregarTurno(turno.hora, turno.fecha));
    } catch (err) {
        if (selectMedico.value !== idMedico) return;
        mostrarMensajeTurnos("No se pudieron cargar los turnos.");
        console.error(err);
    }
}

iniciar();