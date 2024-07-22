import { writeModule } from './generator/generate';
import { parse } from './grammar/grammar';
import { CompilerContext } from './resolver/context';
import { resolveModule } from './resolver/resolve';

export function compile(src: string, log = true) {
    // Parsing
    if (log) console.log('Parsing...');
    const moduleAst = parse(src);

    // Resolving
    if (log) console.log('Resolving...');
    const ctx = new CompilerContext();
    resolveModule(moduleAst, ctx);

    // Generating
    if (log) console.log('Generating...');
    const module = writeModule(moduleAst, ctx);

    if (log) console.log('Compilation successful!');

    return module;
}
