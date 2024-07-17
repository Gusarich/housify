import { writeModule } from '../generator/generate';
import { parse } from '../grammar/grammar';
import { optimize } from '../optimizer/optimize';
import { CompilerContext } from '../resolver/context';
import { resolveModule } from '../resolver/resolve';

export function compile(src: string) {
    // Parsing
    console.log('Parsing...');
    const moduleAst = parse(src);

    // Resolving
    console.log('Resolving...');
    const ctx = new CompilerContext();
    resolveModule(moduleAst, ctx);

    // Generating
    console.log('Generating...');
    const compiledModule = writeModule(moduleAst, ctx);

    // Optimizing
    console.log('Optimizing...');
    const optimizedModule = optimize(compiledModule);

    console.log('Compilation successful!');

    return optimizedModule;
}
