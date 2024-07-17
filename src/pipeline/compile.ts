import { parse } from '../grammar/grammar';
import { CompilerContext } from '../typing/context';
import { resolveModule } from '../typing/resolve';

export function compile(src: string) {
    // Parse
    console.log('Parsing source code...');
    const moduleAst = parse(src);

    // Resolve
    console.log('Resolving module...');
    const ctx = new CompilerContext();
    resolveModule(moduleAst, ctx);

    // Write
    // TODO: Implement this

    console.log('Compilation successful!');
}
