function usuarioLoggeado() {
    return JSON.parse(localStorage.getItem("paciente"));
}

function crearModalLogin() {
    const modal = document.createElement("dialog");
    modal.id = "modalLogin";
    modal.className = "modal-login tarjeta-registro";
    modal.innerHTML = `
        <h2>Iniciá sesión</h2>
        <form id="formLogin">
            <label for="dniLogin">DNI</label>
            <input type="text" id="dniLogin" inputmode="numeric" pattern="[0-9]{8}" maxlength="8"
                   placeholder="8 números, sin puntos" required>
            <label for="contraLogin">Contraseña</label>
            <input type="text" id="contraLogin" maxlength="12"
                   placeholder="Ingresa tu contraseña" required>
            <p id="mensajeLogin" class="mensaje-turno error" role="status" hidden></p>
            <button type="submit" class="boton">Ingresar</button>
            <button type="button" id="cancelarLogin" class="boton boton-secundario">Cancelar</button>
            <p class="modal-login-registro">¿No tenés cuenta? <a href="registro.html">Registrate</a></p>
        </form>
    `;
    document.body.appendChild(modal);

    const mensaje = modal.querySelector("#mensajeLogin");

    modal.querySelector("#cancelarLogin").addEventListener("click", () => modal.close());

    modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.close();
    });

    modal.querySelector("#formLogin").addEventListener("submit", async (e) => {
        e.preventDefault();
        const dni = modal.querySelector("#dniLogin").value;
        mensaje.hidden = true;

        try {
            const respuesta = await fetch(`${API_URL}/pacientes/${dni}`);
            if (!respuesta.ok) {
                mensaje.textContent = "DNI no registrado. Registrate primero.";
                mensaje.hidden = false;
                return;
            }
            localStorage.setItem("paciente", JSON.stringify(await respuesta.json()));
            window.location.href = "personal.html";
        } catch (error) {
            mensaje.textContent = "No se pudo conectar con el servidor";
            mensaje.hidden = false;
            console.error(error);
        }
    });

    return modal;
}

document.getElementById("linkYo").addEventListener("click", (e) => {
    if (usuarioLoggeado()) return;
    e.preventDefault();

    const modal = document.getElementById("modalLogin") ?? crearModalLogin();
    modal.querySelector("#formLogin").reset();
    modal.querySelector("#mensajeLogin").hidden = true;
    modal.showModal();
});
