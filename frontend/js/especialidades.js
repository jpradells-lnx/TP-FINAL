const contenedorEspecialidades = document.getElementById("especialidades");
const dialogoAgregar = document.getElementById("dialogo-esp");
const formAgregar = document.getElementById("form-esp");

document.getElementById("agregar").addEventListener("click", () => {
    dialogoAgregar.showModal();
});
document.getElementById("cancelar").addEventListener("click", () => {
    dialogoAgregar.close();
});

formAgregar.addEventListener("submit", async (event) => {
    event.preventDefault();
    const datos = Object.fromEntries(new FormData(formAgregar))
    const respuesta = await fetch(`${API_URL}/especialidades`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
    });
    if (!respuesta.ok) {
        alert("No se pudo agregar la especialidad");
        return;
    }
    const nuevaEspecialidad = await respuesta.json();
    console.log(nuevaEspecialidad);
    formAgregar.reset();
    dialogoAgregar.close();
    agregarEspecialidad(nuevaEspecialidad);
});

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
    if (card === cardAbierta) {
        cerrarPanel();
        return;
    }

    const panelAnterior = panelAbierto;
    if (cardAbierta) cardAbierta.classList.remove("card-seleccionada");

    panelAbierto = detalles;
    cardAbierta = card;
    card.classList.add("card-seleccionada");
    ubicarPanel();

    if (panelAnterior) {
        const topAntes = card.getBoundingClientRect().top;
        panelAnterior.remove();
        window.scrollBy(0, card.getBoundingClientRect().top - topAntes);
    }

    panelAbierto.scrollIntoView({ behavior: "smooth", block: "start" });
}

window.addEventListener("resize", ubicarPanel);

document.addEventListener("click", (event) => {
    if (!panelAbierto) return;
    if (event.target.closest(".panel-detalles, .card")) return;
    cerrarPanel();
});

function crearParrafo(texto) {
    const p = document.createElement("p");
    p.innerText = texto;
    return p;
}

function crearDescripcion(descripcion) {
    const contenedor = document.createElement("div");
    contenedor.className = "descripcion";

    if (!descripcion) {
        contenedor.append(crearParrafo("Sin descripción"));
        return contenedor;
    }

    const [resumen, practicas] = descripcion.split("\n");

    const parrafoResumen = crearParrafo(resumen);
    parrafoResumen.className = "descripcion-resumen";
    contenedor.append(parrafoResumen);

    if (practicas) {
        const [titulo, lista] = practicas.split(":");

        const tituloPracticas = document.createElement("h3");
        tituloPracticas.className = "practicas-titulo";
        tituloPracticas.innerText = titulo;

        const ul = document.createElement("ul");
        ul.className = "practicas-lista";
        lista.replace(/\.$/, "").split(",").forEach((practica) => {
            const li = document.createElement("li");
            li.innerText = practica.trim();
            ul.append(li);
        });

        contenedor.append(tituloPracticas, ul);
    }

    return contenedor;
}

function crearDato(etiqueta, valor) {
    const dato = document.createElement("div");
    dato.className = "panel-dato";

    const spanEtiqueta = document.createElement("span");
    spanEtiqueta.className = "panel-dato-etiqueta";
    spanEtiqueta.innerText = etiqueta;

    const spanValor = document.createElement("span");
    spanValor.className = "panel-dato-valor";
    spanValor.innerText = valor;

    dato.append(spanEtiqueta, spanValor);
    return dato;
}

function crearMedicos(medicos) {
    const bloque = document.createElement("div");
    bloque.className = "panel-dato";

    const etiqueta = document.createElement("span");
    etiqueta.className = "panel-dato-etiqueta";
    etiqueta.innerText = "Médicos";
    bloque.append(etiqueta);

    if (medicos.length === 0) {
        const vacio = document.createElement("span");
        vacio.className = "sin-medicos";
        vacio.innerText = "Sin médicos asignados";
        bloque.append(vacio);
        return bloque;
    }

    const lista = document.createElement("ul");
    lista.className = "medicos-lista";
    medicos.forEach((m) => {
        const li = document.createElement("li");

        const avatar = document.createElement("span");
        avatar.className = "medico-avatar";
        avatar.innerText = `${m.nombre[0]}${m.apellido[0]}`;

        const nombreMedico = document.createElement("span");
        nombreMedico.innerText = `Dr/a. ${m.nombre} ${m.apellido}`;

        li.append(avatar, nombreMedico);
        lista.append(li);
    });
    bloque.append(lista);
    return bloque;
}

function agregarEspecialidad(especialidad) {
    const { id, nombre, descripcion, monto_consulta, duracion } = especialidad;
    const medicos = especialidad.medicos ?? especialidad.medicosdisponibles ?? [];

    const card = document.createElement("div");
    card.className = "card";
    card.id = `especialidad-${id}`;

    const cardNombre = document.createElement("p");
    cardNombre.className = "card-name";
    cardNombre.innerText = nombre;

    const detalles = document.createElement("div");
    detalles.className = "panel-detalles";

    const sacarTurno = document.createElement("button");
    sacarTurno.className = "panel-boton panel-boton-principal";
    sacarTurno.innerText = "Sacar turno con esta especialidad";
    sacarTurno.addEventListener("click", () => {
        sessionStorage.setItem("especialidad", id);
        window.location.href = "turnos.html";
    });

    const eliminarEspecialidad = document.createElement("button");
    eliminarEspecialidad.className = "panel-boton panel-boton-eliminar";
    eliminarEspecialidad.innerText = "Eliminar especialidad";
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

    const encabezado = document.createElement("div");
    encabezado.className = "panel-encabezado";

    const titulo = document.createElement("h2");
    titulo.innerText = nombre;

    const cerrar = document.createElement("button");
    cerrar.className = "panel-cerrar";
    cerrar.innerText = "✕";
    cerrar.title = "Cerrar";
    cerrar.addEventListener("click", cerrarPanel);

    encabezado.append(titulo, cerrar);

    const cuerpo = document.createElement("div");
    cuerpo.className = "panel-cuerpo";

    const datos = document.createElement("div");
    datos.className = "panel-datos";
    datos.append(
        crearDato("Consulta", `$${Number(monto_consulta).toLocaleString("es-AR")}`),
        crearDato("Duración", `${duracion} min`),
        crearMedicos(medicos)
    );

    cuerpo.append(crearDescripcion(descripcion), datos);

    const acciones = document.createElement("div");
    acciones.className = "panel-acciones";
    acciones.append(eliminarEspecialidad, sacarTurno);

    detalles.append(encabezado, cuerpo, acciones);

    cardNombre.addEventListener("click", () => abrirPanel(card, detalles));

    card.append(cardNombre);
    contenedorEspecialidades.appendChild(card);
}

async function cargarEspecialidades() {
    try {
        const respuesta = await fetch(`${API_URL}/especialidades`);
        if (!respuesta.ok) throw new Error("Error " + respuesta.status);

        const especialidades = await respuesta.json();
        contenedorEspecialidades.innerHTML = "";

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
