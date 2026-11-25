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
