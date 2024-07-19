export function snakeToCamel(s: string) {
    return s.replace(/(_\w)/g, (m) => m[1]!.toUpperCase());
}

export function camelToSnake(s: string) {
    return s.replace(/[A-Z]/g, (m) => '_' + m.toLowerCase()).slice(1);
}
