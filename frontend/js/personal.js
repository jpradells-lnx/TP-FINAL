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

// Pone un texto en el elemento con ese id, si existe en la página
function mostrar(id, texto) {
    const elemento = document.getElementById(id);
    if (elemento) elemento.textContent = texto;
}

// "2004-05-17" -> "17/05/2004"
function formatearFecha(fecha) {
    const [anio, mes, dia] = fecha.split("-");
    return `${dia}/${mes}/${anio}`;
}

function calcularEdad(fecha) {
    const [anio, mes, dia] = fecha.split("-").map(Number);
    const hoy = new Date();
    let edad = hoy.getFullYear() - anio;
    // Si todavía no cumplió años este año, le restamos uno
    if (hoy.getMonth() + 1 < mes || (hoy.getMonth() + 1 === mes && hoy.getDate() < dia)) {
        edad--;
    }
    return edad;
}

async function cargarDatos() {
    try {
        const respuesta = await fetch(`${API_URL}/pacientes/${paciente.id}`);
        const datos = await respuesta.json();

        if (!respuesta.ok) {
            mostrar("pregunta", datos.error ?? "No se pudieron cargar tus datos");
            return;
        }

        mostrar("pregunta", `¿Cómo te sentís hoy, ${datos.nombre}?`);
        mostrar("datoNombre", datos.nombre);
        mostrar("datoApellido", datos.apellido);
        mostrar("datoDni", datos.dni);
        mostrar("datoFechaNacimiento", formatearFecha(datos.fechaDeNacimiento));
        mostrar("datoEdad", `${calcularEdad(datos.fechaDeNacimiento)} años`);
        mostrar("datoId", datos.id);
        mostrar("historiaClinica", datos.historiaClinica ?? "No tenés historia clínica cargada.");
    } catch (error) {
        mostrar("pregunta", "No se pudo conectar con el servidor");
        console.error(error);
    }
}

// Arma una tarjeta de turno como las de turnos.html
function agregarTurnoPaciente(contenedor, turno) {
    const { fecha, hora, estado, pasado, medico, especialidad } = turno;

    const cardTurno = document.createElement("div");
    cardTurno.className = "cardTurno";
    // Los turnos que ya pasaron (o cancelados) se muestran desactivados
    if (pasado || estado === "cancelado") cardTurno.classList.add("turno-pasado");

    const cardFecha = document.createElement("h2");
    cardFecha.innerText = formatearFecha(fecha);

    const cardHora = document.createElement("p");
    cardHora.className = "cardHora";
    cardHora.innerText = `Hora: ${hora}`;

    const cardEspecialidad = document.createElement("p");
    cardEspecialidad.innerText = especialidad ?? "Sin especialidad";

    const cardMedico = document.createElement("p");
    cardMedico.innerText = `${medico.nombre} ${medico.apellido}`;

    const cardEstado = document.createElement("p");
    cardEstado.innerText = estado;

    const detallesTurno = document.createElement("div");
    detallesTurno.className = "card-detallesTurno";
    detallesTurno.append(cardFecha, cardHora, cardEspecialidad, cardMedico, cardEstado);

    cardTurno.append(detallesTurno);
    contenedor.appendChild(cardTurno);
}

async function cargarTurnos() {
    const contenedor = document.getElementById("turnosPaciente");
    if (!contenedor) return;

    try {
        const respuesta = await fetch(`${API_URL}/pacientes/${paciente.id}/turnos`);
        const turnos = await respuesta.json();

        if (!respuesta.ok) {
            contenedor.textContent = turnos.error ?? "No se pudieron cargar tus turnos";
            return;
        }
        if (turnos.length === 0) {
            contenedor.textContent = "Todavía no sacaste ningún turno.";
            return;
        }

        contenedor.replaceChildren();
        turnos.forEach((turno) => agregarTurnoPaciente(contenedor, turno));
    } catch (error) {
        contenedor.textContent = "No se pudo conectar con el servidor";
        console.error(error);
    }
}

// Solo en personal.html (es la única página que tiene #pregunta)
if (document.getElementById("pregunta")) {
    if (paciente) {
        cargarDatos();
        cargarTurnos();
    } else {
        // Si entró escribiendo la URL sin estar loggeado, lo mandamos al inicio
        window.location.href = "index.html";
    }
}