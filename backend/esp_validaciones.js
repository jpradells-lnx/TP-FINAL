export function parseId(textId){
    const id = Number(textId);

    if (!Number.isInteger(id) || id < 1) return null;

    return id;
}