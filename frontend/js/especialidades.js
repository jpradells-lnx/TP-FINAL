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