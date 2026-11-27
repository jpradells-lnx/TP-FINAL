async function agregarPaciente(dni, contra, nombre, apellido, fechaDeNacimiento, historiaClinica) {
    const mensaje = document.getElementById("mensajeRegistro");

    try {
        const respuesta = await fetch(`${API_URL}/pacientes`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                dni,
                contra,
                nombre,
                apellido,
                fechaDeNacimiento,
                historiaClinica: historiaClinica || null
            })
        });

        const datos = await respuesta.json().catch(() => ({}));

        if (!respuesta.ok) {
            mensaje.textContent = datos.error ?? "No se pudo registrar al paciente";
            mensaje.className = "mensaje-turno error";
            return;
        }

        mensaje.textContent = "¡Paciente registrado correctamente!";
        mensaje.className = "mensaje-turno exito";

        document.getElementById("formPaciente").reset();

    } catch (error) {
        mensaje.textContent = "No se pudo conectar con el servidor";
        mensaje.className = "mensaje-turno error";
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
    const contra = document.getElementById("contraRegistro").value;
    const contra2 = document.getElementById("contraRegistro2").value;

    const mensaje = document.getElementById("mensajeRegistro");

    const REGEX_CONTRA = /^(?=.*\p{Lu})(?=.*\p{Ll})(?=.*\d)(?=.*[^\p{L}\d]).+$/u;
    if (!REGEX_CONTRA.test(contra)) {
        mensaje.textContent = "La contraseña debe tener al menos una mayúscula, una minúscula, un número y un carácter especial";
        mensaje.className = "mensaje-turno error";
        return;
    }

    if (contra !== contra2) {
        mensaje.textContent = "Las contraseñas no coinciden";
        mensaje.className = "mensaje-turno error";
        return;
    }

    agregarPaciente(dni, contra, nombre, apellido, fechaDeNacimiento, historiaClinica);
})