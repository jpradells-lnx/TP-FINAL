const selectEspecialidad = document.getElementById("especialidad");
const selectMedico = document.getElementById("idMedico");

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

if (selectEspecialidad) cargarSelectEspecialidades();