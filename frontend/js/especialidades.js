
function agregarEspecialidad(id, nombre, descripcion, monto_consulta, duracion, medicos_asociados){
    let productos = document.getElementById("especialidades");

    let card = document.createElement("div");
    card.className = "card";
    card.id = id;

    let cardNombre = document.createElement("p");
    cardNombre.className = "card-name";
    cardNombre.innerText = nombre;

    let titulo = document.createElement("h2");
    titulo.innerText = nombre;

    let detalles = document.createElement("div");
    detalles.className = "card-detalles";

    let descripcionTexto = document.createElement("p");
    descripcionTexto.innerText = descripcion;

    let monto = document.createElement("p");
    monto.innerText = `Monto de consulta: $${monto_consulta}`;

    let duracion_Consulta = document.createElement("p");
    duracion_Consulta.innerText = `Duración: ${duracion} minutos`;

    let medicos = document.createElement("p");
    medicos.innerText = `Médicos Asociados: ${medicos_asociados}`;

    detalles.append(descripcionTexto, monto, duracion_Consulta, medicos);

    detalles.classList.add("oculto");

    cardNombre.addEventListener("click", () => {
        document.querySelectorAll(".card-detalles").forEach((detalle) => {
            if (detalle !== detalles) {
                detalle.classList.add("oculto");
            }
        });

        detalles.classList.toggle("oculto");
    });

    card.append(cardNombre, detalles);
    productos.appendChild(card);
}

async function cargarEspecialidades(){
    let data = await fetch("http://localhost:3000/api/especialidades/");
    data = await data.json();
    console.log(data);
    let especialidades = data;
        especialidades.forEach((especialidad) => {
            agregarEspecialidad(especialidad.id, especialidad.nombre, especialidad.descripcion, especialidad.monto_consulta, especialidad.duracion, especialidad.medicos_asociados);
    });
}

cargarEspecialidades();