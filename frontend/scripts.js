let lista = document.getElementById("cuerpo-especialidades");

            async function cargarEspecialidades() {
            try {
                
                const respuesta = await fetch("http://localhost:3000/api/especialidades");

                if (!respuesta.ok) {
                    throw new Error("Error " + respuesta.status);
                }

                const especialidades = await respuesta.json();

                especialidades.forEach((esp) => {
                    const elemento = document.createElement("tr");
                    elemento.innerHTML = `
                    <td>${esp.nombre}</td>
                    <td>${esp.descripcion}</td>
                    <td>$${esp.monto_consulta}</td>
                    <td>${esp.duracion_turno_min} minutos</td>
                    <td>${esp.medicos_asociados}</td>
                    `;
                    lista.appendChild(elemento);
                });
                } catch (err) {
                    const elemento = document.createElement("tr");
                    elemento.innerHTML = `<td colspan="5">No se pudieron cargar las especialidades.</td>`;
                    lista.appendChild(elemento);
                    console.error(err);
                }
            }

            cargarEspecialidades();