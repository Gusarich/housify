import { resetNodeId } from '../../grammar/ast';
import { parse } from '../../grammar/grammar';
import { CompilerContext } from '../../resolver/context';
import { resolveModule } from '../../resolver/resolve';
import { loadCases } from '../../utils/loadCases';
import {
    CompiledModule,
    resetTempId,
    writeModule,
} from '../../generator/generate';
import { optimize } from '../optimize';

function countActions(module: CompiledModule) {
    let count = 0;
    for (const house of module.houses) {
        for (const handler of house.handlers) {
            count += handler.actions.length;
        }
    }
    return count;
}

describe('Optimizer', () => {
    beforeEach(() => {
        resetNodeId();
        resetTempId();
    });

    for (const r of loadCases(__dirname + '/cases/')) {
        it('should optimize ' + r.name, () => {
            const moduleAst = parse(r.code);
            const ctx = new CompilerContext();
            resolveModule(moduleAst, ctx);
            const module = writeModule(moduleAst, ctx);
            const oldActionsCount = countActions(module);
            optimize(module);
            const newActionsCount = countActions(module);
            expect(newActionsCount).toBeLessThan(oldActionsCount);
            expect(module).toMatchSnapshot();
        });
    }
});
