const cuerpoEspecialidades = document.getElementById("cuerpo-especialidades");

async function cargarTablaEspecialidades() {
    try {
        const respuesta = await fetch(`${API_URL}/especialidades`);
        if (!respuesta.ok) throw new Error("Error " + respuesta.status);

        const especialidades = await respuesta.json();

        especialidades.forEach((esp) => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${esp.nombre}</td>
                <td>${esp.descripcion}</td>
                <td>$${esp.monto_consulta}</td>
                <td>${esp.duracion_turno_min} minutos</td>
                <td>${esp.medicos_asociados ?? "Sin médicos"}</td>
            `;
            cuerpoEspecialidades.appendChild(fila);
        });
    } catch (err) {
        const fila = document.createElement("tr");
        fila.innerHTML = `<td colspan="5">No se pudieron cargar las especialidades.</td>`;
        cuerpoEspecialidades.appendChild(fila);
        console.error(err);
    }
}

cargarTablaEspecialidades();

function agregarEspecialidad(id, nombre, descripcion, monto_consulta, duracion){
    let productos = document.getElementById("especialidades");

    let card = document.createElement("a");
    card.className = "card";
    card.id = id;
    card.href = `especialidades.html?id=${id}`;

    let cardNombre = document.createElement("p");
    cardNombre.className = "card-name";
    cardNombre.innerText = nombre;

    // let cardDescripcion = document.createElement("p");
    // cardDescripcion.className = "card-description";
    // cardDescripcion.innerText = descripcion;

    // let cardMontoConsulta = document.createElement("p");
    // cardMontoConsulta.className = "card-price";
    // cardMontoConsulta.innerText = `Monto de consulta: $${monto_consulta}`;

    // let cardDuracion = document.createElement("p");
    // cardDuracion.className = "card-duration";
    // cardDuracion.innerText = `Duración: ${duracion} minutos`;

    card.append(cardNombre);

    productos.appendChild(card);
}

async function cargarEspecialidades(){
    console.log
    let data = await fetch("http://localhost:3000/api/especialidades/");
    data = await data.json();
    console.log(data);
    let especialidades = data.results;
        especialidades.forEach((especialidad) => {
            agregarEspecialidad(especialidad.id, especialidad.nombre, especialidad.descripcion, especialidad.monto_consulta, especialidad.duracion);
        });
}

cargarEspecialidades();