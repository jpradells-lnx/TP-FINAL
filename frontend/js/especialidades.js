const contenedorEspecialidades = document.getElementById("especialidades");

function crearParrafo(texto) {
    const p = document.createElement("p");
    p.innerText = texto;
    return p;
}

function agregarEspecialidad(especialidad) {
    const { id, nombre, descripcion, monto_consulta, duracion, medicos_asociados } = especialidad;

    const card = document.createElement("div");
    card.className = "card";
    card.id = `especialidad-${id}`;

    const cardNombre = document.createElement("p");
    cardNombre.className = "card-name";
    cardNombre.innerText = nombre;

    const detalles = document.createElement("div");
    detalles.className = "card-detalles oculto";

    const sacarTurno = document.createElement("button");
    sacarTurno.className = "card-button"
    sacarTurno.innerText = "Sacar turno con esta especialidad";
    sacarTurno.addEventListener("click", () => {
        sessionStorage.setItem("especialidad", id);
        window.location.href = "turnos.html";
    });

    detalles.append(
        crearParrafo(descripcion || "Sin descripción"),
        crearParrafo(`Monto de consulta: $${monto_consulta}`),
        crearParrafo(`Duración: ${duracion} minutos`),
        crearParrafo(`Médicos asociados: ${medicos_asociados || "Sin médicos asignados"}`),
        sacarTurno
    );

    cardNombre.addEventListener("click", () => {
        document.querySelectorAll(".card-detalles").forEach((detalle) => {
            if (detalle !== detalles) detalle.classList.add("oculto");
        });
        detalles.classList.toggle("oculto");
    });

    card.append(cardNombre, detalles);
    contenedorEspecialidades.appendChild(card);
}

async function cargarEspecialidades() {
    try {
        const respuesta = await fetch(`${API_URL}/especialidades`);
        if (!respuesta.ok) throw new Error("Error " + respuesta.status);

        const especialidades = await respuesta.json();

        if (especialidades.length === 0) {
            contenedorEspecialidades.replaceChildren(crearParrafo("No hay especialidades cargadas."));
            return;
        }

        especialidades.forEach(agregarEspecialidad);
    } catch (err) {
        contenedorEspecialidades.replaceChildren(crearParrafo("No se pudieron cargar las especialidades."));
        console.error(err);
    }
}

cargarEspecialidades();
