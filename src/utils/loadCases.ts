import fs from 'fs';

export function loadCases(src: string) {
    const recs = fs.readdirSync(src);
    const res: { name: string; code: string }[] = [];
    for (const r of recs) {
        if (r.endsWith('.hsf')) {
            res.push({
                name: r.slice(0, r.length - '.hsf'.length),
                code: fs.readFileSync(src + r, 'utf8'),
            });
        }
    }
    res.sort((a, b) => a.name.localeCompare(b.name));
    return res;
}
