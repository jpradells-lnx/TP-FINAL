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
            <input type="password" id="contraLogin" maxlength="12"
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
        const contra = modal.querySelector("#contraLogin").value;
        mensaje.hidden = true;

        try {
            const respuesta = await fetch(`${API_URL}/pacientes/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ dni, contra })
            });
            const datos = await respuesta.json().catch(() => ({}));
            if (!respuesta.ok) {
                mensaje.textContent = datos.error ?? "No se pudo iniciar sesión";
                mensaje.hidden = false;
                return;
            }
            localStorage.setItem("paciente", JSON.stringify(datos));
            window.location.href = "personal.html";
        } catch (error) {
            mensaje.textContent = "No se pudo conectar con el servidor";
            mensaje.hidden = false;
            console.error(error);
        }
    });

    return modal;
}

const linkYo = document.getElementById("linkYo");
if (linkYo) {
    linkYo.addEventListener("click", (e) => {
        if (usuarioLoggeado()) return;
        e.preventDefault();

        const modal = document.getElementById("modalLogin") ?? crearModalLogin();
        modal.querySelector("#formLogin").reset();
        modal.querySelector("#mensajeLogin").hidden = true;
        modal.showModal();
    });
}

const botonCerrar = document.getElementById("cerrarSesion");
if(botonCerrar){
    botonCerrar.addEventListener("click", async () => {
    console.log("Gola");
    localStorage.removeItem("paciente");
    window.location.href = "index.html";
    });
}

const paciente = usuarioLoggeado();

async function cargarDatos() {
    const respuesta = await fetch(`${API_URL}/pacientes/${paciente.id}`);
    const datos = await respuesta.json();

    const titulo = document.getElementById("pregunta");
    if (titulo) titulo.textContent = `Como te sentis hoy ${datos.nombre}?`
}

if (window.location === "personal.html"){
    cargarDatos();
}