const contenedorEspecialidades = document.getElementById("especialidades");

let panelAbierto = null;
let cardAbierta = null;

function cerrarPanel() {
    if (panelAbierto) panelAbierto.remove();
    if (cardAbierta) cardAbierta.classList.remove("card-seleccionada");
    panelAbierto = null;
    cardAbierta = null;
}

function ultimaCardDeLaFila(card) {
    const cards = [...contenedorEspecialidades.querySelectorAll(".card")];
    const fila = cards.filter((c) => c.offsetTop === card.offsetTop);
    return fila[fila.length - 1];
}

function ubicarPanel() {
    if (!panelAbierto) return;
    panelAbierto.remove();
    ultimaCardDeLaFila(cardAbierta).after(panelAbierto);
    const centroCard = cardAbierta.offsetLeft + cardAbierta.offsetWidth / 2;
    panelAbierto.style.setProperty("--flecha-x", `${centroCard - panelAbierto.offsetLeft}px`);
}

function abrirPanel(card, detalles) {
    const estabaAbierta = card === cardAbierta;
    cerrarPanel();
    if (estabaAbierta) return;

    panelAbierto = detalles;
    cardAbierta = card;
    card.classList.add("card-seleccionada");
    ubicarPanel();
    panelAbierto.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

window.addEventListener("resize", ubicarPanel);

function crearParrafo(texto) {
    const p = document.createElement("p");
    p.innerText = texto;
    return p;
}

function agregarEspecialidad(especialidad) {
    const { id, nombre, descripcion, monto_consulta, duracion, medicos } = especialidad;

    const card = document.createElement("div");
    card.className = "card";
    card.id = `especialidad-${id}`;

    const cardNombre = document.createElement("p");
    cardNombre.className = "card-name";
    cardNombre.innerText = nombre;

    const detalles = document.createElement("div");
    detalles.className = "panel-detalles";

    const sacarTurno = document.createElement("button");
    sacarTurno.className = "card-button"
    sacarTurno.innerText = "Sacar turno con esta especialidad";
    sacarTurno.addEventListener("click", () => {
        sessionStorage.setItem("especialidad", id);
        window.location.href = "turnos.html";
    });

    const eliminarEspecialidad = document.createElement("button");
    eliminarEspecialidad.className = "card-button"
    eliminarEspecialidad.innerText = "Eliminar";
    eliminarEspecialidad.addEventListener("click", async () => { 
        try {
            const respuesta = await fetch(`${API_URL}/especialidades/${id}`, {
                method: "DELETE",
            });
            if (!respuesta.ok) throw new Error("No se pudo eliminar la especialidad");
            if (card === cardAbierta) cerrarPanel();
            card.remove();
        } catch (err) {
            alert(err.message);
        }})

    detalles.append(
        crearParrafo(descripcion || "Sin descripción"),
        crearParrafo(`Monto de consulta: $${monto_consulta}`),
        crearParrafo(`Duración: ${duracion} minutos`),
        crearParrafo(`Médicos asociados: ${medicos.length > 0 ? medicos.map((m) => `${m.nombre} ${m.apellido}`).join(", ") : "Sin médicos asignados"}`),
        sacarTurno,
        eliminarEspecialidad
    );

    cardNombre.addEventListener("click", () => abrirPanel(card, detalles));

    card.append(cardNombre);
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
