let lista = document.getElementById("especialidades-lista");

            async function cargarEspecialidades() {
            try {
                
                const respuesta = await fetch("http://localhost:3000/api/especialidades");

                if (!respuesta.ok) {
                    throw new Error("Error " + respuesta.status);
                }

                const especialidades = await respuesta.json();

                especialidades.forEach((esp) => {
                    const elemento = document.createElement("li");
                    elemento.textContent = esp.nombre;
                    lista.appendChild(elemento);
                });
                } catch (err) {
                    const elemento = document.createElement("li");
                    elemento.textContent = "No se pudieron cargar las especialidades.";
                    lista.appendChild(elemento);
                    console.error(err);
                }
            }

            cargarEspecialidades();