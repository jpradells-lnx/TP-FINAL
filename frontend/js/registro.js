async function agregarPaciente(dni, nombre, apellido, fechaDeNacimiento, historiaClinica) {
    const mensaje = document.getElementById("mensajeRegistro");

    try {
        const respuesta = await fetch(`${API_URL}/pacientes`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                dni,
                nombre,
                apellido,
                fechaDeNacimiento,
                historiaClinica: historiaClinica || null
            })
        });

        const datos = await respuesta.json();

        if (!respuesta.ok) {
            mensaje.textContent = datos.error;
            mensaje.className = "error";
            return;
        }

        mensaje.textContent = "¡Paciente registrado correctamente!";
        mensaje.className = "exito";

        document.getElementById("formPaciente").reset();

    } catch (error) {
        mensaje.textContent = "No se pudo conectar con el servidor";
        mensaje.className = "error";
        console.error(error);
    }
}

const formulario = document.getElementById("formPaciente");

formulario.addEventListener("submit", (event) => {
    event.preventDefault();

    const dni = document.getElementById("dni").value;
    const nombre = document.getElementById("nombre").value;
    const apellido = document.getElementById("apellido").value;
    const fechaDeNacimiento = document.getElementById("fechaDeNacimiento").value;
    const historiaClinica = document.getElementById("historiaClinica").value;

    agregarPaciente(dni, nombre, apellido, fechaDeNacimiento, historiaClinica);
});