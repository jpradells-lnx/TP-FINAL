const paciente = usuarioLoggeado();

// Pone un texto en el elemento con ese id, si existe en la página
function mostrar(id, texto) {
    const elemento = document.getElementById(id);
    if (elemento) elemento.textContent = texto;
}

// "2004-05-17" -> "17/05/2004"
function formatearFecha(fecha) {
    const [anio, mes, dia] = fecha.split("-");
    return `${dia}/${mes}/${anio}`;
}

function calcularEdad(fecha) {
    const [anio, mes, dia] = fecha.split("-").map(Number);
    const hoy = new Date();
    let edad = hoy.getFullYear() - anio;
    // Si todavía no cumplió años este año, le restamos uno
    if (hoy.getMonth() + 1 < mes || (hoy.getMonth() + 1 === mes && hoy.getDate() < dia)) {
        edad--;
    }
    return edad;
}

async function cargarDatos() {
    try {
        const respuesta = await fetch(`${API_URL}/pacientes/${paciente.id}`);
        const datos = await respuesta.json();

        if (!respuesta.ok) {
            mostrar("pregunta", datos.error ?? "No se pudieron cargar tus datos");
            return;
        }

        mostrar("pregunta", `¿Cómo te sentís hoy, ${datos.nombre}?`);
        mostrar("datoNombre", datos.nombre);
        mostrar("datoApellido", datos.apellido);
        mostrar("datoDni", datos.dni);
        mostrar("datoFechaNacimiento", formatearFecha(datos.fechaDeNacimiento));
        mostrar("datoEdad", `${calcularEdad(datos.fechaDeNacimiento)} años`);
        mostrar("datoId", datos.id);
        mostrar("historiaClinica", datos.historiaClinica ?? "No tenés historia clínica cargada.");
    } catch (error) {
        mostrar("pregunta", "No se pudo conectar con el servidor");
        console.error(error);
    }
}

// Arma una tarjeta de turno como las de turnos.html
function agregarTurnoPaciente(contenedor, turno) {
    const { fecha, hora, estado, pasado, medico, especialidad } = turno;

    const cardTurno = document.createElement("div");
    cardTurno.className = "cardTurno";
    // Los turnos que ya pasaron (o cancelados) se muestran desactivados
    if (pasado || estado === "cancelado") cardTurno.classList.add("turno-pasado");

    const cardFecha = document.createElement("h2");
    cardFecha.innerText = formatearFecha(fecha);

    const cardHora = document.createElement("p");
    cardHora.className = "cardHora";
    cardHora.innerText = `Hora: ${hora}`;

    const cardEspecialidad = document.createElement("p");
    cardEspecialidad.innerText = especialidad ?? "Sin especialidad";

    const cardMedico = document.createElement("p");
    cardMedico.innerText = `${medico.nombre} ${medico.apellido}`;

    const cardEstado = document.createElement("p");
    cardEstado.innerText = estado;

    const detallesTurno = document.createElement("div");
    detallesTurno.className = "card-detallesTurno";
    detallesTurno.append(cardFecha, cardHora, cardEspecialidad, cardMedico, cardEstado);

    cardTurno.append(detallesTurno);
    contenedor.appendChild(cardTurno);
}

async function cargarTurnos() {
    const contenedor = document.getElementById("turnosPaciente");
    if (!contenedor) return;

    try {
        const respuesta = await fetch(`${API_URL}/pacientes/${paciente.id}/turnos`);
        const turnos = await respuesta.json();

        if (!respuesta.ok) {
            contenedor.textContent = turnos.error ?? "No se pudieron cargar tus turnos";
            return;
        }
        if (turnos.length === 0) {
            contenedor.textContent = "Todavía no sacaste ningún turno.";
            return;
        }

        contenedor.replaceChildren();
        turnos.forEach((turno) => agregarTurnoPaciente(contenedor, turno));
    } catch (error) {
        contenedor.textContent = "No se pudo conectar con el servidor";
        console.error(error);
    }
}

// Solo en personal.html (es la única página que tiene #pregunta)
if (document.getElementById("pregunta")) {
    if (paciente) {
        cargarDatos();
        cargarTurnos();
    } else {
        // Si entró escribiendo la URL sin estar loggeado, lo mandamos al inicio
        window.location.href = "index.html";
    }
}