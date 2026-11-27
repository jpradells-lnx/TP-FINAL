funcion usuarioLoggeado(){
    return JSON.parse(localStorage.getItem("paciente"));
}

document.getElementById("linkYo").addEventListener("click", async (e) => {
   if (usuarioLoggeado()) return;
   e.preventDefault();
   
   const dni = prompt("Inicia sesion con tu DNI y contraseña");
   if (!dni) return;

   const respuesta = await fetch(`${API_URL}/pacientes/${dni}`);
   if (!respuesta.ok) return alert("DNI no registrado. Registrate primero");

   localStorage.setItem("paciente", JSON.stringify(await respuesta.json()));
   window.location.href = "personal.html";
});