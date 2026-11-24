const selectEspecialidad = document.getElementById("especialidad");
const selectMedico = document.getElementById("idMedico");

function resetearMedicos() {
    selectMedico.replaceChildren(new Option("Elegí primero una especialidad", ""));
    selectMedico.disabled = true;
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
    
iniciar();

selectEspecialidad.addEventListener("change", () => {
    cargarMedicos(selectEspecialidad.value);
});


async function cargarTurnoMedico(idMedico){
    document.getElementById("turnosDisponibles").innerHTML = "";
    if (!idMedico) return;
    let data = await fetch(`${API_URL}/turnos/${idMedico}`);
    data = await data.json();
    console.log(data);
    let turnos = data;
    turnos.forEach((turno) => {
        agregarTurno(turno.hora, turno.fecha);
    });
}

selectMedico.addEventListener("change", () => {
    cargarTurnoMedico(selectMedico.value);
});

function agregarTurno(hora, fecha) {
    let turnos = document.getElementById("turnosDisponibles");

    let cardTurno = document.createElement("div");
    cardTurno.className = "cardTurno";

    let cardHora = document.createElement("p");
    cardHora.className = "cardHora";
    cardHora.innerText = `Hora: ${hora}`;

    let cardFecha = document.createElement("h2");
    cardFecha.innerText = `${fecha.split("T")[0]}`;

    let detallesTurno = document.createElement("div");
    detallesTurno.className = "card-detallesTurno";

    detallesTurno.append(cardFecha, cardHora);
    cardTurno.appendChild(detallesTurno);

    turnos.appendChild(cardTurno);
}