export const ESTADOS_TURNO = ["libre", "reservado", "cancelado"];

export function parseId(textId){
    const id = Number(textId);

    if (!Number.isInteger(id) || id < 1) return null;

    return id;
}


// DNI: exactamente 8 dígitos. Devuelve el número o null si no es válido.
export function parseDni(textDni) {
    const texto = String(textDni ?? "");
    if (!/^[0-9]{8}$/.test(texto)) return null;
    return Number(texto);
}

export function validarEspecialidad(nombre, descripcion, monto_consulta, duracion) {
    if (!nombre?.trim() || !descripcion?.trim()) return null;
    const monto = Number(monto_consulta);
    const dur = Number(duracion);
    if (!Number.isFinite(monto) || monto < 0) return null;
    if (!Number.isInteger(dur) || dur < 10) return null;
    return { nombre: nombre.trim(), descripcion: descripcion.trim(), monto, duracion: dur};
};