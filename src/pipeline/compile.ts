import { parse } from '../grammar/grammar';

export function compile(src: string) {
    const moduleAst = parse(src);

    console.log(moduleAst);
}
