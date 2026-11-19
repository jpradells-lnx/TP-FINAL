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

cargarSelectEspecialidades();

selectEspecialidad.addEventListener("change", () => {
    cargarMedicos(selectEspecialidad.value);
});